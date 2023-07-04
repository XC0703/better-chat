// 好友列表数据类型
export interface IFriend {
  id: number;
  user_id: number;
  username: string;
  avatar: string;
  online_status: "online" | "offline";
  remark: string;
  group_id: number;
  room: null;
  unread_msg_count: number;
  created_at: string;
  updated_at: string;
}
export interface IFriendGroup {
  name: string;
  friend: IFriend[];
}
// 好友信息类型
export interface IFriendInfo {
  friend_id: number;
  user_id: number;
  online_status: "online" | "offline";
  remark: string;
  group_id: number;
  group_name: string;
  room: string | null;
  unread_msg_count: number;
  username: string;
  avatar: string;
  phone: string;
  name: string;
  signature: string | null;
}
