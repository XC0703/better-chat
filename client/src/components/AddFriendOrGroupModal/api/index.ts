import { IFriendParams, IFriend, IAddFriendParams, IGroupChat } from './type';

import Request from '@/utils/request';

// 模糊查询符合条件的用户
export const getFriendList = async (data: IFriendParams) => {
	const res = await Request.post<IFriendParams, IFriend[]>('/friend/search_user/', data);
	return res.data;
};
// 加好友
export const addFriend = async (data: IAddFriendParams) => {
	const res = await Request.post<IAddFriendParams>('/friend/add_friend', data);
	return res.data;
};
// 模糊查询符合条件的群
export const getGroupList = async (data: string) => {
	const res = await Request.get<IGroupChat[]>('/group/search_group?name=' + data);
	return res.data;
};
// 加群
export const addGroupChat = async (data: { group_id: number }) => {
	const res = await Request.post('/group/add_group', data);
	return res.data;
};
