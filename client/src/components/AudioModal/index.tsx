import { App, Modal } from 'antd';
import { useState } from 'react';

import styles from './index.module.less';

import { CallIcons } from '@/assets/links/imagesLinks';
import { CallBgImage } from '@/assets/links/imagesLinks';
import { toggleTime_call } from '@/utils/formatTime';

// 通话状态
export enum CallStatus {
  INITIATE = 'initiate',
  RECEIVE = 'receive',
  CALLING = 'calling',
}
export type callStatusType = 'initiate' | 'receive' | 'calling';
// 音视频通话弹窗组件参数
export interface ICallModalProps {
  openmodal: boolean;
  handleModal: (open: boolean) => void;
  status: callStatusType;
  friendInfo?: {
    remark: string;
    avatar: string;
    room: string;
  };
}

const AudioModal = (props: ICallModalProps) => {
  const { message } = App.useApp();
  const { openmodal, handleModal, status, friendInfo } = props;
  const [callStatus, setCallStatus] = useState<callStatusType>(status);
  const [duration, setDuration] = useState<number>(0);

  // 接受通话--to do
  const handleAcceptCall = () => {
    setCallStatus(CallStatus.CALLING);
    setDuration(0);
    setInterval(() => {
      setDuration((duration) => duration + 1);
    }, 1000);
  };
  // 拒绝通话--to do
  const handleRejectCall = () => {
    handleModal(false);
    message.info('已挂断通话', 1.5);
  };

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
