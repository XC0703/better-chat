import { Button, Tooltip } from 'antd';
import { useState } from 'react';

import { WechatOutlined } from '@ant-design/icons';
import { statusIconList, chatIconList } from '@/assets/icons';
import SearchContainer from '@/components/SearchContainer';

import styles from './index.module.less';

interface ChatItem {
  room: string;
  avatar?: string;
  name: string;
  updated_at: string;
  unreadCount: number;
}
function generateMockData(): ChatItem[] {
  const mockData: ChatItem[] = [];

  // 生成多个模拟数据
  for (let i = 0; i < 10; i++) {
    const item: ChatItem = {
      room: `Room ${i}`,
      avatar: `https://ui-avatars.com/api/?name=xcgogogo`,
      name: `User ${i}`,
      updated_at: '2023-07-13 15:15:51', // 你可以填写当前日期时间或者其他适当的时间
      unreadCount: Math.floor(Math.random() * 10), // 生成随机的未读消息数
    };

    mockData.push(item);
  }
  return mockData;
}

// 调用该函数生成模拟数据
const mockData = generateMockData();

const ChatList = () => {
  const [curChatInfo, setCurChatInfo] = useState<ChatItem>(); // 当前选中的对话信息

  const chooseRoom = (item: ChatItem) => {
    // 处理选择房间的逻辑
    console.log(item);
    setCurChatInfo(item);
  };

  return (
    <>
      <div className={styles.chatList}>
        <div className={styles.leftContainer}>
          <div className={styles.search}>
            <SearchContainer />
          </div>
          <div className={styles.list}>
            {mockData.map((item) => (
              <div
                className={styles.chat_item}
                key={item.room}
                onClick={() => chooseRoom(item)}
                style={{ backgroundColor: curChatInfo?.room === item.room ? 'rgba(106, 184, 106, 0.4)' : '' }}
              >
                <div className={styles.chat_avatar}>
                  <img src={item.avatar} alt="" />
                </div>
                <div className={styles.chat_info}>
                  <div className={styles.chat_name}>{item.name}</div>
                  <div className={styles.chat_message}>
                    这里应该获取最后一条信息这里应该获取最后一条信息这里应该获取最后一条信息
                  </div>
                </div>
                <div className={styles.chat_info_time}>
                  <Tooltip placement="bottomLeft" title={item.updated_at} arrow={false}>
                    <div className={styles.chat_time}>{item.updated_at}</div>
                  </Tooltip>
                  {item.unreadCount !== 0 && (
                    <Tooltip placement="bottomLeft" title={'未读消息' + item.unreadCount + '条'} arrow={false}>
                      <div className={`iconfont ${statusIconList[2].icon} ${styles.chat_unread}`}>
                        <span>{item.unreadCount}</span>
                      </div>
                    </Tooltip>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.rightContainer}>
          {curChatInfo === undefined ? (
            <WechatOutlined />
          ) : (
            <div className={styles.chat_window}>
              <div className={styles.chat_receiver}>{curChatInfo.name}</div>
              <div className={styles.chat_content}></div>
              <div className={styles.chat_tool}>
                <div className={styles.chat_tool_item}>
                  <ul className={styles.leftIcons}>
                    {chatIconList.slice(0, 3).map((item) => {
                      return (
                        <Tooltip key={item.text} placement="bottomLeft" title={item.text} arrow={false}>
                          <li className={`iconfont ${item.icon}`}></li>
                        </Tooltip>
                      );
                    })}
                  </ul>
                  <ul className={styles.rightIcons}>
                    {chatIconList.slice(3, 6).map((item) => {
                      return (
                        <Tooltip key={item.text} placement="bottomLeft" title={item.text} arrow={false}>
                          <li className={`iconfont ${item.icon}`}></li>
                        </Tooltip>
                      );
                    })}
                  </ul>
                </div>
                <textarea className={styles.chat_tool_input}></textarea>
                <div className={styles.chat_tool_btn}>
                  <Button type="primary">发送</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatList;
