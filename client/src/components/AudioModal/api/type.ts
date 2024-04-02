// 音视频通话状态
export enum CallStatus {
	INITIATE = 'initiate',
	RECEIVE = 'receive',
	CALLING = 'calling'
}
export type callStatusType = 'initiate' | 'receive' | 'calling';
// 音视频通话弹窗组件参数
export interface ICallModalProps {
	openmodal: boolean;
	handleModal: (open: boolean) => void;
	status: callStatusType;
	friendInfo: ICallFriendInfo;
}
export interface ICallFriendInfo {
	receiver_username: string;
	remark: string;
	avatar: string;
	room: string;
}
// 建立音视频通话的 websocket 连接所需要传递的参数类型
export interface IConnectParams {
	room: string;
	username: string;
}
