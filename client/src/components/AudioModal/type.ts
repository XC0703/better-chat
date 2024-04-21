/**
 * 接口参数类型定义
 */
// 建立音视频通话的 websocket 连接所需要传递的参数类型
export interface IConnectParams {
	room: string;
	username: string;
}

/**
 * 组件中用到的其它类型定义
 */
// 给音视频通话弹窗组件传递的参数类型
export interface ICallModalProps {
	openmodal: boolean;
	handleModal: (visible: boolean) => void;
	status: callStatusType;
	friendInfo: ICallFriendInfo;
}
// 音视频通话的好友信息类型 —— 在client\src\pages\home\index.tsx中也被引用
export interface ICallFriendInfo {
	receiver_username: string;
	remark: string;
	avatar: string;
	room: string;
}
// 音视频通话状态
export enum CallStatus {
	INITIATE = 'initiate',
	RECEIVE = 'receive',
	CALLING = 'calling'
}
export type callStatusType = 'initiate' | 'receive' | 'calling';
