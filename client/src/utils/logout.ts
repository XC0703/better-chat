import { IUserInfo } from './generalType';

import Request from '@/utils/request';

// 退出登录
export const handleLogout = async (data: IUserInfo) => {
	const res = await Request.post<IUserInfo>('/auth/logout', data);
	return res.data;
};

export type { IUserInfo };
