// 注册接口参数类型
export interface IRegisterParams {
	username: string;
	phone: string;
	password: string;
	confirmPassword: string;
}
// 注册接口返回的 data 类型
export interface IRegisterResponseData {
	token: string;
	info: {
		id: number;
		avatar: string;
		username: string;
		name: string;
		phone: string;
		created_at: string;
		signature: string;
	};
}
