import Request from '@/utils/request';

// 验证上传的文件状态接口请求参数
interface IVertifyParams {
	// 文件Hash
	fileHash: string;
	// 文件总片数
	totalCount: number;
	// 文件后缀名
	extname: string;
}

// 验证上传的文件状态接口返回参数
interface IVertifyRes {
	// 需要上传的分片序列
	neededFileList: number[];
	// 消息
	message: string;
	// 文件路径
	filePath?: string;
}

// 文件分片上传接口请求参数
interface IUploadChunkParams {
	// 文件分片
	chunk: ArrayBuffer;
	// 当前分片序号
	chunkIndex: number;
	// 文件Hash
	fileHash: string;
	// 文件后缀名
	extname: string;
}

// 通知后端合并文件接口请求参数
interface IMergeFileParams {
	// 文件Hash
	fileHash: string;
	// 文件后缀名
	extname: string;
}

// 验证上传的文件状态
export const vertifyFile = async (params: IVertifyParams) => {
	const res = await Request.post<IVertifyParams, IVertifyRes>('/file/verify_file', params);
	return res.data;
};

// 文件分片上传
export const uploadChunk = async (params: IUploadChunkParams) => {
	const formData = new FormData();
	formData.append('chunk', new Blob([params.chunk]));
	formData.append('chunkIndex', params.chunkIndex.toString());
	formData.append('fileHash', params.fileHash);
	formData.append('extname', params.extname);
	const res = await Request.post('/file/upload_chunk', formData);
	return res.data;
};

// 文件合并
export const mergeFile = async (params: IMergeFileParams) => {
	const res = await Request.post<IMergeFileParams>('/file/merge_chunk', params);
	return res.data;
};
