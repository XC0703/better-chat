// 好友列表数据类型
export interface IFriend {
	id: number;
	user_id: number;
	username: string;
	avatar: string;
	online_status: 'online' | 'offline';
	remark: string;
	group_id: number;
	room: null;
	unread_msg_count: number;
	created_at: string;
	updated_at: string;
}
export interface IFriendGroup {
	name: string;
	online_counts: number;
	friend: IFriend[];
}
// 好友信息类型
export interface IFriendInfo {
	friend_id: number;
	friend_user_id: number;
	online_status: 'online' | 'offline';
	remark: string;
	group_id: number;
	group_name: string;
	room: string;
	unread_msg_count: number;
	username: string;
	avatar: string;
	phone: string;
	name: string;
	signature: string | null;
}
// 好友分组类型
export interface IFriendGroupList {
	id: number;
	user_id: number;
	username: string;
	name: string;
	created_at: string;
	updated_at: string;
}
// 修改好友信息传递的参数
export interface IUpdateFriendInfo {
	friend_id: number;
	remark: string;
	group_id: number;
}
// 新建分组传递的参数
export interface ICreateFriendGroup {
	user_id: number;
	username: string;
	name: string;
}
// 根据 username 获取好友信息时传递的参数
export interface IGetFriendInfoByUsername {
	friend_username: string;
	self_username: string;
}
// 群聊（列表项）信息
export interface IGroupChatItem {
	id: number;
	name: string;
	creator_id: number;
	avatar: string;
	announcement: string;
	room: string;
	created_at: string;
	updated_at: string;
}
// 群聊成员信息（右边展示）
export interface IGroupChatMember {
	avatar: string;
	created_at: string;
	lastMessageTime: string | null;
	name: string;
	nickname: string;
	user_id: number;
}
// 群聊具体信息 (右边展示)
export interface IGroupChatInfo {
	announcement: string;
	avatar: string;
	created_at: string;
	creator_id: number;
	creator_username: string;
	id: number;
	name: string;
	room: string;
	members: IGroupChatMember[];
}
