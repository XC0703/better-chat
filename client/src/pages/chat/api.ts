import { IMessageListItem } from '@/components/ChatTool/type';
import Request from '@/utils/request';

// 获取消息列表
export const getChatList = async () => {
	const res = await Request.get<IMessageListItem[]>(`message/chat_list`);
	return res.data;
};
