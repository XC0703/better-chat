import { IFriendInfo } from './type';

import Request from '@/utils/request';

// 根据username获取好友信息
export const getFriendInfoByUsername = async (username: string) => {
  const res = await Request.get<IFriendInfo>('friend/get_friend_by_username/?username='+username);
  return res.data;
}
