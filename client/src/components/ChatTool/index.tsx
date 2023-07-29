import { App, Button, Tooltip } from 'antd';

import { EmojiList } from '@/assets/emoji';
import { ChatIconList } from '@/assets/icons';
import { getFileSuffixByName } from '@/utils/file';
import { userStorage } from '@/utils/storage';

import styles from './index.module.less';
import { IMessageList, ISendMessage } from './api/type';
import { ChangeEvent, useRef, useState } from 'react';

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
  const imageRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // 改变输入框的值
  const changeInputValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  // 添加表情
  const addEmoji = (emoji: string) => {
    setInputValue((prevValue) => prevValue + emoji);
  };

  // 发送编辑的文本消息
  const handleSendTextMessage = () => {
    if (inputValue === '') return;
    const newmessage: ISendMessage = {
      sender_id: JSON.parse(userStorage.getItem()).id,
      receiver_id: curChatInfo?.user_id,
      type: 'text',
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

  // 发送图片/视频消息
  const handleSendImageMessage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files!.length > 0) {
      const file = e.target.files![0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target!.result;
        const content = new Uint8Array(fileContent as ArrayBuffer);
        const filename = file.name;
        const newmessage: ISendMessage = {
          filename: filename,
          sender_id: JSON.parse(userStorage.getItem()).id,
          receiver_id: curChatInfo?.user_id,
          type: getFileSuffixByName(filename),
          content: Array.from(content),
          avatar: JSON.parse(userStorage.getItem()).avatar,
        };
        try {
          sendMessage(newmessage);
        } catch (error) {
          message.error('发送消息失败，请重试！', 1.5);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // 发送文件消息
  const handleSendFileMessage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') return;
    const newmessage: ISendMessage = {
      sender_id: JSON.parse(userStorage.getItem()).id,
      receiver_id: curChatInfo?.user_id,
      type: 'text',
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
        imageRef.current!.click();
        break;
      case 'icon-wenjian1':
        console.log('选择文件发送');
        fileRef.current!.click();
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
        <input
          type="file"
          accept="image/*,video/*"
          style={{ display: 'none' }}
          ref={imageRef}
          onChange={(e) => {
            handleSendImageMessage(e);
          }}
        />
        <input
          type="file"
          accept="*"
          style={{ display: 'none' }}
          ref={fileRef}
          onChange={(e) => {
            handleSendFileMessage(e);
          }}
        />
      </div>
      <textarea
        className={styles.chat_tool_input}
        onChange={(e) => {
          changeInputValue(e);
        }}
        value={inputValue}
      ></textarea>
      <div className={styles.chat_tool_btn}>
        <Button type="primary" onClick={handleSendTextMessage}>
          发送
        </Button>
      </div>
    </div>
  );
};

export default ChatTool;
