import { IGroupChatInfo } from '@/components/CreateGroupChatModal/type';
/**
 * 接口参数类型定义
 */
// 好友信息类型
// 在client\src\pages\chat\type.ts、client\src\pages\chat\index.tsx中也被引用
// 在client\src\pages\home\index.tsx中也被引用
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
export interface IFriendGroupListItem {
	id: number;
	user_id: number;
	username: string;
	name: string;
	created_at: string;
	updated_at: string;
}
// 修改好友信息传递的参数类型
export interface IUpdateFriendInfo {
	friend_id: number;
	remark: string;
	group_id: number;
}
// 新建分组传递的参数类型
export interface ICreateFriendGroup {
	user_id: number;
	username: string;
	name: string;
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

/**
 * 组件中用到的其它类型定义
 */
// 给通讯录组件传递的参数类型
export interface IAddressBookProps {
	handleChooseChat: (chatInfo: IFriendInfo | IGroupChatInfo) => void;
}
// 当前 tab 是好友还是群聊
export enum TabType {
	FRIEND = '1',
	GROUP_CHAT = '2'
}
// 好友信息表单类型
export interface IFriendInfoForm {
	username: string;
	name: string;
	remark: string;
	group: number;
}
