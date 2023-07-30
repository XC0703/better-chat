import { useEffect, useRef, useState } from 'react';
import { App, Image, Modal } from 'antd';

import { ChatImage } from '@/assets/links/imagesLinks';
import { serverURL } from '@/assets/links/baseURL';
import { IMessage } from '@/pages/container/ChatList/api/type';
import { getMediaSize, getMediaShowSize, getFileName, getFileIcons, downloadFile } from '@/utils/file';
import { toggleTime_chatContent } from '@/utils/formatTime';
import { userStorage } from '@/utils/storage';

import styles from './index.module.less';

// 给聊天框组件传递的参数
interface IChatContainer {
  historyMsg: IMessage[];
}
// 给消息展示组件传递的参数
interface IChatContent {
  messageType: string;
  messageContent: string;
  fileSize?: string | null;
}
// 图片/视频的信息（类型，URL，尺寸）
interface IMediaInfo {
  type: 'image' | 'video';
  url: string;
  size: { width: number; height: number };
}

const ChatContainer = (props: IChatContainer) => {
  const { message } = App.useApp();
  const { historyMsg } = props;
  const chatRef = useRef<HTMLDivElement>(null);
  let prevTime: string | null = null;

  useEffect(() => {
    scrollToBottom();
  }, [historyMsg]);

  const scrollToBottom = () => {
    chatRef.current!.scrollTop = chatRef.current!.scrollHeight;
  };

  // 消息内容(分为文本、图片、视频和文件)
  const ChatContent = (props: IChatContent): JSX.Element | null => {
    const { messageType, messageContent, fileSize } = props;
    const [curMediaInfo, setCurMediaInfo] = useState<IMediaInfo | null>(null);
    const [isVideoPlay, setIsVideoPlay] = useState<boolean>(false);

    useEffect(() => {
      if (messageType === 'image') {
        const imageUrl = serverURL + messageContent;
        getMediaSize(imageUrl, 'image')
          .then((size) => {
            setCurMediaInfo({ type: 'image', url: imageUrl, size });
          })
          .catch(() => {
            message.error('获取图片尺寸失败！', 1.5);
          });
      } else if (messageType === 'video') {
        const videoUrl = serverURL + messageContent;
        getMediaSize(videoUrl, 'video')
          .then((size) => {
            setCurMediaInfo({ type: 'video', url: videoUrl, size });
          })
          .catch(() => {
            message.error('获取视频尺寸失败！', 1.5);
          });
      }
    }, [messageType, messageContent]);

    // 打开视频的播放窗口
    const handleOpenVideo = () => {
      setIsVideoPlay(true);
    };

    // 消息内容
    switch (messageType) {
      case 'text':
        return <div className={styles.content_text}>{messageContent}</div>;
      case 'image':
        return curMediaInfo && curMediaInfo ? (
          <Image
            width={getMediaShowSize(curMediaInfo.size, 'image').width}
            src={curMediaInfo.url}
            rootClassName="content_image"
          />
        ) : null;
      case 'video':
        return curMediaInfo && curMediaInfo ? (
          <div className={styles.content_video}>
            <video
              src={serverURL + messageContent}
              muted
              style={{ width: getMediaShowSize(curMediaInfo.size, 'video').width }}
            />
            <img src={ChatImage.PLAY} alt="" onClick={handleOpenVideo} />
            <Modal
              open={isVideoPlay}
              footer={null}
              title="视频"
              onCancel={() => setIsVideoPlay(false)}
              destroyOnClose
              width={800}
            >
              <video src={serverURL + messageContent} muted controls autoPlay width={750} />
            </Modal>
          </div>
        ) : null;
      case 'file':
        return (
          <div
            className={styles.content_file}
            onClick={() => {
              downloadFile(`${serverURL}${messageContent}`);
            }}
          >
            <div className={styles.content_file_name}>
              <span>{getFileName(messageContent)}</span>
              {fileSize && <span>{fileSize}</span>}
            </div>
            <div className={styles.content_file_img}>
              <img src={getFileIcons(messageContent)}></img>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.chat_container} ref={chatRef}>
      {historyMsg.map((item, index) => {
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
                <ChatContent messageType={item.type} messageContent={item.content} fileSize={item.file_size} />
                <div className={styles.avatar}>
                  <img src={item.avatar} alt="" />
                </div>
              </div>
            ) : (
              <div className={`${styles.other} ${styles.chat_item_content}`}>
                <div className={styles.avatar}>
                  <img src={item.avatar} alt="" />
                </div>
                <ChatContent messageType={item.type} messageContent={item.content} fileSize={item.file_size} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChatContainer;
