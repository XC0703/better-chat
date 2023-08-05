import { Modal } from 'antd';

import styles from './index.module.less';

interface IChangeInfoModal {
  openmodal: boolean;
  handleModal: (open: boolean) => void;
}
const CreateGroupModal = (props: IChangeInfoModal) => {
  const { openmodal, handleModal } = props;

  return (
    <>
      <Modal
        title="创建群聊"
        open={openmodal}
        footer={null}
        onCancel={() => {
          handleModal(false);
        }}
        width="5rem"
      >
        <div className={styles.createModal}>todo：创建群聊</div>
      </Modal>
    </>
  );
};

export default CreateGroupModal;
