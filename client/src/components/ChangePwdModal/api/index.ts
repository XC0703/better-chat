import { IChangeParams } from './type';

import Request from '@/utils/request';

// 修改密码接口
export const handleChange = async (data: IChangeParams) => {
	const res = await Request.post<IChangeParams>('/auth/forget_password', data);
	return res.data;
};
