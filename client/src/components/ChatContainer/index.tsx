import { useEffect, useMemo, useRef } from 'react';

import styles from './index.module.less';
import { IChatContainerProps } from './type';

import MessageShow from '@/components/MessageShow';
import { formatChatContentTime } from '@/utils/time';

const ChatContainer = (props: IChatContainerProps) => {
	const { historyMsg, newMsg } = props;
	const chatRef = useRef<HTMLDivElement>(null);
	let prevTime: string | null = null;

	useEffect(() => {
		scrollToBottom();
	}, [historyMsg, newMsg]);

	const scrollToBottom = () => {
		chatRef.current!.scrollTop = chatRef.current!.scrollHeight;
	};

	// 历史消息不必重新渲染
	const HistoryMsg = useMemo(() => {
		if (!historyMsg || historyMsg.length === 0) return;
		return historyMsg.map((item, index) => {
			const showTime = formatChatContentTime(item.created_at) !== prevTime;
			prevTime = formatChatContentTime(item.created_at);

			return (
				<div key={index} className={styles.chat_item}>
					<MessageShow showTime={showTime} message={item} />
				</div>
			);
		});
	}, [historyMsg]);

	// 新消息
	const NewMsg = useMemo(() => {
		if (!newMsg || newMsg.length === 0) return;
		return newMsg.map((item, index) => {
			const showTime = formatChatContentTime(item.created_at) !== prevTime;
			prevTime = formatChatContentTime(item.created_at);

			return (
				<div key={index} className={styles.chat_item}>
					<MessageShow showTime={showTime} message={item} />
				</div>
			);
		});
	}, [newMsg]);

	return (
		<div className={styles.chat_container} ref={chatRef}>
			{HistoryMsg}
			{NewMsg}
		</div>
	);
};

export default ChatContainer;
