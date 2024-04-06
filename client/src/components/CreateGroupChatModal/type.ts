import { IGroupChatInfo } from '@/pages/container/AddressBook/type';
/**
 * 接口参数类型定义
 */
// 分组好友列表数据类型 —— 在client\src\pages\container\AddressBook\index.tsx、client\src\pages\container\AddressBook\index.ts中也被引用
export interface IFriendGroupItem {
	name: string;
	online_counts: number;
	friend: IFriendItem[];
}
// 单个好友数据类型
export interface IFriendItem {
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
// 创建群聊时成员数据类型
export interface IGroupMemberItem {
	user_id: number;
	username: string;
	avatar: string;
}
// 创建群聊时传递的参数
export interface ICreateGroupParams {
	name: string;
	announcement: string;
	avatar: string;
	members: IGroupMemberItem[];
}
// 邀请新的好友进入群聊时传递的参数
export interface InviteFriendsParams {
	groupId: number;
	invitationList: IGroupMemberItem[];
}

/**
 * 组件中用到的其它参数类型定义
 */
// 给创建群聊弹窗组件传递的参数类型
export interface ICreateGroupModal {
	openmodal: boolean;
	handleModal: (visible: boolean) => void;
	type: 'create' | 'invite';
	groupChatInfo?: IGroupChatInfo;
}
// 创建群聊表单类型
export interface ICreateGroupForm {
	groupAvatar: string;
	groupName: string;
	announcement: string | null;
}
