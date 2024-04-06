/**
 * 接口参数类型定义
 */
// 模糊查询用户参数类型
export interface IFriendParams {
	sender: {
		id: number;
		avatar: string;
		username: string;
		name: string;
		phone: string;
		created_at: string;
		signature: string;
	};
	username: string;
}
// 模糊查询用户的类型
export interface IFriendItem {
	name: string;
	username: string;
	id: number;
	avatar: string;
	status: boolean;
}
// 加好友参数类型
export interface IAddFriendParams {
	sender: {
		id: number;
		avatar: string;
		username: string;
		name: string;
		phone: string;
		created_at: string;
		signature: string;
	};
	id: number;
	username: string;
	avatar: string;
}
// 群聊类型
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
