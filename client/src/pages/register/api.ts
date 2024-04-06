import { IRegisterParams, IRegisterResponseData } from './type';

import Request from '@/utils/request';

export const handleRegister = async (data: IRegisterParams) => {
	const res = await Request.post<IRegisterParams, IRegisterResponseData>(`/auth/register`, data);
	return res.data;
};
