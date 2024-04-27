/**
 * 接口参数类型定义
 */
// 修改信息接口参数类型
export interface IChangePerInfoParams {
	username: string;
	name: string;
	phone: string;
	avatar: string;
	signature: string;
}
// 用户信息接口 —— 在client\src\pages\login\index.tsx、client\src\utils\logout.ts中也被引用到
export interface IUserInfo {
	id: number;
	avatar: string;
	username: string;
	name: string;
	phone: string;
	created_at: string;
	signature: string;
}
// 修改信息接口返回的 data 类型 —— 在client\src\pages\login\index.tsx中也被引用到
export interface ILoginResponseData {
	token: string;
	info: IUserInfo;
}

/**
 * 组件中用到的其它类型定义
 */
// 给修改个人信息组件传递的参数类型
export interface IChangePerInfoModalProps {
	openmodal: boolean;
	handleModal: (visible: boolean) => void;
}
// 修改用户信息表单类型
export interface IChangePerInfoForm {
	avatar: string;
	name: string;
	phone: string;
	signature: string;
}
