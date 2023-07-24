import { IMessage } from '@/pages/container/ChatList/api/type';
import { userStorage } from '@/utils/storage';
import { toggleTime_chatContent } from '@/utils/formatTime';

import styles from './index.module.less';

// 给聊天框组件传递的参数
interface IChatContainer {
  histroyMsg: IMessage[];
}

const ChatContainer = (props: IChatContainer) => {
  const { histroyMsg } = props;

  return (
    <div className={styles.chat_container}>
      {histroyMsg.map((item, index) => (
        <div key={index} className={styles.chat_item}>
          {item.created_at && (
            <div className={styles.chat_notice}>
              <span>{toggleTime_chatContent(item.created_at)}</span>
            </div>
          )}
          <div
            className={`${item.sender_id === JSON.parse(userStorage.getItem()).id ? styles.self : styles.other} ${
              styles.chat_item_content
            }`}
          >
            <div className={styles.avatar}>
              <img src={item.avatar} alt="" />
            </div>
            <div className={styles.content}>
              <div className={styles.triangle}></div>
              <span>{item.content}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatContainer;
