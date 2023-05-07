import Request from '@/utils/request';
import { IRegisterParams, IRegisterResponseData } from './type';

export const handleRegister = async (data: IRegisterParams) => {
  const res = await Request.post<IRegisterParams, IRegisterResponseData>('/auth/register', data);
  return res.data;
}
