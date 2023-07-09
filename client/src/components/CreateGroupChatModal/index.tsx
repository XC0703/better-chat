import { Button, Modal } from 'antd';
import { useState } from 'react';

import styles from './index.module.less';

interface IChangeInfoModal {
  openmodal: boolean;
  handleCreate: () => void;
}
const CreateGroupModal = (props: IChangeInfoModal) => {
  const { openmodal, handleCreate } = props;

  const [open, setOpen] = useState(openmodal);
  const [step, setStep] = useState(0);

  const handleCancel = () => {
    setOpen(false);
    handleCreate();
  };
  return (
    <>
      <Modal title="创建群聊" open={open} footer={null} onCancel={handleCancel} className="createModal">
        {step === 0 ? (
          <div className={styles.step0}>
            <span>第一步</span>
            <Button onClick={() => setStep(1)}>下一步</Button>
          </div>
        ) : (
          <div className={styles.step1}>
            <span>第二步</span>
            <Button onClick={() => setStep(0)}>上一步</Button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default CreateGroupModal;
