import { Image, Modal } from 'antd';
import { useEffect, useState } from 'react';

import styles from './index.module.less';
import { IChatContentProps, IMessageShowProps, IMediaInfo } from './type';

import { ChatImage, LoadErrorImage } from '@/assets/images';
import ImageLoad from '@/components/ImageLoad';
import { serverURL } from '@/config';
import {
	getMediaSize,
	getMediaShowSize,
	getFileName,
	getFileIcons,
	downloadFile,
	urlExists
} from '@/utils/file';
import { userStorage } from '@/utils/storage';
import { formatChatContentTime } from '@/utils/time';

const MessageShow = (props: IMessageShowProps) => {
	const { showTime, message } = props;
	const user = JSON.parse(userStorage.getItem());
	const { sender_id, content, avatar, type, file_size, created_at } = message;

	// 图片/视频和文件被清理时的兜底显示
	const ChatContentPocket = () => (
		<div className={`${styles.content_delete} ${styles.content_file}`}>
			<img src={LoadErrorImage.FILE_DELETE} draggable="false"></img>
			<span>文件已过期或被清理</span>
		</div>
	);

	// 消息内容 (分为文本、图片、视频和文件)
	const ChatContent = (props: IChatContentProps): JSX.Element | null => {
		const { messageType, messageContent, fileSize } = props;
		const [curMediaInfo, setCurMediaInfo] = useState<IMediaInfo | null>(null);
		const [isVideoPlay, setIsVideoPlay] = useState<boolean>(false);
		const [isFileExist, setIsFileExist] = useState<boolean>(true); // 使用 useState 来定义文件是否存在的状态，默认为 true

		useEffect(() => {
			// 非文本消息时，检查链接是否有效
			if (messageType !== 'text') {
				urlExists(`${serverURL}${messageContent}`).then(res => {
					if (!res) {
						setIsFileExist(res);
					}
				});
			}
			if (messageType === 'image' || messageType === 'video') {
				const mediaURL = serverURL + messageContent;
				getMediaSize(mediaURL, messageType)
					.then(size => {
						setCurMediaInfo({ type: messageType, url: mediaURL, size });
					})
					.catch(() => {
						/* empty */
					});
			}
		}, [messageType, messageContent]);

		// 打开视频的播放窗口
		const handleOpenVideo = () => {
			setIsVideoPlay(true);
		};

		// 消息内容
		if (!isFileExist) return <ChatContentPocket />;
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
							style={{
								width: getMediaShowSize(curMediaInfo.size, 'video').width
							}}
						/>
						<img src={ChatImage.PLAY} alt="" onClick={handleOpenVideo} draggable="false" />
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
							<img src={getFileIcons(messageContent)} draggable="false"></img>
						</div>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<>
			{showTime && created_at && (
				<div className={styles.chat_notice}>
					<span>{formatChatContentTime(created_at)}</span>
				</div>
			)}
			{sender_id === user.id ? (
				<div className={`${styles.self} ${styles.chat_item_content}`}>
					<ChatContent messageType={type} messageContent={content} fileSize={file_size} />
					<div className={styles.avatar}>
						<ImageLoad src={avatar} />
					</div>
				</div>
			) : (
				<div className={`${styles.other} ${styles.chat_item_content}`}>
					<div className={styles.avatar}>
						<ImageLoad src={avatar} />
					</div>
					<ChatContent messageType={type} messageContent={content} fileSize={file_size} />
				</div>
			)}
		</>
	);
};

export default MessageShow;
