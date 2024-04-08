/**
 * 接口参数类型定义
 */
// 获取好友的类型
export interface IFriendItem {
	name: string;
	username: string;
	id: number;
	avatar: string;
	status: boolean;
}
// 加好友参数类型
export interface IAddFriendParams {
	id: number;
	username: string;
	avatar: string;
}
// 获取的群聊类型
export interface IGroupItem {
	avatar: string;
	group_id: number;
	name: string;
	number: number;
	status: boolean;
}
// 加入群聊参数类型
export interface IAddGroupParams {
	group_id: number;
}

/**
 * 组件中用到的其它类型定义
 */
// 给添加好友或群聊弹窗组件传递的参数类型
export interface IAddFriendOrGroupModalProps {
	openmodal: boolean;
	handleModal: (visible: boolean) => void;
}
