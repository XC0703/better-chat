import Request from '@/utils/request';
import { IFriend,IGroup } from './type';

// 获取好友列表
export const getFriendList = async (data:string) => {
  const res = await Request.get<IFriend[]>('/friend/search?name='+data);
  return res.data;
}
// 加好友
export const addFriend = async (data:{friend_id:number}) => {
  const res = await Request.post('/friend/add',data);
  return res.data;
}
// 获取群聊列表
export const getGroupList =  async (data:string) => {
  const res = await Request.get<IGroup[]>('/group/search?name='+data);
  return res.data;
}
// 加群
export const addGroup = async (data:{group_id:number}) => {
  const res = await Request.post('/group/add',data);
  return res.data;
}
