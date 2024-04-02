// 建立websocket连接所需要传递的参数类型
export interface IConnectParams {
  room: string;
  sender_id: string;
  type: 'private' | 'group';
}
// 历史消息的类型
export interface IMessage {
  sender_id: number;
  receiver_id: number;
  content: string;
  room: string;
  avatar: string;
  type: string;
  file_size: string | null;
  created_at: Date;
}
