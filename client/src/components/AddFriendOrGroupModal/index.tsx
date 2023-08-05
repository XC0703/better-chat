import { SearchOutlined } from '@ant-design/icons';
import { App, Button, Input, Modal, Tabs, TabsProps } from 'antd';
import { useState } from 'react';

import { getFriendList, addFriend } from './api';
import { IFriend } from './api/type';
import styles from './index.module.less';

import { userStorage } from '@/utils/storage';

interface IChangeInfoModal {
  openmodal: boolean;
  handleModal: (open: boolean) => void;
}
const AddFriendOrGroupModal = (props: IChangeInfoModal) => {
  const { openmodal, handleModal } = props;

  const { message } = App.useApp();
  const [friendList, setFriendList] = useState<IFriend[]>([]);
  const [friendName, setFriendName] = useState('');
  const [loading, setLoading] = useState(false);
  // 查询好友关键字改变
  const handleFriendNameChange = (e: { target: { value: string } }) => {
    setFriendName(e.target.value);
    if (e.target.value === '') {
      setFriendList([]);
    }
  };
  // 获取模糊查询的好友列表
  const getFriendListData = async (username: string) => {
    const params = {
      sender: JSON.parse(userStorage.getItem() || '{}'),
      username: username,
    };
    const res = await getFriendList(params);
    if (res.code === 200 && res.data) {
      setFriendList(res.data);
    } else {
      setFriendList([]);
    }
  };
  // 加好友
  const handleAddFriend = async (id: number, username: string, avatar: string) => {
    const params = {
      sender: JSON.parse(userStorage.getItem() || '{}'),
      id: id,
      username: username,
      avatar: avatar,
    };
    setLoading(true);
    const res = await addFriend(params);
    if (res.code === 200) {
      message.success('添加成功', 1.5);
      setLoading(false);
      handleModal(false);
    } else {
      message.error('添加失败,请重试', 1.5);
      setLoading(false);
    }
  };
  // tabs标签切换
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `加好友`,
      children: (
        <>
          <div className={styles.searchBox}>
            <Input
              size="small"
              placeholder="请输入对方的用户名"
              prefix={<SearchOutlined />}
              onChange={(value) => {
                handleFriendNameChange(value);
              }}
            />
            <Button
              type="primary"
              onClick={() => {
                getFriendListData(friendName);
              }}
            >
              查找
            </Button>
          </div>
          {friendList.length !== 0 && (
            <div className={styles.searchResult}>
              {friendList.map((item) => (
                <div className={styles.list_item} key={item.username}>
                  <img src={item.avatar} alt="" />
                  <div className={styles.list_item_desc}>
                    <span className={styles.list_item_username}>
                      {item.username} ({item.username})
                    </span>
                    {!item.status ? (
                      <Button
                        onClick={() => handleAddFriend(item.id, item.username, item.avatar)}
                        type="primary"
                        size="small"
                        loading={loading}
                      >
                        加好友
                      </Button>
                    ) : (
                      <span>已经是好友</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ),
    },
    {
      key: '2',
      label: `加群`,
      children: (
        <>
          <div className={styles.searchBox}>
            <Input size="small" placeholder="请输入群名称" prefix={<SearchOutlined />} />
            <Button type="primary">查找</Button>
          </div>
          <div className="list">todo：查找并加入群聊</div>
        </>
      ),
    },
  ];
  return (
    <>
      <Modal
        open={openmodal}
        footer={null}
        onCancel={() => {
          handleModal(false);
        }}
      >
        <Tabs defaultActiveKey="1" items={items}></Tabs>
      </Modal>
    </>
  );
};

export default AddFriendOrGroupModal;
