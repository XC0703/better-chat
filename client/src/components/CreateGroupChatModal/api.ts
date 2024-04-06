import { IFriendGroupItem, ICreateGroupParams, InviteFriendsParams } from './type';

import Request from '@/utils/request';

// 获取好友列表
export const getFriendList = async () => {
	const res = await Request.get<IFriendGroupItem[]>(`friend/friend_list`);
	return res.data;
};
// 创建群聊
export const createGroup = async (data: ICreateGroupParams) => {
	const res = await Request.post<ICreateGroupParams>(`/group/create_group`, data);
	return res.data;
};
// 邀请新的好友进入群聊
export const inviteFriend = async (data: InviteFriendsParams) => {
	const res = await Request.post<InviteFriendsParams>(`/group/invite_friend`, data);
	return res.data;
};
