import { Tooltip, Button, message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { menuIconList } from '@/assets/icons';
import ChangePwdModal from '@/components/ChangePwdModal';
import ChangeInfoModal from '@/components/ChangeInfoModal';
import { handleLogout, IUserInfo } from '@/utils/logout';
import { clearSessionStorage, userStorage } from '@/utils/storage';

import AddressBook from './AddressBook';
import ChatList from './ChatList';
import styles from './index.module.less';

const Container = () => {
  const navigate = useNavigate();
  const { name, avatar, phone, signature } = JSON.parse(userStorage.getItem() || '{}');
  const [currentIcon, setCurrentIcon] = useState<string>('icon-message');
  const [openForgetModal, setForgetModal] = useState(false);
  const [openInfoModal, setInfoModal] = useState(false);

  // 控制修改密码的弹窗显隐
  const handleForget = () => {
    setForgetModal(!openForgetModal);
  };
  // 控制修改信息的弹窗显隐
  const handleInfo = () => {
    setInfoModal(!openInfoModal);
  };
  // 退出登录
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
  // 点击头像用户信息弹窗
  const infoContent = (
    <div className={styles.infoContent}>
      <div className={styles.infoContainer}>
        <div className={styles.avatar}>
          <img src={avatar} alt="" />
        </div>
        <div className={styles.info}>
          <div className={styles.name}>{name}</div>
          <div className={styles.phone}>手机号：{phone}</div>
          <div className={styles.signature}>{signature === '' ? '暂无个性签名' : signature}</div>
        </div>
      </div>
      <div className={styles.btnContainer}>
        <Button
          onClick={() => {
            handleForget();
          }}
        >
          修改密码
        </Button>
        <Button
          onClick={() => {
            handleInfo();
          }}
        >
          修改信息
        </Button>
      </div>
    </div>
  );
  return (
    <>
      <div className={styles.container}>
        <div className={styles.leftContainer}>
          <Tooltip placement="bottomLeft" title={infoContent} arrow={false} open={true}>
            <div className={styles.avatar}>
              <img src={avatar} alt="" />
            </div>
          </Tooltip>
          <div className={styles.iconList}>
            <ul className={styles.topIcons}>
              {menuIconList.slice(0, 5).map((item) => {
                return (
                  <Tooltip key={item.text} placement="bottomLeft" title={item.text} arrow={false}>
                    <li
                      className={`iconfont ${item.icon}`}
                      onClick={() => {
                        if (item.text == '聊天' || item.text == '通讯录') {
                          setCurrentIcon(item.icon);
                        }
                      }}
                      style={{
                        color: currentIcon === item.icon ? '#07c160' : '#979797',
                      }}
                    ></li>
                  </Tooltip>
                );
              })}
            </ul>
            <ul className={styles.bottomIcons}>
              {menuIconList.slice(5, 8).map((item) => {
                return (
                  <Tooltip key={item.text} placement="bottomLeft" title={item.text} arrow={false}>
                    <li
                      className={`iconfont ${item.icon}`}
                      onClick={() => {
                        if (item.text === '退出登录') {
                          setCurrentIcon(item.icon);
                          confirmLogout();
                        }
                      }}
                      style={{ color: currentIcon === item.icon ? '#07c160' : '#979797' }}
                    ></li>
                  </Tooltip>
                );
              })}
            </ul>
          </div>
          <div className={styles.bottomIcons}></div>
          <div className={styles.topicons}></div>
          <div className={styles.bottomicons}></div>
        </div>
        <div className={styles.rightContainer}>{currentIcon === 'icon-message' ? <ChatList /> : <AddressBook />}</div>
      </div>
      {
        // 修改密码弹窗
        openForgetModal && <ChangePwdModal openmodal={openForgetModal} handleForget={handleForget} />
      }
      {
        // 修改信息弹窗
        openInfoModal && <ChangeInfoModal openmodal={openInfoModal} handleInfo={handleInfo} />
      }
    </>
  );
};

export default Container;
