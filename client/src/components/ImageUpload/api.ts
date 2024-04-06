import { UploadImageParams } from './type';

import Request from '@/utils/request';

// 上传图片的接口 —— 将图片的 base64 编码字符串传给后端，后端将文件存在服务器后再将文件 URL 返回（TODO：后期文件上传完善后，可以考虑合并在一起）
export const uploadImage = async (data: UploadImageParams) => {
	const res = await Request.post<UploadImageParams>(`/auth/upload_image`, data);
	return res.data;
};
