import { IFriendInfo, IGroupChatInfo } from '@/pages/container/AddressBook/type';
/**
 * 接口参数类型定义
 */
// 建立 websocket 连接所需要传递的参数类型
export interface IConnectParams {
	room: string;
	sender_id: string;
	type: 'private' | 'group';
}

/**
 * 组件中用到的其它类型定义
 */
export interface IChatListProps {
	initSelectedChat: IFriendInfo | IGroupChatInfo | null;
}
