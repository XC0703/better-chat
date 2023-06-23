import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tooltip, Modal, Button, message, Input } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

import { clearSessionStorage, userStorage } from '@/common/storage';
import styles from './index.module.less';
import { iconList } from './variable';

import ChangePwdModal from '@/components/ChangePwdModal';
import ChangeInfoModal from './ChangeInfoModal';
import AddFriendOrGroupModal from './AddFriendOrGroupModal';
import CreateGroupModal from './CreateGroupModal';
import ChatList from './ChatList';
import AddressBook from './AddressBook';

import { handleLogout } from './api';
import { IUserInfo } from './api/type';

const Container = () => {
  const navigate = useNavigate();
  const { name, avatar, phone, signature } = JSON.parse(userStorage.getItem() || '{}');
  const [currentIcon, setCurrentIcon] = useState<string>('icon-message');
  const [visible, setVisible] = useState<boolean>(false);
  const [openForgetModal, setForgetModal] = useState(false);
  const [openInfoModal, setInfoModal] = useState(false);
  const [openAddModal, setAddModal] = useState(false);
  const [openCreateModal, setCreateModal] = useState(false);

  // 控制修改密码的弹窗显隐
  const handleForget = () => {
    setForgetModal(!openForgetModal);
  };
  // 控制修改信息的弹窗显隐
  const handleInfo = () => {
    setInfoModal(!openInfoModal);
  };
  // 控制添加好友/群聊的弹窗显隐
  const handleAdd = () => {
    setAddModal(!openAddModal);
  };
  // 控制创建群聊的弹窗显隐
  const handleCreate = () => {
    setCreateModal(!openCreateModal);
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
  const addContent = (
    <ul>
      <li onClick={handleAdd}>加好友/加群</li>
      <li onClick={handleCreate}>创建群聊</li>
    </ul>
  );
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
              {iconList.slice(5, 8).map((item) => {
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
        <div className={styles.middleContainer}>
          <div className={styles.middleTop}>
            <div className={styles.searchBox}>
              <Input size="small" placeholder="搜索" prefix={<SearchOutlined />} />
            </div>
            <Tooltip placement="bottomLeft" title={addContent} arrow={false} overlayClassName="addContent">
              <div className={styles.addBox}>
                <PlusOutlined />
              </div>
            </Tooltip>
          </div>
          <div className={styles.middleBottom}>{currentIcon === 'icon-message' ? <ChatList /> : <AddressBook />}</div>
        </div>
        <div className={styles.rightContainer}></div>
      </div>
      {
        // 修改密码弹窗
        openForgetModal && <ChangePwdModal openmodal={openForgetModal} handleForget={handleForget} />
      }
      {
        // 修改信息弹窗
        openInfoModal && <ChangeInfoModal openmodal={openInfoModal} handleInfo={handleInfo} />
      }
      {
        // 添加好友或群聊弹窗
        openAddModal && <AddFriendOrGroupModal openmodal={openAddModal} handleAdd={handleAdd} />
      }
      {
        // 创建群聊弹窗
        openCreateModal && <CreateGroupModal openmodal={openCreateModal} handleCreate={handleCreate} />
      }
    </>
  );
};

export default Container;
