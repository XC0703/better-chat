import Request from '@/utils/request';
import { IChangeParams,IUserInfo } from './type';

// 修改密码接口
export const handleChange = async (data: IChangeParams) => {
  const res = await Request.post<IChangeParams>('/auth/forget_password', data);
  return res.data;
}
// 退出登录接口
export const handleLogout = async (data: IUserInfo) => {
  const res = await Request.post<IUserInfo>('/auth/logout', data);
  return res.data;
}

