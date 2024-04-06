/**
 * 接口参数类型
 */
// 上传图片的接口参数类型定义
export interface UploadImageParams {
	base64: string;
}

/**
 * 组件中用到的其它参数类型定义
 */
// 图片上传组件 —— 用于个人/群聊头像上传
export interface IImageUploadProps {
	onUploadSuccess: (filePath: string) => void; // 图片上传成功后的回调
	initialImageUrl?: string | null; // 初始回显的图片 URL
}
