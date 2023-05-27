import styles from './index.module.less';
import { userStorage, clearSessionStorage } from '@/common/storage';
import { iconList } from './variable';
import { Tooltip, Modal, Button } from 'antd';
import { useState } from 'react';
import ChangePwdModal from '@/components/ChangePwdModal';

const Container = () => {
  const { username, avatar, phone, signature } = JSON.parse(userStorage.getItem() || '{}');
  const [currentIcon, setCurrentIcon] = useState<string>('icon-message');
  const [visible, setVisible] = useState<boolean>(false);
  const [openForgetModal, setForgetModal] = useState(false);

  // 修改密码
  const handleForget = () => {
    setForgetModal(!openForgetModal);
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.leftContainer}>
          <div
            className={styles.avatar}
            onClick={() => {
              setVisible(!visible);
            }}
          >
            <img src={avatar} alt="" />
          </div>
          {visible && (
            <Modal
              open={visible}
              onCancel={() => setVisible(!visible)}
              closable={false}
              mask={false}
              footer={null}
              className="infoModal"
            >
              <div className={styles.infoModal}>
                <div className={styles.infoContainer}>
                  <div className={styles.avatar}>
                    <img src={avatar} alt="" />
                  </div>
                  <div className={styles.info}>
                    <div className={styles.name}>{username}</div>
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
                  <Button>修改信息</Button>
                </div>
              </div>
            </Modal>
          )}
          <div className={styles.iconList}>
            <ul className={styles.topIcons}>
              {iconList.slice(0, 5).map((item) => {
                return (
                  <Tooltip key={item.text} placement="bottomLeft" title={item.text} arrow={false}>
                    <li
                      className={`iconfont ${item.icon}`}
                      onClick={() => {
                        setCurrentIcon(item.icon);
                      }}
                      style={{ color: currentIcon === item.icon ? '#07c160' : '#979797' }}
                    ></li>
                  </Tooltip>
                );
              })}
            </ul>
            <ul className={styles.bottomIcons}>
              {iconList.slice(5, 8).map((item) => {
                return (
                  <Tooltip key={item.text} placement="bottomLeft" title={item.text} arrow={false}>
                    <li
                      className={`iconfont ${item.icon}`}
                      onClick={() => {
                        setCurrentIcon(item.text);
                      }}
                      style={{ color: currentIcon === item.text ? '#07c160' : '#979797' }}
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
        <div className={styles.middleContainer}></div>
        <div className={styles.rightContainer}></div>
      </div>
      {
        // 修改密码弹窗
        openForgetModal && <ChangePwdModal openmodal={openForgetModal} handleForget={handleForget} />
      }
    </>
  );
};

export default Container;
