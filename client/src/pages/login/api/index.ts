import Request from '@/utils/request';
import { ILoginParams, ILoginResponseData } from './type';

export const handleLogin = async (data: ILoginParams) => {
  const res = await Request.post<ILoginParams, ILoginResponseData>('/auth/login', data);
  return res.data;
}
