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
export interface IFriend {
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
export interface IGroupChat {
	avatar: string;
	group_id: number;
	name: string;
	number: number;
	status: boolean;
}
