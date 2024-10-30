import { Tooltip, Button, Popover } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './index.module.less';
import { IChatRef, IAddressBookRef } from './type';

import { MenuIconList } from '@/assets/icons';
import AudioModal from '@/components/AudioModal';
import { ICallReceiverInfo } from '@/components/AudioModal/type';
import ChangePerInfoModal from '@/components/ChangePerInfoModal';
import ChangePwdModal from '@/components/ChangePwdModal';
import { IGroupChatInfo } from '@/components/CreateGroupChatModal/type';
import ImageLoad from '@/components/ImageLoad';
import VideoModal from '@/components/VideoModal';
import { wsBaseURL } from '@/config';
import useShowMessage from '@/hooks/useShowMessage';
import AddressBook from '@/pages/address-book';
import { IFriendInfo } from '@/pages/address-book/type';
import Chat from '@/pages/chat';
import { HttpStatus } from '@/utils/constant';
import { uploadFile } from '@/utils/file-upload';
import { handleLogout } from '@/utils/logout';
import { clearSessionStorage, userStorage } from '@/utils/storage';

const Container = () => {
	const showMessage = useShowMessage();
	const navigate = useNavigate();
	const user = JSON.parse(userStorage.getItem());
	const [currentIcon, setCurrentIcon] = useState<string>('icon-message');
	const [openForgetModal, setForgetModal] = useState(false);
	const [openInfoModal, setInfoModal] = useState(false);
	const [openAudioModal, setAudioModal] = useState(false);
	const [openVideoModal, setVideoModal] = useState(false);
	const socket = useRef<WebSocket | null>(null); // websocket 实例
	const addressBookRef = useRef<IAddressBookRef>(null); // 通讯录组件实例
	const chatRef = useRef<IChatRef>(null); // 聊天列表组件实例
	const [initSelectedChat, setInitSelectedChat] = useState<IFriendInfo | IGroupChatInfo | null>(
		null
	); // 初始化选中的聊天对象 (只有从通讯录页面进入聊天页面时才会有值)
	const [room, setRoom] = useState<string>(''); // 当前音视频通话房间号
	const [curMode, setCurMode] = useState<string>(''); // 当前音视频通话模式
	const [callReceiverList, setCallReceiverList] = useState<ICallReceiverInfo[]>([]); // 音视频通话对象列表

	// 控制修改密码的弹窗显隐
	const handleForgetModal = (visible: boolean) => {
		setForgetModal(visible);
	};

	// 控制修改信息的弹窗显隐
	const handleInfoModal = (visible: boolean) => {
		setInfoModal(visible);
	};

	// 控制音频通话弹窗的显隐
	const handleAudioModal = (visible: boolean) => {
		setAudioModal(visible);
	};

	// 控制视频通话弹窗的显隐
	const handleVideoModal = (visible: boolean) => {
		setVideoModal(visible);
	};

	// 退出登录
	const confirmLogout = async () => {
		try {
			const res = await handleLogout(user);
			if (res.code === HttpStatus.SUCCESS) {
				clearSessionStorage();
				showMessage('success', '退出成功');
				// 关闭 websocket 连接
				if (socket.current !== null) {
					socket.current.close();
					socket.current = null;
				}
				navigate('/login');
			} else {
				showMessage('error', '退出失败, 请重试');
			}
		} catch {
			showMessage('error', '退出失败, 请重试');
		}
	};

	// 点击头像用户信息弹窗
	const infoContent = (
		<div className={styles.infoContent}>
			<div className={styles.infoContainer}>
				<div className={styles.avatar}>
					<ImageLoad src={user.avatar} />
				</div>
				<div className={styles.info}>
					<div className={styles.name}>{user.name}</div>
					<div className={styles.phone}> 手机号：{user.phone}</div>
					<div className={styles.signature}>
						{user.signature === '' ? '暂无个性签名' : user.signature}
					</div>
				</div>
			</div>
			<div className={styles.btnContainer}>
				<Button
					size="small"
					onClick={() => {
						handleForgetModal(true);
					}}
				>
					修改密码
				</Button>
				<Button
					size="small"
					onClick={() => {
						handleInfoModal(true);
					}}
				>
					修改信息
				</Button>
			</div>
		</div>
	);

	// 进入到主页面时建立一个 websocket 连接
	const initSocket = () => {
		const ws = new WebSocket(`${wsBaseURL}/auth/user_channel?username=${user.username}`);
		ws.onmessage = e => {
			const message = JSON.parse(e.data);
			switch (message.name) {
				case 'friendList':
					// 重新加载好友列表
					addressBookRef.current?.refreshFriendList();
					break;
				case 'groupChatList':
					// 重新加载群聊列表
					addressBookRef.current?.refreshGroupChatList();
					break;
				case 'chatList':
					// 重新加载消息列表
					chatRef.current?.refreshChatList();
					break;
				case 'create_room':
					// 打开响应音视频通话窗口
					try {
						const { callReceiverList, room, mode } = message;
						setCallReceiverList(callReceiverList);
						setRoom(room);
						setCurMode(mode);
						// 区分是音频还是视频
						if (mode.includes('audio')) {
							setAudioModal(true);
						} else {
							setVideoModal(true);
						}
					} catch {
						showMessage('error', '音视频通话响应失败');
					}
					break;
			}
		};
		socket.current = ws;
	};
	useEffect(() => {
		initSocket();
	}, []);

	// 在通讯录页面选择一个好友或群聊进行发送信息时跳转到聊天页面
	const handleChooseChat = (item: IFriendInfo | IGroupChatInfo) => {
		setCurrentIcon('icon-message');
		navigate('/chat');
		setInitSelectedChat(item);
	};
	// const onProgress = (progress: number) => {
	// 	console.log(`文件上传进度：${progress}%`);
	// };
	const getFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files!.length > 0) {
			const file = e.target.files![0];
			// uploadFile(file, 5, 3, 1000, onProgress);
			const res = await uploadFile(file, 5);
			// eslint-disable-next-line no-console
			console.log(res);
		}
	};

	return (
		<div className={styles.parentContainer}>
			<div className={styles.container}>
				<div className={styles.leftContainer}>
					<Popover content={infoContent} placement="rightTop">
						<div className={styles.avatar}>
							<ImageLoad src={user.avatar} />
						</div>
					</Popover>
					<div className={styles.iconList}>
						<ul className={styles.topIcons}>
							{MenuIconList.slice(0, 5).map(item => {
								return (
									<Tooltip key={item.text} placement="bottomLeft" title={item.text} arrow={false}>
										<li
											className={`iconfont ${item.icon}`}
											onClick={() => {
												if (item.text === '聊天' || item.text === '通讯录') {
													setCurrentIcon(item.icon);
													navigate(item.text === '聊天' ? '/chat' : '/address-book');
												}
											}}
											style={{
												color: currentIcon === item.icon ? '#07c160' : '#979797'
											}}
										></li>
									</Tooltip>
								);
							})}
						</ul>
						<ul className={styles.bottomIcons}>
							{MenuIconList.slice(5, 8).map(item => {
								return (
									<Tooltip key={item.text} placement="bottomLeft" title={item.text} arrow={false}>
										<li
											className={`iconfont ${item.icon}`}
											onClick={() => {
												if (item.text === '退出登录') {
													setCurrentIcon(item.icon);
													confirmLogout();
												}
											}}
											style={{
												color: currentIcon === item.icon ? '#07c160' : '#979797'
											}}
										></li>
									</Tooltip>
								);
							})}
						</ul>
					</div>
					<div className={styles.bottomIcons}></div>
					<div className={styles.topicons}></div>
					<div className={styles.bottomicons}></div>
				</div>
				<div className={styles.rightContainer}>
					{currentIcon === 'icon-message' ? (
						<Chat initSelectedChat={initSelectedChat} ref={chatRef} />
					) : (
						<AddressBook handleChooseChat={handleChooseChat} ref={addressBookRef} />
					)}
				</div>
			</div>
			<input
				type="file"
				accept="*"
				onChange={e => {
					getFile(e);
				}}
			/>
			{
				// 修改密码弹窗
				openForgetModal && (
					<ChangePwdModal openmodal={openForgetModal} handleModal={handleForgetModal} />
				)
			}
			{
				// 修改信息弹窗
				openInfoModal && (
					<ChangePerInfoModal openmodal={openInfoModal} handleModal={handleInfoModal} />
				)
			}
			{
				// 音频通话弹窗
				openAudioModal && callReceiverList.length && (
					<AudioModal
						openmodal={openAudioModal}
						handleModal={handleAudioModal}
						status="receive"
						type={curMode.includes('private') ? 'private' : 'group'}
						callInfo={{
							room,
							callReceiverList
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
						status="receive"
						type={curMode.includes('private') ? 'private' : 'group'}
						callInfo={{
							room,
							callReceiverList
						}}
					/>
				)
			}
		</div>
	);
};

export default Container;
