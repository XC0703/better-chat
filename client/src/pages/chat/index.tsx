import { Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { userStorage, clearSessionStorage } from '@/common/storage';
import { handleLogout } from './api';
import { IUserInfo } from './api/type';
import Container from '../container';
import styles from './index.module.less';
const Chat = () => {
  const navigate = useNavigate();
  const confirmLogout = () => {
    handleLogout(JSON.parse(userStorage.getItem() || '{}') as IUserInfo)
      .then((res) => {
        if (res.code === 200) {
          clearSessionStorage();
          message.success('退出成功', 1.5);
          navigate('/login');
        } else {
          message.error('退出失败,请重试', 1.5);
        }
      })
      .catch(() => {
        message.error('退出失败,请重试', 1.5);
      });
  };
  return (
    <>
      <div className={styles.bgContainer}>
        <Button type="primary" onClick={confirmLogout}>
          {JSON.parse(userStorage.getItem()).username}退出登录
        </Button>
        <Container />
      </div>
    </>
  );
};

export default Chat;
