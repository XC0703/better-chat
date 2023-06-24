import Request from '@/utils/request';
import { IFriendParams,IFriend,IAddFriendParams,IGroup } from './type';

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
// 模糊查询符合条件的群
export const getGroupList =  async (data:string) => {
  const res = await Request.get<IGroup[]>('/group/search?name='+data);
  return res.data;
}
// 加群
export const addGroup = async (data:{group_id:number}) => {
  const res = await Request.post('/group/add',data);
  return res.data;
}
