import { IMessageItem } from '@/components/MessageShow/type';

/**
 * 组件用到的其它类型定义
 */
// 给聊天框组件传递的参数类型
export interface IChatContainerProps {
	historyMsg: IMessageItem[];
	newMsg: IMessageItem[];
}
