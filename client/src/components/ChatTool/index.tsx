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

	// 发送图片 / 视频消息（TODO：大的图片 / 视频文件按目前方式上传会出错，因此暂时限定最大传输大小，因为读取的数组过大，应该使用分片上传）
	const handleSendImageMessage = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files!.length > 0) {
			setLoading(true);
			const file = e.target.files![0];
			// 检查图片 / 视频大小是否超过 100MB
			if (file.size > 100 * 1024 * 1024) {
				showMessage('error', '图片 / 视频大小不能超过 100MB');
				setLoading(false);
				return;
			}
			// 读取文件内容
			const reader = new FileReader();
			// 文件读取完成之后执行的回调
			reader.onload = event => {
				try {
					const fileContent = event.target!.result;
					const content = new Uint8Array(fileContent as ArrayBuffer);
					const filename = file.name;
					const newmessage: ISendMessage = {
						sender_id: user.id,
						receiver_id: curChatInfo.receiver_id,
						type: getFileSuffixByName(filename),
						content: Array.from(content),
						avatar: user.avatar,
						filename: filename
					};
					sendMessage(newmessage);
					setLoading(false);
					// 清空文件输入字段的值，否则再次选择相同文件时无法触发 onchange
					imageRef.current!.value = '';
				} catch {
					showMessage('error', '消息发送失败，请重试');
					setLoading(false);
					// 清空文件输入字段的值，否则再次选择相同文件时无法触发 onchange
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
			// 其它文件类型，按照图片 / 视频文件处理
			if (getFileSuffixByName(file.name) !== 'file') {
				// 检查图片 / 视频大小是否超过 100MB
				if (file.size > 100 * 1024 * 1024) {
					showMessage('error', '图片 / 视频大小不能超过 100MB');
					setLoading(false);
					return;
				}
				const reader = new FileReader();
				reader.onload = event => {
					try {
						const fileContent = event.target!.result;
						const content = new Uint8Array(fileContent as ArrayBuffer);
						const filename = file.name;
						const newmessage: ISendMessage = {
							sender_id: user.id,
							receiver_id: curChatInfo.receiver_id,
							type: getFileSuffixByName(filename),
							content: Array.from(content),
							avatar: user.avatar,
							filename: filename
						};
						sendMessage(newmessage);
						setLoading(false);
						fileRef.current!.value = '';
					} catch {
						showMessage('error', '消息发送失败，请重试');
						setLoading(false);
						fileRef.current!.value = '';
					}
				};
				reader.readAsArrayBuffer(file);
			} else {
				try {
					// 发送文件信息
					const fileInfo = {
						fileName: file.name,
						fileSize: file.size
					};
					// 发送文件下载指令（多了 fileType 字段和 fileInfo 字段）
					const newmessage: ISendMessage = {
						sender_id: user.id,
						receiver_id: curChatInfo.receiver_id,
						type: 'file',
						content: '',
						avatar: user.avatar,
						filename: file.name,
						fileTraStatus: 'start',
						fileInfo: JSON.stringify(fileInfo)
					};
					sendMessage(newmessage);
				} catch {
					showMessage('error', '消息发送失败，请重试');
					setLoading(false);
					fileRef.current!.value = '';
				}
				// 防止文件未初始化完成就发送
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
									sender_id: user.id,
									receiver_id: curChatInfo.receiver_id,
									type: 'file',
									content: Array.from(new Uint8Array(chunk.value as ArrayBufferLike)),
									avatar: user.avatar,
									filename: file.name,
									fileTraStatus: 'upload'
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
						handleSendImageMessage(e);
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
