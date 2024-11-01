import { Button, Spin, Tooltip } from 'antd';
import { ChangeEvent, useRef, useState } from 'react';

import { getGroupMembers } from './api';
import styles from './index.module.less';
import { IChatToolProps, IMessageListItem, ISendMessage } from './type';

import { EmojiList } from '@/assets/emoji';
import { ChatIconList } from '@/assets/icons';
import AudioModal from '@/components/AudioModal';
import { ICallReceiverInfo } from '@/components/AudioModal/type';
import VideoModal from '@/components/VideoModal';
import useShowMessage from '@/hooks/useShowMessage';
import { HttpStatus } from '@/utils/constant';
import { getFileSuffixByName } from '@/utils/file';
import { uploadFile } from '@/utils/file-upload';
import { userStorage } from '@/utils/storage';

const ChatTool = (props: IChatToolProps) => {
	const { curChatInfo, sendMessage } = props;
	const user = JSON.parse(userStorage.getItem());
	const showMessage = useShowMessage();
	const [inputValue, setInputValue] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const [openAudioModal, setAudioModal] = useState(false);
	const [openVideoModal, setVideoModal] = useState(false);
	const [callReceiverList, setCallReceiverList] = useState<ICallReceiverInfo[]>([]); // 音视频通话对象列表
	const imageRef = useRef<HTMLInputElement>(null);
	const fileRef = useRef<HTMLInputElement>(null);

	// 改变输入框的值
	const changeInputValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInputValue(e.target.value);
	};

	// 添加表情
	const addEmoji = (emoji: string) => {
		setInputValue(prevValue => prevValue + emoji);
	};

	// 发送编辑的文本消息
	const handleSendTextMessage = () => {
		if (inputValue === '') return;
		try {
			const newmessage: ISendMessage = {
				sender_id: user.id,
				receiver_id: curChatInfo.receiver_id,
				type: 'text',
				content: inputValue,
				avatar: user.avatar
			};
			sendMessage(newmessage);
			setInputValue(''); // 在发送消息成功后清空输入框内容
		} catch {
			showMessage('error', '消息发送失败，请重试');
		}
	};

	// 发送图片/视频/文件消息：先进行文件上传的逻辑获取文件的 URL，然后再发送消息
	const handleSendFileMessage = async (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files!.length > 0) {
			setLoading(true);
			// 只能上传小于 2G 的文件
			const file = e.target.files![0];
			if (file.size > 2 * 1024 * 1024 * 1024) {
				showMessage('error', '文件大小不能超过 2G');
				setLoading(false);
				return;
			}
			try {
				const res = await uploadFile(file, 5);
				if (res.success && res.filePath) {
					try {
						const newmessage: ISendMessage = {
							sender_id: user.id,
							receiver_id: curChatInfo.receiver_id,
							type: getFileSuffixByName(file.name),
							content: res.filePath,
							avatar: user.avatar,
							fileSize: file.size
						};
						sendMessage(newmessage);
					} catch (error) {
						showMessage('error', '消息发送失败，请重试');
					}
				} else {
					showMessage('error', '文件上传失败，请重试');
				}
			} catch (error) {
				showMessage('error', '文件上传失败，请重试');
			} finally {
				setLoading(false);
				imageRef.current!.value = '';
				fileRef.current!.value = '';
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
	const handleIconClick = async (icon: string) => {
		switch (icon) {
			case 'icon-tupian_huaban':
				imageRef.current?.click();
				break;
			case 'icon-wenjian1':
				fileRef.current?.click();
				break;
			case 'icon-dianhua':
				await getCallReceiverList();
				setAudioModal(true);
				break;
			case 'icon-video':
				await getCallReceiverList();
				setVideoModal(true);
				break;
			default:
				break;
		}
	};

	// 表情列表组件
	const emojiList = (
		<div className={styles.emoji_list}>
			{EmojiList.map(item => {
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

	// 判断当前的聊天是否为群聊
	const isGroupChat = (item: IMessageListItem) => {
		return !item.receiver_username;
	};

	// 获取当前聊天对象的信息（群友信息或者好友信息），用于音视频通话
	const getCallReceiverList = async () => {
		if (isGroupChat(curChatInfo)) {
			try {
				const params = {
					groupId: curChatInfo.receiver_id,
					room: curChatInfo.room
				};
				const res = await getGroupMembers(params);
				if (res.code === HttpStatus.SUCCESS && res.data) {
					setCallReceiverList(
						res.data.map(item => {
							return {
								username: item.username,
								alias: item.nickname,
								avatar: item.avatar
							};
						})
					);
				} else {
					showMessage('error', '获取群聊成员信息失败，请重试');
				}
			} catch {
				showMessage('error', '获取群聊成员信息失败，请重试');
			}
		} else {
			setCallReceiverList([
				{
					username: curChatInfo.receiver_username as string,
					alias: curChatInfo.name,
					avatar: curChatInfo.avatar
				}
			]);
		}
	};

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
					{ChatIconList.slice(3, 6).map(item => {
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
					onChange={e => {
						handleSendFileMessage(e);
					}}
				/>
				<input
					type="file"
					accept="*"
					style={{ display: 'none' }}
					ref={fileRef}
					onChange={e => {
						handleSendFileMessage(e);
					}}
				/>
			</div>
			<div className={styles.chat_tool_input}>
				<Spin spinning={loading} tip="正在发送中...">
					<textarea
						onChange={e => {
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
				// 音频通话弹窗
				openAudioModal && callReceiverList.length && (
					<AudioModal
						openmodal={openAudioModal}
						handleModal={handleAudioModal}
						status="initiate"
						type={isGroupChat(curChatInfo) ? 'group' : 'private'}
						callInfo={{
							room: curChatInfo.room,
							callReceiverList: callReceiverList
						}}
					/>
				)
			}
			{
				// 视频通话弹窗
				openVideoModal && callReceiverList.length && (
					<VideoModal
						openmodal={openVideoModal}
						handleModal={handleVideoModal}
						status="initiate"
						type={isGroupChat(curChatInfo) ? 'group' : 'private'}
						callInfo={{
							room: curChatInfo.room,
							callReceiverList: callReceiverList
						}}
					/>
				)
			}
		</div>
	);
};

export default ChatTool;
