import {
	IFriendInfo,
	IFriendGroupListItem,
	IUpdateFriendInfo,
	ICreateFriendGroup,
	IGroupChatItem,
	IGroupChatInfo
} from './type';

import { IFriendGroupItem } from '@/components/CreateGroupChatModal/type';
import Request from '@/utils/request';

// 获取好友列表
export const getFriendList = async () => {
	const res = await Request.get<IFriendGroupItem[]>(`friend/friend_list`);
	return res.data;
};
// 根据 id 获取好友信息
export const getFriendInfoById = async (id: number) => {
	const res = await Request.get<IFriendInfo>(`friend/friend_id/?id=${id}`);
	return res.data;
};
// 根据 username 获取好友信息
export const getFriendInfoByUsername = async (username: string) => {
	const res = await Request.get<IFriendInfo>(`friend/friend_username?friend_username=${username}`);
	return res.data;
};
// 获取分组列表
export const getFriendGroup = async () => {
	const res = await Request.get<IFriendGroupListItem[]>(`friend/group_list`);
	return res.data;
};
// 修改好友信息
export const updateFriendInfo = async (data: IUpdateFriendInfo) => {
	const res = await Request.post<IUpdateFriendInfo>(`friend/update_friend`, data);
	return res.data;
};
// 新建分组
export const createFriendGroup = async (data: ICreateFriendGroup) => {
	const res = await Request.post<ICreateFriendGroup>(`friend/create_group`, data);
	return res.data;
};
// 获取群聊列表
export const getGroupChatList = async () => {
	const res = await Request.get<IGroupChatItem[]>(`group/group_list`);
	return res.data;
};
// 获取群聊信息
export const getGroupChatInfo = async (group_id: number) => {
	const res = await Request.get<IGroupChatInfo>(`group/group_info?group_id=${group_id}`);
	return res.data;
};
