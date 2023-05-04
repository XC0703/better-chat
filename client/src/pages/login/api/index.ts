import Request from '@/utils/request';
import { LoginParams, LoginResponseData } from './type';

export const handleLogin = async (data: LoginParams) => {
  const res = await Request.post<LoginParams, LoginResponseData>('/auth/Login', data);
  return res.data;
}
