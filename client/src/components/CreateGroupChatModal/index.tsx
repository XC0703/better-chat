import { Modal } from 'antd';
import { useState } from 'react';

import styles from './index.module.less';

interface IChangeInfoModal {
  openmodal: boolean;
  handleCreate: () => void;
}
const CreateGroupModal = (props: IChangeInfoModal) => {
  const { openmodal, handleCreate } = props;

  const [open, setOpen] = useState(openmodal);

  const handleCancel = () => {
    setOpen(false);
    handleCreate();
  };

  return (
    <>
      <Modal title="创建群聊" open={open} footer={null} onCancel={handleCancel} width="5rem">
        <div className={styles.createModal}>todo：创建群聊</div>
      </Modal>
    </>
  );
};

export default CreateGroupModal;
