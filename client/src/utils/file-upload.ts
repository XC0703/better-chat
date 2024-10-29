import { HttpStatus } from '@/utils/constant';
import { mergeFile, uploadChunk, vertifyFile } from '@/utils/file-api';

interface IUploadFileRes {
	success: boolean;
	filePath?: string;
	message: string | '';
}

/**
 * 分片上传：
 * 1. 将文件进行分片并计算Hash值：得到 allChunkList---所有分片，fileHash---文件的hash值
 * 2. 通过fileHash请求服务端，判断文件上传状态，得到 neededFileList---待上传文件分片
 * 3. 同步上传进度，针对不同文件上传状态调用 progress_cb
 * 4. 发送上传请求
 * 5. 发送文件合并请求
 * @param {File} file 目标上传文件
 * @param {number} baseChunkSize 上传分片大小，单位Mb
 * @param {Function} progress_cb 更新上传进度的回调函数
 * @returns {Promise}
 */
export async function uploadFile(
	file: File,
	baseChunkSize: number,
	progress_cb?: (progress: number) => void
): Promise<IUploadFileRes> {
	return new Promise((resolve, reject) => {
		const chunkList: ArrayBuffer[] = [];
		let fileHash = '';
		// 创建文件分片Worker
		const sliceFileWorker = new Worker(new URL('./slice-md5-worker.ts', import.meta.url), {
			type: 'module'
		});
		// 将文件以及分片大小通过postMessage发送给sliceFileWorker线程
		sliceFileWorker.postMessage({ targetFile: file, baseChunkSize });
		// 分片处理完之后触发onmessage事件
		sliceFileWorker.onmessage = async e => {
			switch (e.data.messageType) {
				case 'success':
					chunkList.push(...e.data.chunks);
					fileHash = e.data.fileHash;
					// 处理文件
					try {
						const result = await handleFile(file, chunkList, fileHash, progress_cb);
						if (result.success) {
							resolve(result);
						} else {
							reject({ success: false, message: result.message });
						}
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
					} catch (error: any) {
						reject({ success: false, message: error.message });
					}
					break;
				case 'progress':
					chunkList.push(...e.data.chunks);
					break;
				case 'fail':
					reject({ success: false, message: '文件分片处理出错' });
					break;
				default:
					break;
			}
		};
	});
}

async function handleFile(
	file: File,
	chunkList: ArrayBuffer[],
	fileHash: string,
	progress_cb?: (progress: number) => void
): Promise<IUploadFileRes> {
	const filename = file.name;
	const extname = filename.split('.')[1];
	// 所有分片 ArrayBuffer[]
	const allChunkList = chunkList;
	// 需要上传的分片序列 number[]
	let neededChunkList: number[] = [];
	// 上传进度
	let progress = 0;
	try {
		const params = {
			fileHash,
			totalCount: allChunkList.length,
			extname
		};
		const res = await vertifyFile(params);

		if (res.code === HttpStatus.FILE_EXIST) {
			// 文件已存在，秒传
			return {
				success: true,
				filePath: res.data.filePath,
				message: res.data.message || ''
			};
		} else if (res.code === HttpStatus.ALL_CHUNK_UPLOAD) {
			// 已完成所有分片上传，请合并文件
			const mergeParams = {
				fileHash,
				extname
			};
			const mergeRes = await mergeFile(mergeParams);
			if (mergeRes.code === HttpStatus.SUCCESS) {
				return {
					success: true,
					filePath: mergeRes.data.filePath,
					message: mergeRes.data.message || ''
				};
			} else {
				throw new Error('文件合并失败');
			}
		} else if (res.code === HttpStatus.SUCCESS) {
			// 获取需要上传的分片序列
			const { neededFileList, message } = res.data;
			if (!neededFileList.length) {
				return {
					success: true,
					filePath: res.data.filePath,
					message: message || ''
				};
			}
			// 部分上传成功，更新neededChunkList，断点续传
			neededChunkList = neededFileList;
		} else {
			throw new Error('获取文件上传状态失败');
		}
	} catch {
		throw new Error('获取文件上传状态失败');
	}

	// 同步上传进度，断点续传情况下
	progress = ((allChunkList.length - neededChunkList.length) / allChunkList.length) * 100;
	// 上传
	if (allChunkList.length) {
		// 为每个需要上传的分片发送请求
		const requestList = allChunkList.map(async (chunk: ArrayBuffer, index: number) => {
			if (neededChunkList.includes(index + 1)) {
				const params = {
					chunk,
					chunkIndex: index + 1,
					fileHash,
					extname
				};
				try {
					const res = await uploadChunk(params);
					if (res.code === HttpStatus.SUCCESS) {
						// 更新进度
						progress += Math.ceil(100 / allChunkList.length);
						if (progress >= 100) progress = 100;
						if (progress_cb) progress_cb(progress);
						return;
					} else {
						throw new Error('分片上传失败');
					}
				} catch {
					throw new Error('分片上传失败');
				}
			}
		});
		// 等待所有请求完成，发送合并请求
		try {
			await Promise.all(requestList);
			const params = {
				fileHash,
				extname
			};
			const res = await mergeFile(params);
			if (res.code === HttpStatus.SUCCESS) {
				return {
					success: true,
					filePath: res.data.filePath,
					message: res.data.message || ''
				};
			} else {
				throw new Error('文件合并失败');
			}
		} catch {
			throw new Error('文件合并失败');
		}
	} else {
		throw new Error('文件分片失败');
	}
}