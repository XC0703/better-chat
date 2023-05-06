import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { tokenStorage } from '@/common/storage';
const Chat = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    tokenStorage.removeItem();
    navigate('/login');
  };
  return (
    <>
      <Button type="primary" onClick={handleLogout}>
        退出登录
      </Button>
    </>
  );
};

export default Chat;
