// 好友类型
export interface IFriend {
  friend_id: number;
  username: string;
  avatar: string;
  status: boolean;
}

// 群聊类型
export interface IGroup {
  group_id: number;
  name: string;
  number: number;
  status: boolean;
}
