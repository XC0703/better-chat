import { IChangePerInfoParams } from './type';

import Request from '@/utils/request';

// 修改用户信息接口
export const handleChange = async (data: IChangePerInfoParams) => {
	const res = await Request.post<IChangePerInfoParams>(`/auth/update_info`, data);
	return res.data;
};
