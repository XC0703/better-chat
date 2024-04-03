import { Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';

import styles from './index.module.less';
import {
	CallStatus,
	callStatusType,
	ICallModalProps,
	IConnectParams
} from '../AudioModal/api/type';

import { CallIcons, CallBgImage } from '@/assets/images';
import { wsBaseURL } from '@/config';
import useShowMessage from '@/hooks/useShowMessage';
import { userStorage } from '@/utils/storage';
import { formatCallTime } from '@/utils/time';

const VideoModal = (props: ICallModalProps) => {
	const showMessage = useShowMessage();
	const { openmodal, handleModal, status, friendInfo } = props;
	const [callStatus, setCallStatus] = useState<callStatusType>(status);
	const [duration, setDuration] = useState<number>(0);
	const localStream = useRef<MediaStream | null>(null); // 本地音视频流，用于存储自己的音视频流，方便结束时关闭
	const PC = useRef<RTCPeerConnection | null>(null); // RTCPeerConnection 实例
	const socket = useRef<WebSocket | null>(null); // websocket 实例
	const friendVideoRef = useRef<HTMLVideoElement>(null); // 好友的 video 标签实例
	const selfVideoRef = useRef<HTMLVideoElement>(null); // 自己的 video 标签实例

	// 初始化 PC（创建一个 RTCPeerConnection 连接实例，该实例是真正负责通信的角色）
	const initPC = () => {
		const pc = new RTCPeerConnection();
		// 给 PC 绑定 onicecandidate 事件，该事件将会在 PC.current!.setLocalDescription(session_desc) 之后自动触发，给对方发送自己的 candidate 数据（接收 candidate，交换 ICE 网络信息）
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
						receiver: friendInfo?.remark
					})
				);
			}
		};
		// 给 PC 绑定 ontrack 事件，该事件用于接收远程视频流并播放，将会在双方交换并设置完 ICE 之后自动触发
		pc.ontrack = evt => {
			if (evt.streams && evt.streams[0] && friendVideoRef.current !== null) {
				friendVideoRef.current.srcObject = evt.streams[0];
			}
		};
		PC.current = pc;
	};

	// 打开音视频通话组件时建立 websocket 连接
	const initSocket = (connectParams: IConnectParams) => {
		// 如果连接参数为空，则不建立连接
		if (connectParams === undefined) return;
		// 如果 socket 已经存在，则重新建立连接
		if (socket.current !== null) {
			socket.current?.close();
			socket.current = null;
		}
		const ws = new WebSocket(
			`${wsBaseURL}/rtc/single?room=${connectParams?.room}&username=${connectParams?.username}`
		);
		ws.onopen = async () => {
			// 如果是邀请人
			if (callStatus === CallStatus.INITIATE) {
				try {
					// 1、获取自己的音视频流
					const stream = await navigator.mediaDevices.getUserMedia({
						video: true,
						audio: true
					});
					localStream.current = stream;
					// 2、添加音频流到 PC 中
					stream.getTracks().forEach(track => {
						PC.current!.addTrack(track, stream);
					});
					// 3、给被邀请人发送创建房间的指令
					socket.current!.send(
						JSON.stringify({
							name: 'createRoom',
							mode: 'video_invitation',
							receiver_username: friendInfo?.receiver_username
						})
					);
				} catch {
					showMessage('error', '获取音频流失败，请检查设备是否正常或者权限是否已开启');
					socket.current!.send(JSON.stringify({ name: 'reject' }));
					socket.current!.close();
					socket.current = null;
					if (localStream.current) {
						localStream.current!.getAudioTracks()[0].stop();
						localStream.current!.getVideoTracks()[0].stop();
					}
					setTimeout(() => {
						handleModal(false);
					}, 1500);
				}
			}
		};
		ws.onmessage = async msg => {
			const data = JSON.parse(msg.data);
			switch (data.name) {
				/**
				 * notConnect：无法建立音视频通话的情况 ———— 双方都可能收到
				 */
				case 'notConnect':
					socket.current!.close();
					socket.current = null;
					if (localStream.current) {
						localStream.current!.getAudioTracks()[0].stop();
						localStream.current!.getVideoTracks()[0].stop();
					}
					setTimeout(() => {
						handleModal(false);
						showMessage('error', data.result);
					}, 1500);
					break;
				/**
				 * new_peer：邀请人接收到有新人进入房间, 则发送视频流和 offer 指令给新人，offer 信息是邀请人发给被邀请人的 SDP（媒体信息）———— 邀请人可能收到
				 */
				case 'new_peer':
					setCallStatus(CallStatus.CALLING);
					PC.current!.createOffer().then(session_desc => {
						PC.current!.setLocalDescription(session_desc); // 邀请人设置本地 SDP，将会触发 PC.onicecandidate 事件，将自己的 candidate 发送给被邀请人
						socket.current!.send(
							JSON.stringify({
								name: 'offer',
								data: {
									sdp: session_desc
								},
								receiver: friendInfo?.receiver_username
							})
						);
					});
					break;
				/**
				 * offer：被邀请人收到邀请人的视频流和 offer 指令，发送 answer 给邀请人 -- 被邀请人可能收到，answer 信息被邀请人发给邀请人的 SDP（媒体信息）
				 */
				case 'offer':
					setCallStatus(CallStatus.CALLING);
					PC.current!.setRemoteDescription(new RTCSessionDescription(data.data.sdp)); // 被邀请人设置邀请人的 SDP
					PC.current!.createAnswer().then(session_desc => {
						PC.current!.setLocalDescription(session_desc); // 被邀请人设置本地 SDP，将会触发 PC.onicecandidate 事件，将自己的 candidate 发送给邀请人
						socket.current!.send(
							JSON.stringify({
								name: 'answer',
								data: {
									sdp: session_desc
								},
								receiver: friendInfo?.receiver_username
							})
						);
					});
					break;
				/**
				 * answer：邀请人收到被邀请人的 answer 指令，设置被邀请人的 SDP ———— 邀请人可能收到
				 */
				case 'answer':
					PC.current!.setRemoteDescription(new RTCSessionDescription(data.data.sdp)); // 邀请人设置被邀请人的 SDP
					break;
				/**
				 * ice_candidate：设置对方的 candidate ———— 双方都可能收到，此时双方的 ICE 设置完毕，可以进行音视频通话
				 */
				case 'ice_candidate': {
					const candidate = new RTCIceCandidate(data.data);
					PC.current!.addIceCandidate(candidate);
					break;
				}
				/**
				 * reject：拒绝或挂断通话 ———— 双方都可能收到
				 */
				case 'reject':
					socket.current!.send(JSON.stringify({ name: 'reject' }));
					socket.current!.close();
					socket.current = null;
					if (localStream.current) {
						localStream.current!.getAudioTracks()[0].stop();
						localStream.current!.getVideoTracks()[0].stop();
					}
					setTimeout(() => {
						handleModal(false);
						showMessage('info', '对方已挂断');
					}, 1500);
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

	// 接受通话 ———— 针对被邀请人使用
	const handleAcceptCall = async () => {
		setCallStatus(CallStatus.CALLING);
		setDuration(0);
		try {
			// 1、获取自己的音视频流并设置到 video 标签中 ———— 针对被邀请人使用
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: true
			});
			selfVideoRef.current!.srcObject = stream;
			localStream.current = stream;
			// 2、添加音频流到 PC 中
			stream.getTracks().forEach(track => {
				PC.current!.addTrack(track, stream);
			});
			// 3、发送 new_peer 指令，告诉邀请人，我要进入房间
			socket.current!.send(
				JSON.stringify({
					name: 'new_peer',
					receiver_username: friendInfo?.receiver_username
				})
			);
		} catch {
			showMessage('error', '获取音频流失败，请检查设备是否正常或者权限是否已开启');
			socket.current!.send(JSON.stringify({ name: 'reject' }));
			socket.current?.close();
			socket.current = null;
			if (localStream.current) {
				localStream.current!.getAudioTracks()[0].stop();
				localStream.current!.getVideoTracks()[0].stop();
			}
			setTimeout(() => {
				handleModal(false);
			}, 1500);
		}
	};

	// 拒绝 / 挂断通话 ———— 双方都可能收到
	const handleRejectCall = () => {
		if (!socket.current) {
			return;
		}
		socket.current!.send(JSON.stringify({ name: 'reject' }));
		socket.current!.close();
		socket.current = null;
		setTimeout(() => {
			handleModal(false);
			if (localStream.current) {
				localStream.current!.getAudioTracks()[0].stop();
				localStream.current!.getVideoTracks()[0].stop();
			}
			showMessage('info', '已挂断通话');
		}, 1500);
	};

	// 通话时间更新
	const handleDuration = () => {
		if (!friendVideoRef.current) {
			return;
		}
		const { currentTime } = friendVideoRef.current;
		setDuration(currentTime);
	};

	// 打开组件时初始化 websocket 连接与初始化 PC 源
	useEffect(() => {
		const { username } = JSON.parse(userStorage.getItem() || '{}');
		initSocket({
			room: friendInfo.room,
			username: username
		});
		initPC();
	}, []);

	// 当通话状态改变时, 获取自己的音视频流并设置到 video 标签中 ———— 针对邀请人使用
	useEffect(() => {
		if (callStatus === CallStatus.CALLING) {
			const getUserMediaAsync = async () => {
				try {
					selfVideoRef.current!.srcObject = localStream.current;
				} catch {
					showMessage('error', '获取音频流失败，请检查设备是否正常或者权限是否已开启');
					socket.current!.send(JSON.stringify({ name: 'reject' }));
					socket.current!.close();
					socket.current = null;
					if (localStream.current) {
						localStream.current!.getAudioTracks()[0].stop();
						localStream.current!.getVideoTracks()[0].stop();
					}
					setTimeout(() => {
						handleModal(false);
					}, 1500);
				}
			};
			getUserMediaAsync();
		}
	}, [callStatus]);

	return (
		<>
			<Modal
				open={openmodal}
				footer={null}
				onCancel={() => handleModal(false)}
				wrapClassName="videoModal"
				width="5rem"
				title="视频通话"
				maskClosable={false}
			>
				{callStatus === CallStatus.INITIATE && (
					<div
						className={styles.videoModalContent}
						style={{ backgroundImage: `url(${CallBgImage})` }}
					>
						<div className={styles.content}>
							<div className={styles.avatar}>
								<img src={friendInfo?.avatar} alt="" />
							</div>
							<span className={styles.callWords}>{` 对 ${friendInfo?.remark} 发起视频通话 `}</span>
							<div className={styles.callIcons}>
								<img src={CallIcons.REJECT} alt="" onClick={handleRejectCall} />
							</div>
						</div>
					</div>
				)}
				{callStatus === CallStatus.RECEIVE && (
					<div
						className={styles.videoModalContent}
						style={{ backgroundImage: `url(${CallBgImage})` }}
					>
						<div className={styles.content}>
							<div className={styles.avatar}>
								<img src={friendInfo?.avatar} alt="" />
							</div>
							<span className={styles.callWords}>{`${friendInfo?.remark} 发起视频通话 `}</span>
							<div className={styles.callIcons}>
								<img src={CallIcons.ACCEPT} alt="" onClick={handleAcceptCall} />
								<img src={CallIcons.REJECT} alt="" onClick={handleRejectCall} />
							</div>
						</div>
					</div>
				)}
				{callStatus === CallStatus.CALLING && (
					<div className={styles.videoModalContent}>
						<div className={`${styles.content} ${styles.callingStatus}`}>
							<div className={styles.friendVideo}>
								<video src="" ref={friendVideoRef} autoPlay onTimeUpdate={handleDuration}></video>
							</div>
							<div className={styles.selfVideo}>
								<video src="" ref={selfVideoRef} autoPlay></video>
							</div>
							<div className={styles.bottom}>
								<span className={styles.callWords}>{formatCallTime(duration)}</span>
								<div className={styles.callIcons}>
									<img src={CallIcons.REJECT} alt="" onClick={handleRejectCall} />
								</div>
							</div>
						</div>
					</div>
				)}
			</Modal>
		</>
	);
};

export default VideoModal;
