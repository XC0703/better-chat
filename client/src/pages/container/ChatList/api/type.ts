// 建立websocket连接所需要传递的参数类型
export interface IConnectParams {
  room: string;
  sender_id: string;
}
// 消息的类型
export interface IMessage {
  user_id: number;// 接受者id
  name: string; // 接受者备注名字
  receiver_username: string; // 接受者用户名
  room: string; // 房间号
  updated_at: Date; // 发送时间
  unreadCount: number; // 未读消息数
  lastMessage: string; // 最后一条消息
  type: string; // 消息类型
  avatar: string; // 接受者头像
}
