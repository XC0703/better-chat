import Request from '@/utils/request';
import { IMessage } from './type';

// 获取消息列表
export const getChatList = async () => {
  const res = await Request.get<IMessage[]>('message/chat_list');
  return res.data;
}
