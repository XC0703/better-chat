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
// 本地存储的用户信息类型
export interface IUserInfo {
  id: number;
  avatar: string;
  username: string;
  name: string;
  phone: string;
  created_at: string;
  signature: string;
}
