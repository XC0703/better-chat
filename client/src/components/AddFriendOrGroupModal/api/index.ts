import Request from '@/utils/request';
import { IFriendParams,IFriend,IAddFriendParams } from './type';

// 模糊查询符合条件的用户
export const getFriendList = async (data:IFriendParams) => {
  const res = await Request.post<IFriendParams,IFriend[]>('/friend/search_user/',data);
  return res.data;
}
// 加好友
export const addFriend = async (data:IAddFriendParams) => {
  const res = await Request.post<IAddFriendParams>('/friend/add_friend',data);
  return res.data;
}
