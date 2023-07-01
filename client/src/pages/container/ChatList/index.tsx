import SearchContainer from '@/components/SearchContainer';

import styles from './index.module.less';

const ChatList = () => {
  return (
    <>
      <div className={styles.chatList}>
        <div className={styles.leftContainer}>
          <div className={styles.search}>
            <SearchContainer />
          </div>
          <div className={styles.list}>聊天列表</div>
        </div>
        <div className={styles.rightContainer}>聊天窗口</div>
      </div>
    </>
  );
};

export default ChatList;
