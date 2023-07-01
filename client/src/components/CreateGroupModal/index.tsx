import { Modal } from 'antd';
import { useState } from 'react';

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
      <Modal open={open} footer={null} onCancel={handleCancel}></Modal>
    </>
  );
};

export default CreateGroupModal;
