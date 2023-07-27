import { App, Button, Tooltip } from 'antd';

import { EmojiList } from '@/assets/emoji';
import { ChatIconList } from '@/assets/icons';
import { userStorage } from '@/utils/storage';

import styles from './index.module.less';
import { IMessageList, MessageType, ISendMessage } from './api/type';
import { useState } from 'react';

// 聊天输入工具组件传递的参数类型
interface IChatToolProps {
  // 当前选中的对话信息
  curChatInfo: IMessageList;
  // 发送消息的回调函数
  sendMessage: (message: ISendMessage) => void;
}

const ChatTool = (props: IChatToolProps) => {
  const { curChatInfo, sendMessage } = props;
  const { message } = App.useApp();
  const [inputValue, setInputValue] = useState<string>('');

  // 改变输入框的值
  const changeInputValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  // 添加表情
  const addEmoji = (emoji: string) => {
    setInputValue((prevValue) => prevValue + emoji);
  };

  // 发送消息
  const handleSendMessage = () => {
    if (inputValue === '') return;
    const newmessage: ISendMessage = {
      sender_id: JSON.parse(userStorage.getItem()).id,
      receiver_id: curChatInfo?.user_id,
      type: MessageType.Text,
      content: inputValue,
      avatar: JSON.parse(userStorage.getItem()).avatar,
    };

    try {
      sendMessage(newmessage);
      setInputValue(''); // 在发送消息成功后清空输入框内容
    } catch (error) {
      message.error('发送消息失败，请重试！', 1.5);
    }
  };

  // 点击不同的图标产生的回调
  const handleIconClick = (icon: string) => {
    switch (icon) {
      case 'icon-tupian_huaban':
        console.log('选择图片发送');
        break;
      case 'icon-wenjian1':
        console.log('选择文件发送');
        break;
      case 'icon-dianhua':
        console.log('发起语音聊天');
        break;
      case 'icon-video':
        console.log('发起视频聊天');
        break;
      default:
        break;
    }
  };

  // 表情列表组件
  const emojiList = (
    <div className={styles.emoji_list}>
      {EmojiList.map((item) => {
        return (
          <span
            key={item}
            className={styles.emoji_item}
            onClick={() => {
              addEmoji(item);
            }}
            style={{ cursor: 'default' }}
          >
            {item}
          </span>
        );
      })}
    </div>
  );

  return (
    <div className={styles.chat_tool}>
      <div className={styles.chat_tool_item}>
        <ul className={styles.leftIcons}>
          {ChatIconList.slice(0, 3).map((item, index) => {
            return (
              <Tooltip
                key={item.text}
                placement={index === 0 ? 'top' : 'bottomLeft'}
                title={index === 0 ? emojiList : item.text}
                arrow={false}
              >
                <li
                  className={`iconfont ${item.icon}`}
                  onClick={() => {
                    handleIconClick(item.icon);
                  }}
                ></li>
              </Tooltip>
            );
          })}
        </ul>
        <ul className={styles.rightIcons}>
          {ChatIconList.slice(3, 6).map((item) => {
            return (
              <Tooltip key={item.text} placement="bottomLeft" title={item.text} arrow={false}>
                <li
                  className={`iconfont ${item.icon}`}
                  onClick={() => {
                    handleIconClick(item.icon);
                  }}
                ></li>
              </Tooltip>
            );
          })}
        </ul>
      </div>
      <textarea
        className={styles.chat_tool_input}
        onChange={(e) => {
          changeInputValue(e);
        }}
        value={inputValue}
      ></textarea>
      <div className={styles.chat_tool_btn}>
        <Button type="primary" onClick={handleSendMessage}>
          发送
        </Button>
      </div>
    </div>
  );
};

export default ChatTool;
