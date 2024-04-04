import Request from '@/utils/request';

// 用户信息接口
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
