import { IMessageList } from '@/components/ChatTool/api/type';
import Request from '@/utils/request';

// 获取消息列表
export const getChatList = async () => {
  const res = await Request.get<IMessageList[]>('message/chat_list');
  return res.data;
}
