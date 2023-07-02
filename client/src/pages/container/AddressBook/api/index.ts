import Request from '@/utils/request';
import { IFriendGroup,IUserInfo } from './type';

// 获取好友列表
export const getFriendList = async () => {
  const res = await Request.get<IFriendGroup[]>('friend/friend_list');
  return res.data;
}
// 根据id获取好友信息
export const getFriendInfoById = async (id: number) => {
  const res = await Request.get<IUserInfo>('friend/get_friend/?id='+id);
  return res.data;
}
