/**
 * 组件中用到的其它类型定义
 */
// 聊天页面组件实例类型
export interface IChatRef {
	refreshChatList: () => void;
}
// 通讯录页面组件实例类型
export interface IAddressBookRef {
	refreshFriendList: () => void;
	refreshGroupChatList: () => void;
}
