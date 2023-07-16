import Request from '@/utils/request';
import { IChangeParams } from './type';

// 修改用户信息接口
export const handleChange = async (data: IChangeParams) => {
  const res = await Request.post<IChangeParams>('/auth/update_info', data);
  return res.data;
}
