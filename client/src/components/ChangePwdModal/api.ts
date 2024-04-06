import { IChangePwdParams } from './type';

import Request from '@/utils/request';

// 修改密码
export const handleChange = async (data: IChangePwdParams) => {
	const res = await Request.post<IChangePwdParams>(`/auth/forget_password`, data);
	return res.data;
};
