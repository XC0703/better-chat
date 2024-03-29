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
  online_counts:number;
  friend: IFriend[];
}
// 创建群聊时成员数据类型
export interface IGroupMember{
  user_id:number;
  username: string;
  avatar: string;
}
// 创建群聊时传递的参数
export interface ICreateGroupParams{
  name:string;
  announcement:string;
  avatar:string;
  members:IGroupMember[];
}
// 邀请新的好友进入群聊时传递的参数
export interface InviteFriendsParams{
  groupId:number;
  invitationList:IGroupMember[];
}
