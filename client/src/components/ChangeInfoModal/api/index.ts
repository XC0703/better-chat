import { IChangeParams } from './type';

import Request from '@/utils/request';

// 修改用户信息接口
export const handleChange = async (data: IChangeParams) => {
  const res = await Request.post<IChangeParams>('/auth/update_info', data);
  return res.data;
}
