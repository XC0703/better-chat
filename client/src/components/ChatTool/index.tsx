import { App, Button, Spin, Tooltip } from 'antd';
import { ChangeEvent, useRef, useState } from 'react';

import { IMessageList, ISendMessage } from './api/type';
import styles from './index.module.less';

import { EmojiList } from '@/assets/emoji';
import { ChatIconList } from '@/assets/icons';
import AudioModal from '@/components/AudioModal';
import VideoModal from '@/components/VideoModal';
import { getFileSuffixByName } from '@/utils/file';
import { userStorage } from '@/utils/storage';

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
  const [loading, setLoading] = useState(false);
  const [openAudioModal, setAudioModal] = useState(false);
  const [openVideoModal, setVideoModal] = useState(false);
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
      receiver_id: curChatInfo?.receiver_id,
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
      setLoading(true);
      const file = e.target.files![0];
      const reader = new FileReader();
      // 文件读取完成之后执行的回调
      reader.onload = (event) => {
        const fileContent = event.target!.result;
        const content = new Uint8Array(fileContent as ArrayBuffer);
        const filename = file.name;
        const newmessage: ISendMessage = {
          filename: filename,
          sender_id: JSON.parse(userStorage.getItem()).id,
          receiver_id: curChatInfo?.receiver_id,
          type: getFileSuffixByName(filename),
          content: Array.from(content),
          avatar: JSON.parse(userStorage.getItem()).avatar,
        };
        try {
          sendMessage(newmessage);
          setLoading(false);
          // 清空文件输入字段的值，否则再次选择相同文件时无法触发onchange
          imageRef.current!.value = '';
        } catch (error) {
          message.error('发送消息失败，请重试！', 1.5);
          setLoading(false);
          // 清空文件输入字段的值，否则再次选择相同文件时无法触发onchange
          imageRef.current!.value = '';
        }
      };
      reader.readAsArrayBuffer(file); // 将指定文件 file 以 ArrayBuffer 的形式进行读取的操作
    }
  };

  // 发送文件消息
  const handleSendFileMessage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files!.length > 0) {
      setLoading(true);
      const file = e.target.files![0];
      // 其它文件类型，按照图片/视频文件处理
      if (getFileSuffixByName(file.name) !== 'file') {
        const reader = new FileReader();
        reader.onload = (event) => {
          const fileContent = event.target!.result;
          const content = new Uint8Array(fileContent as ArrayBuffer);
          const filename = file.name;
          const newmessage: ISendMessage = {
            filename: filename,
            sender_id: JSON.parse(userStorage.getItem()).id,
            receiver_id: curChatInfo?.receiver_id,
            type: getFileSuffixByName(filename),
            content: Array.from(content),
            avatar: JSON.parse(userStorage.getItem()).avatar,
          };
          try {
            sendMessage(newmessage);
            setLoading(false);
            fileRef.current!.value = '';
          } catch (error) {
            message.error('发送消息失败，请重试！', 1.5);
            setLoading(false);
            fileRef.current!.value = '';
          }
          reader.readAsArrayBuffer(file);
        };
      } else {
        // 发送文件信息
        const fileInfo = {
          fileName: file.name,
          fileSize: file.size,
        };
        //发送文件下载指令
        const newmessage: ISendMessage = {
          filename: file.name,
          sender_id: JSON.parse(userStorage.getItem()).id,
          receiver_id: curChatInfo?.receiver_id,
          type: 'file',
          content: '',
          avatar: JSON.parse(userStorage.getItem()).avatar,
          fileType: 'start',
          fileInfo: JSON.stringify(fileInfo),
        };
        try {
          sendMessage(newmessage);
        } catch (error) {
          message.error('发送消息失败，请重试！', 1.5);
          setLoading(false);
          fileRef.current!.value = '';
        }
        //防止文件未初始化完成就发送
        setTimeout(async () => {
          const reader = file.stream().getReader();
          let shouldExit = false;
          let chunk;

          let transmittedSize = 0; // 获取服务端已传输的文件大小

          while (!shouldExit) {
            chunk = await reader.read();
            if (chunk.done) {
              setLoading(false);
              shouldExit = true;
              fileRef.current!.value = '';
            }

            if (!chunk.done) {
              transmittedSize -= chunk.value!.byteLength; // 减去当前块的字节长度来更新已传输的大小，支持断点续传（TODO：由于不准确，待完善）
              if (transmittedSize <= 0) {
                const newmessage: ISendMessage = {
                  filename: file.name,
                  sender_id: JSON.parse(userStorage.getItem()).id,
                  receiver_id: curChatInfo?.receiver_id,
                  type: 'file',
                  content: Array.from(new Uint8Array(chunk.value as ArrayBufferLike)),
                  avatar: JSON.parse(userStorage.getItem()).avatar,
                  fileType: 'upload',
                };
                sendMessage(newmessage);
              }
            }
          }
        }, 50);
      }
    }
  };

  // 控制音频通话弹窗的显隐
  const handleAudioModal = (visible: boolean) => {
    setAudioModal(visible);
  };

  // 控制视频通话弹窗的显隐
  const handleVideoModal = (visible: boolean) => {
    setVideoModal(visible);
  };

  // 点击不同的图标产生的回调
  const handleIconClick = (icon: string) => {
    switch (icon) {
      case 'icon-tupian_huaban':
        imageRef.current!.click();
        break;
      case 'icon-wenjian1':
        fileRef.current!.click();
        break;
      case 'icon-dianhua':
        setAudioModal(true);
        break;
      case 'icon-video':
        setVideoModal(true);
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
      <div className={styles.chat_tool_input}>
        <Spin spinning={loading} tip="正在发送中...">
          <textarea
            onChange={(e) => {
              changeInputValue(e);
            }}
            value={inputValue}
          ></textarea>
        </Spin>
      </div>
      <div className={styles.chat_tool_btn}>
        <Button type="primary" onClick={handleSendTextMessage}>
          发送
        </Button>
      </div>
      {
        // 音频通话弹窗（私聊）
        openAudioModal && curChatInfo?.receiver_username && (
          <AudioModal
            openmodal={openAudioModal}
            handleModal={handleAudioModal}
            status="initiate"
            friendInfo={{
              receiver_username: curChatInfo.receiver_username,
              remark: curChatInfo?.name,
              avatar: curChatInfo?.avatar,
              room: curChatInfo?.room,
            }}
          />
        )
      }
      {
        // 视频通话弹窗（私聊）
        openVideoModal && curChatInfo?.receiver_username && (
          <VideoModal
            openmodal={openVideoModal}
            handleModal={handleVideoModal}
            status="initiate"
            friendInfo={{
              receiver_username: curChatInfo?.receiver_username,
              remark: curChatInfo?.name,
              avatar: curChatInfo?.avatar,
              room: curChatInfo?.room,
            }}
          />
        )
      }
    </div>
  );
};

export default ChatTool;
