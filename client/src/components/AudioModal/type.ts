/**
 * 接口参数类型定义
 */
// 建立音视频通话的 websocket 连接所需要传递的参数类型
export interface IConnectParams {
	room: string;
	username: string;
	type: 'private' | 'group';
}

/**
 * 组件中用到的其它类型定义
 */
// 给音视频通话弹窗组件传递的参数类型
export interface ICallModalProps {
	openmodal: boolean;
	handleModal: (visible: boolean) => void;
	status: callStatusType;
	type: 'private' | 'group';
	callInfo: {
		room: string;
		callReceiverList: ICallReceiverInfo[]; // 私聊时为对方信息，群聊时为其它群成员信息
	};
}
// 音视频通话对象信息 —— 在client\src\components\ChatTool\index.tsx中也被引用
export interface ICallReceiverInfo {
	username: string;
	alias: string; // 好友备注或群昵称
	avatar: string;
}
// 音视频通话状态
export enum CallStatus {
	INITIATE = 'initiate',
	RECEIVE = 'receive',
	CALLING = 'calling'
}
export type callStatusType = 'initiate' | 'receive' | 'calling';
// 音视频通话对象涉及的信息类型
export interface ICallList {
	[username: string]: {
		PC: RTCPeerConnection | null;
		alias: string; // 好友备注或群昵称
		avatar: string;
	};
}
// 在当前房间内正在通话的所有人的信息
export interface IRoomMembersItem {
	username: string;
	muted: boolean;
	showVideo?: boolean;
}
