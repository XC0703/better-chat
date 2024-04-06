import { MessageType } from '@/components/ChatTool/type';

/**
 * 组件用到的其它类型定义
 */
// 右侧历史消息项的类型 —— 在client\src\pages\container\ChatList\index.tsx中也被引用
export interface IHistoryMessageItem {
	sender_id: number;
	receiver_id: number;
	content: string;
	room: string;
	avatar: string;
	type: MessageType;
	file_size: string | null;
	created_at: Date;
}
// 给聊天框组件传递的参数类型
export interface IChatContainerProps {
	historyMsg: IHistoryMessageItem[];
}
// 给消息展示组件传递的参数类型
export interface IChatContentProps {
	messageType: MessageType;
	messageContent: string;
	fileSize?: string | null;
}
// 图片/视频的信息（类型，URL，尺寸）
export interface IMediaInfo {
	type: 'image' | 'video';
	url: string;
	size: { width: number; height: number };
}
