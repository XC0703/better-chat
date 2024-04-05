import Request from '@/utils/request';

// 用户信息接口 —— 登录成功之后用户信息会存储在localStorage中，很多地方都会用到用户信息，所以这里独立定义一个接口类型
export interface IUserInfo {
	id: number;
	avatar: string;
	username: string;
	name: string;
	phone: string;
	created_at: string;
	signature: string;
}

// 退出登录
export const handleLogout = async (data: IUserInfo) => {
	const res = await Request.post<IUserInfo>('/auth/logout', data);
	return res.data;
};
