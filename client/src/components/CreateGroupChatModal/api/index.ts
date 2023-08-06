import { IFriendGroup } from './type';

import Request from '@/utils/request';

// 获取好友列表
export const getFriendList = async () => {
  const res = await Request.get<IFriendGroup[]>('friend/friend_list');
  return res.data;
}
