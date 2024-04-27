import { Drawer, Modal, Empty } from 'antd';
import { useEffect, useRef, useState } from 'react';

import { getRoomMembers } from './api';
import styles from './index.module.less';
import {
	CallStatus,
	callStatusType,
	ICallModalProps,
	IConnectParams,
	ICallList,
	IRoomMembersItem
} from './type';

import { CallIcons } from '@/assets/images';
import ImageLoad from '@/components/ImageLoad';
import { wsBaseURL } from '@/config';
import useShowMessage from '@/hooks/useShowMessage';
import { HttpStatus } from '@/utils/constant';
import { userStorage } from '@/utils/storage';
import { formatCallTime } from '@/utils/time';

const AudioModal = (props: ICallModalProps) => {
	const showMessage = useShowMessage();
	const { openmodal, handleModal, status, type, callInfo } = props;
	const user = JSON.parse(userStorage.getItem());
	const [callStatus, setCallStatus] = useState<callStatusType>(status);
	const [duration, setDuration] = useState<number>(0);
	const [callList, setCallList] = useState<ICallList>({}); // 与 callListRef 作用类似，不过可以负责相关DOM的渲染
	const callListRef = useRef<ICallList>({}); // 主要负责存储通话对象信息，每个通话对象都有一个 RTCPeerConnection 实例，该实例是真正负责音视频通信的角色
	const [roomMembers, setRoomMembers] = useState<IRoomMembersItem[]>([]); // 当前房间内正在通话的所有人
	const [isShowRoomMembersDrawer, setIsRoomMembersDrawer] = useState<boolean>(false); // 是否显示当前通话人列表抽屉
	const localStream = useRef<MediaStream | null>(null); // 本地音视频流，用于存储自己的音视频流，方便结束时关闭
	const socket = useRef<WebSocket | null>(null); // websocket 实例

	// 打开音视频通话组件时建立 websocket 连接
	const initSocket = (connectParams: IConnectParams) => {
		// 如果 socket 已经存在，则重新建立连接
		if (socket.current !== null) {
			socket.current.close();
			socket.current = null;
		}
		const ws = new WebSocket(
			`${wsBaseURL}/rtc/connect?room=${connectParams.room}&username=${connectParams.username}&type=${connectParams.type}`
		);
		ws.onopen = async () => {
			// 如果是通话发起人，则初始化音视频流并发送创建房间指令
			if (callStatus === CallStatus.INITIATE) {
				try {
					// 1、获取并设置自己的音视频流
					await initStream();
					// 2、给被邀请人发送创建房间的指令（mode 作用是区分是私聊还是群聊，callReceiverList 作用是说明哪些人需要被邀请加入通话）
					socket.current?.send(
						JSON.stringify({
							name: 'create_room',
							mode: connectParams.type === 'private' ? 'private_audio' : 'group_audio',
							callReceiverList: callInfo.callReceiverList
						})
					);
				} catch {
					showMessage('error', '获取音频流失败，请检查设备是否正常或者权限是否已开启');
					socket.current?.send(JSON.stringify({ name: 'reject' }));
					socket.current?.close();
					socket.current = null;
					localStream.current?.getAudioTracks()[0].stop();
					setTimeout(() => {
						handleModal(false);
					}, 1500);
				}
			}
		};
		ws.onmessage = async e => {
			const message = JSON.parse(e.data); // 客户端接收到的 message 包含 name、reason、data、sender，其中只有 name 指令名称是必须收到的，reason 是 reject 时收到的，sender 是 new_peer、offer、answer、ice_candidate 时收到的，data 是 offer、answer、ice_candidate 时收到的
			switch (message.name) {
				/**
				 * connect_fail：无法建立音视频通话的情况 ———— 通话发起人可能收到
				 */
				case 'connect_fail':
					socket.current?.close();
					socket.current = null;
					if (localStream.current) {
						localStream.current?.getAudioTracks()[0].stop();
					}
					setTimeout(() => {
						handleModal(false);
						showMessage('error', message.reason);
					}, 1500);
					break;
				/**
				 * new_peer：接收到有新人进入房间, 则初始化和该新人的 PC 通道，并发送自己 offer 信息给该新人（ offer 信息包含自己的 SDP 信息）
				 */
				case 'new_peer':
					setCallStatus(CallStatus.CALLING);
					if (type !== 'private') {
						await getRoomMembersData();
					}
					// 添加自己的音频流到与该新人的 PC 通道中
					localStream.current!.getTracks().forEach(track => {
						callListRef.current[message.sender].PC!.addTrack(
							track,
							localStream.current as MediaStream
						);
					});
					// 自己设置本地 SDP，将会触发 PC.onicecandidate 事件，将自己的 candidate 发送给对方
					callListRef.current[message.sender].PC!.createOffer().then(session_desc => {
						callListRef.current[message.sender].PC!.setLocalDescription(session_desc);
						socket.current?.send(
							JSON.stringify({
								name: 'offer',
								data: {
									sdp: session_desc
								},
								receiver: message.sender
							})
						);
					});
					break;
				/**
				 * offer：进入房间的新人收到并设置对方发送过来的 SDP 后，也发送自己的 SDP 给对方
				 */
				case 'offer':
					// 添加自己的音频流到与该新人的 PC 通道中
					localStream.current!.getTracks().forEach(track => {
						callListRef.current[message.sender].PC!.addTrack(
							track,
							localStream.current as MediaStream
						);
					});
					// 设置远程 SDP
					callListRef.current[message.sender].PC!.setRemoteDescription(
						new RTCSessionDescription(message.data.sdp)
					);
					callListRef.current[message.sender].PC!.createAnswer().then(session_desc => {
						callListRef.current[message.sender].PC!.setLocalDescription(session_desc); // 被邀请人设置本地 SDP，将会触发 PC.onicecandidate 事件，将自己的 candidate 发送给邀请人
						socket.current?.send(
							JSON.stringify({
								name: 'answer',
								data: {
									sdp: session_desc
								},
								receiver: message.sender
							})
						);
					});
					break;
				/**
				 * answer：接收到房间新人发送过来的 SDP 后，设置对方的 SDP，此时双方的 SDP 设置完毕, 将会触发 PC.onicecandidate 事件，互相交换 candidate
				 */
				case 'answer':
					// 设置远程 SDP
					callListRef.current[message.sender].PC!.setRemoteDescription(
						new RTCSessionDescription(message.data.sdp)
					);
					break;
				/**
				 * ice_candidate：设置对方的 candidate
				 */
				case 'ice_candidate': {
					const candidate = new RTCIceCandidate(message.data);
					callListRef.current[message.sender].PC!.addIceCandidate(candidate);
					break;
				}
				/**
				 * reject：对方拒绝或挂断通话
				 */
				case 'reject':
					if (type === 'private') {
						socket.current?.close();
						socket.current = null;
						if (localStream.current) {
							localStream.current?.getAudioTracks()[0].stop();
						}
						setTimeout(() => {
							handleModal(false);
							showMessage('info', `对方已挂断`);
						}, 1500);
					} else {
						await getRoomMembersData();
						setTimeout(() => {
							showMessage('info', `${message.sender} 已退出群语音通话`);
						}, 1500);
						const video = document.querySelector(`.video_${message.sender}`) as HTMLVideoElement;
						if (video) {
							video.style.display = 'none';
						}
					}
					break;
				default:
					break;
			}
		};
		ws.onerror = () => {
			showMessage('error', 'websocket 连接错误');
		};
		socket.current = ws;
	};

	// 初始化本人音视频流
	const initStream = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: false,
				audio: true
			});
			localStream.current = stream;
		} catch {
			showMessage('error', '获取音频流失败，请检查设备是否正常或者权限是否已开启');
			handleModal(false);
		}
	};

	// 初始化 PC 通道（为房间内每个能接收到自己音视频流的人创建一个专属的 RTCPeerConnection 连接实例，该实例是真正负责音视频通信的角色）
	const initPC = (username: string) => {
		const pc = new RTCPeerConnection();
		// 给 PC 绑定 onicecandidate 事件，该事件将会 PC 通道双方彼此的 SDP（会话描述协议）设置完成之后自动触发，给对方发送自己的 candidate 数据（接收 candidate，交换 ICE 网络信息）
		pc.onicecandidate = evt => {
			if (evt.candidate) {
				socket.current?.send(
					JSON.stringify({
						name: `ice_candidate`,
						data: {
							id: evt.candidate.sdpMid,
							label: evt.candidate.sdpMLineIndex,
							sdpMLineIndex: evt.candidate.sdpMLineIndex,
							candidate: evt.candidate.candidate
						},
						receiver: username
					})
				);
			}
		};
		// 给 PC 绑定 ontrack 事件，该事件用于接收远程视频流并播放，将会在双方交换并设置完 ICE 之后自动触发
		pc.ontrack = evt => {
			if (evt.streams && evt.streams[0]) {
				const audio = document.querySelector(`.audio_${username}`) as HTMLVideoElement;
				if (audio) {
					audio.srcObject = evt.streams[0];
				}
			}
		};
		callListRef.current[username] = {
			PC: pc,
			alias: callInfo.callReceiverList.find(item => item.username === username)?.alias || '',
			avatar: callInfo.callReceiverList.find(item => item.username === username)?.avatar || ''
		};
	};

	// 接受通话 ———— 针对被邀请人使用
	const handleAcceptCall = async () => {
		setCallStatus(CallStatus.CALLING);
		try {
			// 1、获取自己的音视频流
			await initStream();
			// 2、发送 new_peer 指令，告诉房间内其他人自己要进入房间
			socket.current?.send(
				JSON.stringify({
					name: 'new_peer'
				})
			);
			if (type !== 'private') {
				await getRoomMembersData();
			}
		} catch {
			showMessage('error', '获取音频流失败，请检查设备是否正常或者权限是否已开启');
			socket.current?.send(JSON.stringify({ name: 'reject' }));
			socket.current?.close();
			socket.current = null;
			if (localStream.current) {
				localStream.current?.getAudioTracks()[0].stop();
			}
			setTimeout(() => {
				handleModal(false);
			}, 1500);
		}
	};

	// 拒绝 / 挂断通话
	const handleRejectCall = async () => {
		if (!socket.current) {
			return;
		}
		socket.current?.send(JSON.stringify({ name: 'reject' }));
		socket.current?.close();
		socket.current = null;
		setTimeout(() => {
			handleModal(false);
			if (localStream.current) {
				localStream.current?.getAudioTracks()[0].stop();
			}
			showMessage('info', `${type === 'private' ? '已挂断通话' : '已退出群语音通话'}`);
		}, 1500);
	};

	// 获取当前房间内正在通话的所有人
	const getRoomMembersData = async () => {
		try {
			const res = await getRoomMembers(callInfo.room);
			if (res.code === HttpStatus.SUCCESS && res.data) {
				const newRoomMembers = res.data.map(item => {
					return {
						username: item,
						muted: roomMembers.find(member => member.username === item)?.muted || false
					};
				});
				setRoomMembers(newRoomMembers);
			} else {
				showMessage('error', '获取房间成员失败');
			}
		} catch {
			showMessage('error', '获取房间成员失败');
		}
	};

	// 禁音 / 解除禁音
	const handleMute = (item: IRoomMembersItem) => {
		const audio = document.querySelector(`.audio_${item.username}`) as HTMLVideoElement;
		if (audio) {
			audio.muted = !audio.muted;
		}
		const newRoomMembers = roomMembers.map(member => {
			if (member.username === item.username) {
				member.muted = !member.muted;
			}
			return member;
		});
		setRoomMembers(newRoomMembers);
	};

	// 打开组件时初始化 websocket 连接和 PC 通道
	useEffect(() => {
		const params: IConnectParams = {
			room: callInfo.room,
			username: user.username,
			type: type
		};
		initSocket(params);
		// 初始化所有的 PC 通道
		callInfo.callReceiverList.forEach(item => {
			initPC(item.username);
		});
	}, []);

	// callList 的初始化，用于渲染 video 标签
	useEffect(() => {
		setCallList(callListRef.current);
	}, [callListRef.current]);

	// 当有人和自己通话时，监听通话时间
	useEffect(() => {
		if (callStatus === CallStatus.CALLING) {
			const timer = setInterval(() => {
				setDuration(duration => duration + 1);
			}, 1000);
			return () => {
				clearInterval(timer);
			};
		}
	}, [callStatus]);

	return (
		<>
			<Modal
				open={openmodal}
				footer={null}
				wrapClassName="audioModal"
				width="5rem"
				title={`${type === 'private' ? '' : '群'}语音通话 `}
				maskClosable={false}
				closable={type === 'private' ? false : true}
				closeIcon={type === 'private' ? null : <span className="iconfont icon-jinqunliaoliao" />}
				onCancel={async () => {
					setIsRoomMembersDrawer(!isShowRoomMembersDrawer);
					if (type !== 'private' && callStatus !== CallStatus.CALLING) {
						await getRoomMembersData();
					}
				}}
			>
				<div className={styles.audioModalContent}>
					<div className={styles.content}>
						<div className={styles.avatar}>
							<ImageLoad
								src={type === 'private' ? callInfo.callReceiverList[0].avatar : CallIcons.AUDIO}
							/>
						</div>
						{callStatus === CallStatus.INITIATE && (
							<>
								<span className={styles.callWords}>
									{type === 'private'
										? ` 对 ${callInfo.callReceiverList[0].alias} 发起语音通话 `
										: '发起群语音通话'}
								</span>
								<div className={styles.callIcons}>
									<img src={CallIcons.REJECT} alt="" onClick={handleRejectCall} draggable="false" />
								</div>
							</>
						)}
						{callStatus === CallStatus.RECEIVE && (
							<>
								<span className={styles.callWords}>
									{type === 'private'
										? `${callInfo.callReceiverList[0].alias} 发起语音通话 `
										: '有人邀请您加入群语音通话'}
								</span>
								<div className={styles.callIcons}>
									<img src={CallIcons.ACCEPT} alt="" onClick={handleAcceptCall} draggable="false" />
									<img src={CallIcons.REJECT} alt="" onClick={handleRejectCall} draggable="false" />
								</div>
							</>
						)}
						{callStatus === CallStatus.CALLING && (
							<>
								{callList &&
									Object.keys(callList).map(username => {
										if (username === user.username) return null;
										return (
											<video
												key={username}
												src=""
												className={`audio_${username}`}
												autoPlay
												style={{ opacity: 0, width: 0, height: 0 }}
											></video>
										);
									})}
								<span className={styles.callWords}>{formatCallTime(duration)}</span>
								<div className={styles.callIcons}>
									<img src={CallIcons.REJECT} alt="" onClick={handleRejectCall} draggable="false" />
								</div>
							</>
						)}
						{type !== 'private' && (
							<Drawer
								title="当前正在通话的群成员"
								placement="right"
								closable={false}
								onClose={() => {
									setIsRoomMembersDrawer(false);
								}}
								open={isShowRoomMembersDrawer}
								getContainer={false}
								width="50%"
								forceRender={true}
								className="memberDrawer"
							>
								{roomMembers.length ? (
									roomMembers.map(item => {
										return (
											<li key={item.username}>
												<span>{item.username}</span>
												<span
													className={`iconfont ${item.muted ? 'icon-jingyin' : 'icon-yuyintonghua'}`}
													onClick={() => handleMute(item)}
												></span>
											</li>
										);
									})
								) : (
									<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无群友加入通话" />
								)}
							</Drawer>
						)}
					</div>
				</div>
			</Modal>
			;
		</>
	);
};

export default AudioModal;
