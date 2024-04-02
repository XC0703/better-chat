// 登录接口参数类型
export interface ILoginParams {
	username: string;
	password: string;
}
// 登录接口返回的 data 类型
export interface ILoginResponseData {
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
