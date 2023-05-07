import Request from '@/utils/request';
import { IUserInfo } from './type';

export const handleLogout = async (data: IUserInfo) => {
  const res = await Request.post<IUserInfo>('/auth/logout', data);
  return res.data;
}
