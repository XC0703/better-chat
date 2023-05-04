import Request from '@/utils/request';
import { RegisterParams, RegisterResponseData } from './type';

export const handleRegister = async (data: RegisterParams) => {
  const res = await Request.post<RegisterParams, RegisterResponseData>('/auth/register', data);
  return res.data;
}
