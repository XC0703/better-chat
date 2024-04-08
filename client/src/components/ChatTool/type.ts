/**
 * 组件中用到的其它类型定义
 */
// 消息类型目前分为 text(文本),image(图片),video(视频),file(文件) —— 在client\src\components\ChatContainer\type.ts中也被引用
export type MessageType = 'text' | 'image' | 'video' | 'file';
// 发送消息的类型——在client\src\pages\container\ChatList\index.tsx中也被引用
export interface ISendMessage {
	sender_id: number;
	receiver_id: number;
	type: MessageType;
	content: string | number[];
	avatar: string;
	filename?: string;
	fileTraStatus?: 'start' | 'upload';
	fileInfo?: string;
}
// 左侧消息列表项类型 —— 在client\src\pages\container\ChatList\index.tsx、client\src\pages\container\ChatList\index.ts中也被引用
export interface IMessageListItem {
	receiver_id: number; // 好友 id / 群聊 id
	name: string; // 接受者备注 / 群聊名称
	receiver_username?: string; // 接受者用户名，有这字段时说明是私聊，否则是群聊
	room: string; // 房间号
	updated_at: Date; // 发送时间
	unreadCount: number; // 未读消息数
	lastMessage: string; // 最后一条消息
	type: string; // 消息类型
	avatar: string; // 接受者头像
}
// 给聊天输入工具组件传递的参数类型
export interface IChatToolProps {
	// 当前选中的对话信息
	curChatInfo: IMessageListItem;
	// 发送消息的回调函数
	sendMessage: (message: ISendMessage) => void;
}
