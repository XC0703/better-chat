import { App, Button, Tooltip } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { WechatOutlined } from '@ant-design/icons';
import { statusIconList, chatIconList } from '@/assets/icons';
import { wsBaseURL } from '@/assets/links/wsBaseURL';
import SearchContainer from '@/components/SearchContainer';
import { userStorage } from '@/utils/storage';
import { toggleTime_chatList, toggleTime_chatContent } from '@/utils/formatTime';

import { getChatList } from './api';
import { IConnectParams, IMessage } from './api/type';
import { IFriendInfo } from '../AddressBook/api/type';
import styles from './index.module.less';

interface IChatListProps {
  initSelectedChat: IFriendInfo | null;
}

const ChatList = forwardRef((props: IChatListProps, ref) => {
  const { initSelectedChat } = props;
  const { message } = App.useApp();
  const [chatList, setChatList] = useState<IMessage[]>([]); // 消息列表
  const [curChatInfo, setCurChatInfo] = useState<IMessage>(); // 当前选中的对话信息
  const socket = useRef<WebSocket | null>(null); // websocket实例

  // 进入聊天房间时建立websocket连接
  const initSocket = (connectParams: IConnectParams) => {
    // 如果连接参数为空，则不建立连接
    if (connectParams === undefined) return;
    // 如果socket已经存在，则重新建立连接
    if (socket.current !== null) {
      socket.current?.close();
      socket.current = null;
    }
    const newSocket = new WebSocket(
      `${wsBaseURL}/message/connect_chat?room=${connectParams?.room}&id=${connectParams?.sender_id}&type=private`,
    );
    // 获取消息记录
    newSocket.onmessage = (e) => {
      console.log('在房间的双方都会收到最新发送的一条消息拼接显示在房间的消息记录上', e.data);
    };
    newSocket.onerror = () => {
      message.error('websocket连接失败，请重试！', 1.5);
    };
    // 建立连接
    socket.current = newSocket;
  };

  // 选择聊天室
  const chooseRoom = (item: IMessage) => {
    setCurChatInfo(item);
    // 建立连接
    const params: IConnectParams = {
      room: item.room,
      sender_id: JSON.parse(userStorage.getItem()).id,
    };
    initSocket(params);
    refreshChatList();
  };

  // 发送消息
  const sendMessage = () => {
    const mockMessage = {
      sender_id: JSON.parse(userStorage.getItem()).id,
      receiver_id: curChatInfo?.user_id,
      type: 'text',
      content: '消息内容',
    };
    socket.current?.send(JSON.stringify(mockMessage));
    refreshChatList();
  };

  // 刷新消息列表
  const refreshChatList = async () => {
    // 获取消息列表
    try {
      const res = await getChatList();
      if (res.code === 200) {
        setChatList(res.data);
      } else {
        message.error('获取消息列表失败！', 1.5);
      }
    } catch (error) {
      message.error('获取消息列表失败！', 1.5);
    }
  };

  // 初始化
  useEffect(() => {
    const init = async () => {
      await refreshChatList();
      // 如果有初始选中的聊天室，则选中且建立连接
      if (initSelectedChat !== null) {
        // 等待获取消息列表后再进行后续操作
        const updatedChatList = (await getChatList()).data;

        const initChatInfo = updatedChatList.find((item) => item.room === initSelectedChat.room);

        // 如果消息列表中存在该聊天室，则选中，否则造一个假的以便用于发送消息
        if (initChatInfo !== undefined) {
          setCurChatInfo(initChatInfo);
        } else {
          const newMessage = {
            user_id: initSelectedChat.friend_id,
            name: initSelectedChat.remark,
            receiver_username: initSelectedChat.username,
            room: initSelectedChat.room,
            updated_at: new Date(),
            unreadCount: 0,
            lastMessage: '暂无消息记录',
            type: 'text',
            avatar: initSelectedChat.avatar,
          };
          setChatList([...updatedChatList, newMessage]);
          setCurChatInfo(newMessage);
        }

        const params: IConnectParams = {
          room: initSelectedChat?.room as string,
          sender_id: JSON.parse(userStorage.getItem()).id,
        };
        initSocket(params);
      }
    };
    init();
    // 组件卸载时关闭websocket连接
    return () => {
      socket.current?.close();
    };
  }, []);

  // 暴露方法出去
  useImperativeHandle(ref, () => ({
    refreshChatList,
  }));
  return (
    <>
      <div className={styles.chatList}>
        <div className={styles.leftContainer}>
          <div className={styles.search}>
            <SearchContainer />
          </div>
          <div className={styles.list}>
            {chatList.length === 0 ? (
              <div className={styles.chat_none}>暂无消息记录</div>
            ) : (
              chatList.map((item) => (
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
                    <div className={styles.chat_message}>{item.lastMessage}</div>
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
              ))
            )}
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
                  <Button type="primary" onClick={sendMessage}>
                    发送
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
});
// 指定显示名称
ChatList.displayName = 'ChatList';
export default ChatList;
