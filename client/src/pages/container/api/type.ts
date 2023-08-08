// 好友信息类型
export interface IFriendInfo {
  friend_id: number;
  online_status: "online" | "offline";
  remark: string;
  group_id: number;
  group_name: string;
  room: string;
  unread_msg_count: number;
  username: string;
  avatar: string;
  phone: string;
  name: string;
  signature: string | null;
}
