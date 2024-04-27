/**
 * 接口参数类型定义
 */
// 分组好友列表数据类型 —— 在client\src\pages\address-book\index.tsx、client\src\pages\address-book\api.ts中也被引用
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
// 群聊成员信息（右边展示）
interface IGroupChatMemberItem {
	avatar: string;
	created_at: string;
	lastMessageTime: string | null;
	username: string;
	name: string;
	nickname: string;
	user_id: number;
}
// 群聊具体信息 (右边展示)
// 在client\src\pages\address-book\index.tsx、client\src\pages\address-book\type.ts、client\src\pages\address-book\api.ts中也被引用
// 在client\src\pages\chat\index.tsx、client\src\pages\chat\type.ts中也被引用
// 在client\src\pages\container\index.tsx中也被引用
export interface IGroupChatInfo {
	announcement: string;
	avatar: string;
	created_at: string;
	creator_id: number;
	creator_username: string;
	id: number;
	name: string;
	room: string;
	members: IGroupChatMemberItem[];
}
// 给创建群聊弹窗组件传递的参数类型
export interface ICreateGroupModal {
	openmodal: boolean;
	handleModal: (visible: boolean) => void;
	type: 'create' | 'invite';
	groupChatInfo?: IGroupChatInfo; // 当type为invite时，需要传递群聊信息
}
// 创建群聊表单类型
export interface ICreateGroupForm {
	groupAvatar: string;
	groupName: string;
	announcement: string | null;
}
