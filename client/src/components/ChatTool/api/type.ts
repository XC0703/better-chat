// 消息类型目前分为 text(文本),image(图片),video(视频),file(文件)
type MessageType = 'text' | 'image' | 'video' | 'file';
// 发送消息的类型
export interface ISendMessage {
	filename?: string;
	sender_id: number;
	receiver_id: number;
	type: MessageType;
	content: string | number[];
	avatar: string;
	fileType?: string;
	fileInfo?: string;
}
// 当前选中的消息类型
export interface IMessageList {
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
