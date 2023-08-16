import { App, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';

import { CallStatus, callStatusType, ICallModalProps, IConnectParams } from './api/type';
import styles from './index.module.less';

import { CallIcons, CallBgImage } from '@/assets/images';
import { wsBaseURL } from '@/config';
import { toggleTime_call } from '@/utils/formatTime';
import { userStorage } from '@/utils/storage';

const AudioModal = (props: ICallModalProps) => {
  const { message } = App.useApp();
  const { openmodal, handleModal, status, friendInfo } = props;
  const [callStatus, setCallStatus] = useState<callStatusType>(status);
  const [duration, setDuration] = useState<number>(0);
  const localStream = useRef<MediaStream | null>(null); // 本地音视频流，用于存储自己的音视频流，方便结束时关闭
  const PC = useRef<RTCPeerConnection | null>(null); // RTCPeerConnection实例
  const socket = useRef<WebSocket | null>(null); // websocket实例
  const videoRef = useRef<HTMLVideoElement>(null); // video标签实例

  // 初始化PC（创建一个 RTCPeerConnection 连接实例，该实例是真正负责通信的角色）
  const initPC = () => {
    const pc = new RTCPeerConnection();
    // 给PC绑定onicecandidate事件，该事件将会在PC.current!.setLocalDescription(session_desc)之后自动触发，给对方发送自己的candidate 数据（接收 candidate，交换 ICE 网络信息）
    pc.onicecandidate = (evt) => {
      if (evt.candidate) {
        socket.current?.send(
          JSON.stringify({
            name: `ice_candidate`,
            data: {
              id: evt.candidate.sdpMid,
              label: evt.candidate.sdpMLineIndex,
              sdpMLineIndex: evt.candidate.sdpMLineIndex,
              candidate: evt.candidate.candidate,
            },
            receiver: friendInfo?.remark,
          }),
        );
      }
    };
    // 给PC绑定ontrack事件，该事件用于接收远程视频流并播放，将会在双方交换并设置完ICE之后自动触发
    pc.ontrack = (evt) => {
      if (evt.streams && evt.streams[0] && videoRef.current !== null) {
        videoRef.current.srcObject = evt.streams[0];
      }
    };
    PC.current = pc;
  };

  // 打开音视频通话组件时建立websocket连接
  const initSocket = (connectParams: IConnectParams) => {
    // 如果连接参数为空，则不建立连接
    if (connectParams === undefined) return;
    // 如果socket已经存在，则重新建立连接
    if (socket.current !== null) {
      socket.current?.close();
      socket.current = null;
    }
    const ws = new WebSocket(`${wsBaseURL}/rtc/single?room=${connectParams?.room}&username=${connectParams?.username}`);
    ws.onopen = async () => {
      // 如果是邀请人
      if (callStatus === CallStatus.INITIATE) {
        try {
          // 1、获取自己的音视频流
          const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
          localStream.current = stream;
          ///2、添加音频流到PC中
          stream.getTracks().forEach((track) => {
            PC.current!.addTrack(track, stream);
          });
          // 3、给被邀请人发送创建房间的指令
          socket.current!.send(
            JSON.stringify({
              name: 'createRoom',
              mode: 'audio_invitation',
              receiver_username: friendInfo?.receiver_username,
            }),
          );
        } catch (error) {
          message.error('检测到当前设备不支持麦克风,请设置权限后在重试', 1.5);
          socket.current!.send(JSON.stringify({ name: 'reject' }));
          socket.current!.close();
          socket.current = null;
          if (localStream.current) {
            localStream.current!.getAudioTracks()[0].stop();
          }
          setTimeout(() => {
            handleModal(false);
          }, 1500);
        }
      }
    };
    ws.onmessage = (msg) => {
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
          }
          setTimeout(() => {
            handleModal(false);
            message.info(data.result, 1.5);
          }, 1500);
          break;
        /**
         * new_peer：邀请人接收到有新人进入房间,则发送视频流和offer指令给新人，offer信息是邀请人发给被邀请人的SDP（媒体信息）———— 邀请人可能收到
         */
        case 'new_peer':
          setCallStatus(CallStatus.CALLING);
          PC.current!.createOffer().then((session_desc) => {
            PC.current!.setLocalDescription(session_desc); // 邀请人设置本地SDP，将会触发PC.onicecandidate事件，将自己的candidate发送给被邀请人
            socket.current!.send(
              JSON.stringify({
                name: 'offer',
                data: {
                  sdp: session_desc,
                },
                receiver: friendInfo?.receiver_username,
              }),
            );
          });
          break;
        /**
         * offer：被邀请人收到邀请人的视频流和offer指令，发送answer给邀请人 ———— 被邀请人可能收到，answer信息被邀请人发给邀请人的SDP（媒体信息）
         */
        case 'offer':
          setCallStatus(CallStatus.CALLING);
          PC.current!.setRemoteDescription(new RTCSessionDescription(data.data.sdp)); // 被邀请人设置邀请人的SDP
          PC.current!.createAnswer().then((session_desc) => {
            PC.current!.setLocalDescription(session_desc); // 被邀请人设置本地SDP，将会触发PC.onicecandidate事件，将自己的candidate发送给邀请人
            socket.current!.send(
              JSON.stringify({
                name: 'answer',
                data: {
                  sdp: session_desc,
                },
                receiver: friendInfo?.receiver_username,
              }),
            );
          });
          break;
        /**
         * answer：邀请人收到被邀请人的answer指令，设置被邀请人的SDP ———— 邀请人可能收到
         */
        case 'answer':
          PC.current!.setRemoteDescription(new RTCSessionDescription(data.data.sdp)); // 邀请人设置被邀请人的SDP
          break;
        /**
         * ice_candidate：设置对方的candidate ———— 双方都可能收到，此时双方的ICE设置完毕，可以进行音视频通话
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
          }
          setTimeout(() => {
            handleModal(false);
            message.info('对方已挂断', 1.5);
          }, 1500);
          break;
        default:
          break;
      }
    };
    ws.onerror = () => {
      message.error('websocket连接错误', 1.5);
    };
    socket.current = ws;
  };

  // 接受通话 ———— 针对被邀请人使用
  const handleAcceptCall = async () => {
    setCallStatus(CallStatus.CALLING);
    setDuration(0);
    try {
      // 1、获取自己的音视频流
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStream.current = stream;
      // 2、添加音频流到PC中
      stream.getTracks().forEach((track) => {
        PC.current!.addTrack(track, stream);
      });
      // 3、发送new_peer指令，告诉邀请人，我要进入房间
      socket.current!.send(JSON.stringify({ name: 'new_peer', receiver_username: friendInfo?.receiver_username }));
    } catch (error) {
      message.error('检测到当前设备不支持麦克风和相机,请设置权限后在重试', 1.5);
      socket.current!.send(JSON.stringify({ name: 'reject' }));
      socket.current?.close();
      socket.current = null;
      if (localStream.current) {
        localStream.current!.getAudioTracks()[0].stop();
      }
      setTimeout(() => {
        handleModal(false);
      }, 1500);
    }
  };

  // 拒绝/挂断通话 ———— 双方都可能收到
  const handleRejectCall = async () => {
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
      }
      message.info('已挂断通话', 1.5);
    }, 1500);
  };

  // 通话时间更新
  const handleDuration = () => {
    if (!videoRef.current) {
      return;
    }
    const { currentTime } = videoRef.current;
    setDuration(currentTime);
  };

  // 打开组件时初始化websocket连接与初始化PC源
  useEffect(() => {
    const { username } = JSON.parse(userStorage.getItem() || '{}');
    initSocket({
      room: friendInfo.room,
      username: username,
    });
    initPC();
  }, []);

  return (
    <>
      <Modal
        open={openmodal}
        footer={null}
        onCancel={() => handleModal(false)}
        wrapClassName="audioModal"
        width="5rem"
        title="语音通话"
        maskClosable={false}
      >
        <div className={styles.audioModalContent} style={{ backgroundImage: `url(${CallBgImage})` }}>
          <div className={styles.content}>
            <div className={styles.avatar}>
              <img src={friendInfo?.avatar} alt="" />
            </div>
            {callStatus === CallStatus.INITIATE && (
              <>
                <span className={styles.callWords}>{`对${friendInfo?.remark}发起语音通话`}</span>
                <div className={styles.callIcons}>
                  <img src={CallIcons.REJECT} alt="" onClick={handleRejectCall} />
                </div>
              </>
            )}
            {callStatus === CallStatus.RECEIVE && (
              <>
                <span className={styles.callWords}>{`${friendInfo?.remark}发起语音通话`}</span>
                <div className={styles.callIcons}>
                  <img src={CallIcons.ACCEPT} alt="" onClick={handleAcceptCall} />
                  <img src={CallIcons.REJECT} alt="" onClick={handleRejectCall} />
                </div>
              </>
            )}
            {callStatus === CallStatus.CALLING && (
              <>
                <span className={styles.callWords}>{toggleTime_call(duration)}</span>
                <video
                  src=""
                  ref={videoRef}
                  autoPlay
                  style={{ opacity: 0, width: 0, height: 0 }}
                  onTimeUpdate={handleDuration}
                ></video>
                <div className={styles.callIcons}>
                  <img src={CallIcons.REJECT} alt="" onClick={handleRejectCall} />
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>
      ;
    </>
  );
};

export default AudioModal;
