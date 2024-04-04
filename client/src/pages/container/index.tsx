import { Tooltip, Button, Popover } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AddressBook from './AddressBook';
import { getFriendInfoByUsername } from './AddressBook/api';
import { IFriendInfo, IGroupChatInfo } from './AddressBook/api/type';
import ChatList from './ChatList';
import styles from './index.module.less';

import { MenuIconList } from '@/assets/icons';
import AudioModal from '@/components/AudioModal';
import { ICallFriendInfo } from '@/components/AudioModal/api/type';
import ChangePerInfoModal from '@/components/ChangePerInfoModal';
import ChangePwdModal from '@/components/ChangePwdModal';
import VideoModal from '@/components/VideoModal';
import { serverURL, wsBaseURL } from '@/config';
import useShowMessage from '@/hooks/useShowMessage';
import { HttpStatus } from '@/utils/constant';
import { handleLogout, IUserInfo } from '@/utils/logout';
import { clearSessionStorage, userStorage } from '@/utils/storage';

type AddressBookRefType = {
	refreshFriendList: () => void;
	refreshGroupChatList: () => void;
};
type ChatListRefType = {
	refreshChatList: () => void;
};

const Container = () => {
	const showMessage = useShowMessage();
	const navigate = useNavigate();
	const { username, name, avatar, phone, signature } = JSON.parse(userStorage.getItem() || '{}');
	const [currentIcon, setCurrentIcon] = useState<string>('icon-message');
	const [openForgetModal, setForgetModal] = useState(false);
	const [openInfoModal, setInfoModal] = useState(false);
	const [openAudioModal, setAudioModal] = useState(false);
	const [openVideoModal, setVideoModal] = useState(false);
	const socket = useRef<WebSocket | null>(null); // websocket 实例
	const addressBookRef = useRef<AddressBookRefType>(null); // 通讯录组件实例
	const chatListRef = useRef<ChatListRefType>(null); // 聊天列表组件实例
	const [initSelectedChat, setInitSelectedChat] = useState<IFriendInfo | IGroupChatInfo | null>(
		null
	); // 初始化选中的聊天对象 (只有从通讯录页面进入聊天页面时才会有值)
	const [callFriendInfo, setCallFriendInfo] = useState<ICallFriendInfo>(); // 通话对象信息

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
			const res = await handleLogout(JSON.parse(userStorage.getItem() || '{}') as IUserInfo);
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
					<img
						src={avatar.startsWith('http' || 'https') ? avatar : `${serverURL}${avatar}`}
						alt=""
					/>
				</div>
				<div className={styles.info}>
					<div className={styles.name}>{name}</div>
					<div className={styles.phone}> 手机号：{phone}</div>
					<div className={styles.signature}>{signature === '' ? '暂无个性签名' : signature}</div>
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
		const newSocket = new WebSocket(`${wsBaseURL}/auth/user_channel?username=${username}`);
		newSocket.onmessage = async message => {
			const data = JSON.parse(message.data);
			switch (data.name) {
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
					chatListRef.current?.refreshChatList();
					break;
				// 打开响应音视频通话窗口 (根据传过来的发送方 username 拿到对应的好友信息)
				case 'createRoom':
					if (data.sender_username) {
						try {
							const param = {
								friend_username: data.sender_username,
								self_username: username
							};
							const res = await getFriendInfoByUsername(param);
							if (res.code === HttpStatus.SUCCESS) {
								setCallFriendInfo({
									receiver_username: res.data.username,
									remark: res.data.remark,
									avatar: res.data.avatar,
									room: res.data.room
								});
								if (data.mode === 'audio_invitation') {
									setAudioModal(true);
								} else if (data.mode === 'video_invitation') {
									setVideoModal(true);
								}
							} else {
								showMessage('error', '获取好友信息失败');
							}
						} catch {
							showMessage('error', '音视频通话响应失败');
						}
					}
					break;
			}
		};
		socket.current = newSocket;
	};
	useEffect(() => {
		initSocket();
	}, []);

	// 在通讯录页面选择一个好友或群聊进行发送信息时跳转到聊天页面
	const handleChooseChat = (item: IFriendInfo | IGroupChatInfo) => {
		setCurrentIcon('icon-message');
		setInitSelectedChat(item);
	};

	return (
		<div className={styles.parentContainer}>
			<div className={styles.container}>
				<div className={styles.leftContainer}>
					<div className={styles.avatar}>
						<Popover content={infoContent} placement="rightTop">
							<img
								src={avatar.startsWith('http' || 'https') ? avatar : `${serverURL}${avatar}`}
								alt=""
							/>
						</Popover>
					</div>
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
						<ChatList initSelectedChat={initSelectedChat} ref={chatListRef} />
					) : (
						<AddressBook handleChooseChat={handleChooseChat} ref={addressBookRef} />
					)}
				</div>
			</div>
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
				openAudioModal && callFriendInfo && (
					<AudioModal
						openmodal={openAudioModal}
						handleModal={handleAudioModal}
						status="receive"
						friendInfo={callFriendInfo}
					/>
				)
			}
			{
				// 视频通话弹窗
				openVideoModal && callFriendInfo && (
					<VideoModal
						openmodal={openVideoModal}
						handleModal={handleVideoModal}
						status="receive"
						friendInfo={callFriendInfo}
					/>
				)
			}
		</div>
	);
};

export default Container;
