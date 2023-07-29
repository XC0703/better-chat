import { useEffect, useRef } from 'react';
import { Image } from 'antd';

import { serverURL } from '@/assets/links/baseURL';
import { IMessage } from '@/pages/container/ChatList/api/type';
import { userStorage } from '@/utils/storage';
import { toggleTime_chatContent } from '@/utils/formatTime';

import styles from './index.module.less';

// 给聊天框组件传递的参数
interface IChatContainer {
  histroyMsg: IMessage[];
}
// 给消息展示组件传递的参数
interface IChatContent {
  messageType: string;
  messageContent: string;
}

const ChatContainer = (props: IChatContainer) => {
  const { histroyMsg } = props;
  const chatRef = useRef<HTMLDivElement>(null);
  let prevTime: string | null = null;

  useEffect(() => {
    scrollToBottom();
  }, [histroyMsg]);

  const scrollToBottom = () => {
    chatRef.current!.scrollTop = chatRef.current!.scrollHeight;
  };

  // 消息内容(分为文本、图片、视频和文件)
  const ChatContent = (props: IChatContent): JSX.Element | null => {
    const { messageType, messageContent } = props;
    switch (messageType) {
      case 'text':
        return <div className={styles.content_text}>{messageContent}</div>;
      case 'image':
        return <Image width={100} src={serverURL + messageContent} />;
      // return <div className={styles.content_text}>{messageContent}</div>;
      case 'video':
        return <div className={styles.content_text}>{messageContent}</div>;
      case 'file':
        return <div className={styles.content_text}>{messageContent}</div>;
      default:
        return null;
    }
  };

  return (
    <div className={styles.chat_container} ref={chatRef}>
      {histroyMsg.map((item, index) => {
        const showTime = toggleTime_chatContent(item.created_at) !== prevTime;
        prevTime = toggleTime_chatContent(item.created_at);

        return (
          <div key={index} className={styles.chat_item}>
            {showTime && item.created_at && (
              <div className={styles.chat_notice}>
                <span>{toggleTime_chatContent(item.created_at)}</span>
              </div>
            )}
            {item.sender_id === JSON.parse(userStorage.getItem()).id ? (
              <div className={`${styles.self} ${styles.chat_item_content}`}>
                <ChatContent messageType={item.type} messageContent={item.content} />
                <div className={styles.avatar}>
                  <img src={item.avatar} alt="" />
                </div>
              </div>
            ) : (
              <div className={`${styles.other} ${styles.chat_item_content}`}>
                <div className={styles.avatar}>
                  <img src={item.avatar} alt="" />
                </div>
                <ChatContent messageType={item.type} messageContent={item.content} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChatContainer;
