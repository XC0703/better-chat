import { App, Button, Tooltip } from 'antd';
import { useEffect, useState } from 'react';

import { WechatOutlined } from '@ant-design/icons';
import { statusIconList, chatIconList } from '@/assets/icons';
import { wsBaseURL } from '@/assets/links/wsBaseURL';
import SearchContainer from '@/components/SearchContainer';
import { userStorage } from '@/utils/storage';
import { toggleTime_chatList, toggleTime_chatContent } from '@/utils/formatTime';

import { getChatList } from './api';
import { IConnectParams, IMessage } from './api/type';
import styles from './index.module.less';

const ChatList = () => {
  const { message } = App.useApp();
  const [chatList, setChatList] = useState<IMessage[]>([]); // 消息列表
  const [curChatInfo, setCurChatInfo] = useState<IMessage>(); // 当前选中的对话信息
  const [connectParams, setConnectParams] = useState<IConnectParams>(); // 连接参数
  const [socket, setSocket] = useState<WebSocket | null>(null); // websocket实例

  // 建立websocket连接
  const initSocket = () => {
    // 如果连接参数为空，则不建立连接
    if (connectParams === undefined) return;
    // 如果socket已经存在，则重新建立连接
    if (socket !== null) {
      socket.close();
      setSocket(null);
    }
    const newSocket = new WebSocket(
      `${wsBaseURL}/message/chat?room=${connectParams?.room}&id=${connectParams?.sender_id}&type=private`,
    );
    newSocket.onmessage = (e) => {
      // 处理发送的消息
      console.log('发送消息', e.data);
    };
    newSocket.onerror = () => {
      message.error('websocket连接失败，请重试！', 1.5);
    };
    // 建立连接
    setSocket(newSocket);
  };

  const chooseRoom = (item: IMessage) => {
    setCurChatInfo(item);
    // 建立webcocet连接(记得加个延时器)
    setTimeout(() => {
      initSocket();
    }, 0);
  };

  // 刷新消息列表
  const refreshChatList = () => {
    // 获取消息列表
    getChatList().then((res) => {
      if (res.code === 200) {
        setChatList(res.data);
      } else {
        message.error('获取消息列表失败！', 1.5);
      }
    });
  };

  useEffect(() => {
    refreshChatList();
    // 初始化连接参数
    const params: IConnectParams = {
      room: 'Room 1',
      sender_id: JSON.parse(userStorage.getItem()).id,
    };
    setConnectParams(params);
  }, []);

  return (
    <>
      <div className={styles.chatList}>
        <div className={styles.leftContainer}>
          <div className={styles.search}>
            <SearchContainer />
          </div>
          <div className={styles.list}>
            {chatList.map((item) => (
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
                  <Tooltip placement="bottomLeft" title={toggleTime_chatList(item.updated_at)} arrow={false}>
                    <div className={styles.chat_time}>{toggleTime_chatList(item.updated_at)}</div>
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
