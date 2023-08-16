import { IFriendGroup, IFriendInfo, IFriendGroupList, IUpdateFriendInfo, ICreateFriendGroup, IGetFriendInfoByUsername, IFriend } from './type';

import Request from '@/utils/request';

// 获取好友列表
export const getFriendList = async () => {
  const res = await Request.get<IFriendGroup[]>('friend/friend_list');
  return res.data;
}
// 根据id获取好友信息
export const getFriendInfoById = async (id: number) => {
  const res = await Request.get<IFriendInfo>('friend/get_friend_by_id/?id='+id);
  return res.data;
}
// 获取分组列表
export const getFriendGroup = async () => {
  const res = await Request.get<IFriendGroupList[]>('friend/group_list');
  return res.data;
}
// 修改好友信息
export const updateFriendInfo = async (data: IUpdateFriendInfo) => {
  const res = await Request.post('friend/update_friend', data);
  return res.data;
}
// 新建分组
export const createFriendGroup = async (data: ICreateFriendGroup) => {
  const res = await Request.post('friend/create_group', data);
  return res.data;
}
// 根据username获取好友信息
export const getFriendInfoByUsername = async (data: IGetFriendInfoByUsername) => {
  const res = await Request.post('friend/get_friend_by_username',data);
  return res.data;
}

