import { IUserInfo } from '@/utils/logout';
/**
 * 接口参数类型定义
 */
// 登录接口参数类型
export interface ILoginParams {
	username: string;
	password: string;
}
// 登录接口返回的 data 类型
export interface ILoginResponseData {
	token: string;
	info: IUserInfo;
}

/**
 * 组件中用到的其它类型定义
 */
// 登录表单类型
export interface ILoginForm {
	username: string;
	password: string;
}
