import { App, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';

import styles from './index.module.less';
import { CallStatus, callStatusType, ICallModalProps, IConnectParams } from '../AudioModal/api/type';

import { CallIcons, CallBgImage } from '@/assets/images';
import { wsBaseURL, iceServer } from '@/config';
import { toggleTime_call } from '@/utils/formatTime';
import { userStorage } from '@/utils/storage';

const VideoModal = (props: ICallModalProps) => {
  const { message } = App.useApp();
  const { openmodal, handleModal, status, friendInfo } = props;
  const [callStatus, setCallStatus] = useState<callStatusType>(status);
  const [duration, setDuration] = useState<number>(0);
  const [PC, setPC] = useState<RTCPeerConnection | null>(null); // RTCPeerConnection实例
  const socket = useRef<WebSocket | null>(null); // websocket实例
  const friendVideoRef = useRef<HTMLVideoElement>(null); // 好友的video标签实例
  const selfVideoRef = useRef<HTMLVideoElement>(null); // 自己的video标签实例

  //初始化PC
  const initPC = () => {
    const pc = new RTCPeerConnection(iceServer);
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
    pc.ontrack = (evt) => {
      if (evt.streams && evt.streams[0] && friendVideoRef.current !== null) {
        friendVideoRef.current.srcObject = evt.streams[0];
      }
    };
    setPC(pc);
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
      //如果是邀请人则发送创建房间指令
      if (callStatus === CallStatus.INITIATE) {
        /**
         * 1.邀请人先创建麦克风并初始化PC源
         * 2.发送创建房间的指令到当前房间,后端接受到指令后,给当前房间的所有用户发送响应的指令
         */
        try {
          //最新的标准API
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          //添加音频流
          if (PC && PC.ontrack) {
            const trackEvent = new RTCTrackEvent('track', {
              receiver: new RTCRtpReceiver(),
              streams: [stream], // 将 stream 放入数组中
              track: stream.getVideoTracks()[0], // 获取音频轨道
              transceiver: new RTCRtpTransceiver(),
            });
            PC.ontrack(trackEvent);
          }
          //发起邀请
          socket.current!.send(
            JSON.stringify({
              name: 'createRoom',
              mode: 'video_invitation',
              receiver_username: friendInfo?.receiver_username,
            }),
          );
        } catch (error) {
          message.error('检测到当前设备不支持麦克风,请设置权限后在重试', 1.5);
          socket.current?.send(
            JSON.stringify({
              name: 'reject',
            }),
          );
          socket.current?.close();
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
         * 无法建立音视频通话的情况
         */
        case 'notConnect':
          socket.current!.close();
          socket.current = null;
          setTimeout(() => {
            handleModal(false);
            message.info(data.result, 1.5);
          }, 1500);
          break;
        /**
         * 1.邀请人接收到有新人进入房间,则发送视频流和offer指令给新人
         */
        case 'new_peer':
          setCallStatus(CallStatus.CALLING);
          PC!.createOffer().then((session_desc) => {
            PC!.setLocalDescription(session_desc);
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
         * 1.新人接受到对方同意的指令后,将对方的音视频流通过setRemoteDescription函数进行存储
         * 2.存储完后新人创建answer来获取自己的音视频流,通过setLocalDescription函数存储自己的音视频流,并发送answer指令(携带自己的音视频)告诉对方要存储邀请人的音视频
         */
        case 'offer':
          setCallStatus(CallStatus.CALLING);
          //当收到对方接收请求后,设置音频源,并发送answer给对方
          PC!.setRemoteDescription(new RTCSessionDescription(data.data.sdp));
          PC!.createAnswer().then((session_desc) => {
            PC!.setLocalDescription(session_desc);
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
        case 'answer':
          //设置邀请方发来的音频源
          PC!.setRemoteDescription(new RTCSessionDescription(data.data.sdp));
          break;
        case 'ice_candidate': {
          const candidate = new RTCIceCandidate(data.data);
          PC!.addIceCandidate(candidate);
          break;
        }
        case 'reject':
          socket.current!.send(JSON.stringify({ name: 'reject' }));
          socket.current!.close();
          socket.current = null;
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

  // 接受通话
  const handleAcceptCall = async () => {
    setCallStatus(CallStatus.CALLING);
    setDuration(0);
    /**
     * 1.点击同意后
     * 2.获取自己的视频流
     * 3.初始化PC源
     * 4.PC添加音视频流
     * 5.并发送new_peer指令(携带自己的音视频)告诉房间的人,我要进入房间
     */
    try {
      //最新的标准API
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      //添加音频流
      if (PC && PC.ontrack) {
        const trackEvent = new RTCTrackEvent('track', {
          receiver: new RTCRtpReceiver(),
          streams: [stream], // 将 stream 放入数组中
          track: stream.getAudioTracks()[0], // 获取音频轨道
          transceiver: new RTCRtpTransceiver(),
        });
        PC.ontrack(trackEvent);
      }
      //通知房间的人,我要进入房间
      socket.current!.send(JSON.stringify({ name: 'new_peer', receiver_username: friendInfo?.receiver_username }));
    } catch (error) {
      message.error('检测到当前设备不支持麦克风,请设置权限后在重试', 1.5);
      socket.current?.send(
        JSON.stringify({
          name: 'reject',
        }),
      );
      socket.current?.close();
      setTimeout(() => {
        handleModal(false);
      }, 1500);
    }
  };
  // 拒绝通话
  const handleRejectCall = () => {
    if (!socket.current) {
      return;
    }
    socket.current!.send(JSON.stringify({ name: 'reject' }));
    socket.current!.close();
    socket.current = null;
    setTimeout(() => {
      handleModal(false);
      message.info('已挂断通话', 1.5);
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

  // 打开组件时初始化websocket连接
  useEffect(() => {
    const { username } = JSON.parse(userStorage.getItem() || '{}');
    initSocket({
      room: friendInfo.room,
      username: username,
    });
    // 初始化PC源;
    initPC();
  }, []);

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
          <div className={styles.videoModalContent} style={{ backgroundImage: `url(${CallBgImage})` }}>
            <div className={styles.content}>
              <div className={styles.avatar}>
                <img src={friendInfo?.avatar} alt="" />
              </div>
              <span className={styles.callWords}>{`对${friendInfo?.remark}发起视频通话`}</span>
              <div className={styles.callIcons}>
                <img src={CallIcons.REJECT} alt="" onClick={handleRejectCall} />
              </div>
            </div>
          </div>
        )}
        {callStatus === CallStatus.RECEIVE && (
          <div className={styles.videoModalContent} style={{ backgroundImage: `url(${CallBgImage})` }}>
            <div className={styles.content}>
              <div className={styles.avatar}>
                <img src={friendInfo?.avatar} alt="" />
              </div>
              <span className={styles.callWords}>{`${friendInfo?.remark}发起视频通话`}</span>
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
                <span className={styles.callWords}>{toggleTime_call(duration)}</span>
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
