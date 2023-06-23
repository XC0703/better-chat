import { useState } from 'react';
import { Button, Input, Modal, Tabs } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import styles from './index.module.less';

import { getFriendList, getGroupList, addFriend, addGroup } from './api';
import { IFriend, IGroup } from './api/type';

interface IChangeInfoModal {
  openmodal: boolean;
  handleAdd: () => void;
}
const AddFriendOrGroupModal = (props: IChangeInfoModal) => {
  const { openmodal, handleAdd } = props;

  const [open, setOpen] = useState(openmodal);
  const [friendList, setFriendList] = useState<IFriend[]>([]);
  const [groupList, setGroupList] = useState<IGroup[]>([]);
  const [friendName, setFriendName] = useState('');
  const [groupName, setGroupName] = useState('');
  const handleCancel = () => {
    setOpen(false);
    handleAdd();
  };
  // 查询好友关键字改变
  const handleFriendNameChange = (e: { target: { value: string } }) => {
    setFriendName(e.target.value);
  };
  // 获取模糊查询的好友列表
  const getFriendListData = async (name: string) => {
    const res = await getFriendList(name);
    if (res.code === 200) {
      setFriendList(res.data);
    } else {
      setFriendList([]);
    }
  };
  // 加好友
  const addFriend = (name: string, friend_id: number) => {
    console.log(name, friend_id);
  };
  // 查询群关键字改变
  const handleGroupNameChange = (e: { target: { value: string } }) => {
    setGroupName(e.target.value);
  };
  // 获取模糊查询的群列表
  const getGroupListData = async (name: string) => {
    const res = await getGroupList(name);
    if (res.code === 200) {
      setGroupList(res.data);
    } else {
      setGroupList([]);
    }
  };
  // 加入群聊
  const joinGroup = (name: string, group_id: number) => {
    console.log(name, group_id);
  };
  return (
    <>
      <Modal open={open} footer={null} onCancel={handleCancel}>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="加好友" key="1">
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
              <>
                {friendList.map((item) => (
                  <div className={styles.list_item} key={item.username}>
                    <img
                      src={require('@/assets/logo.png')}
                      alt=""
                      width="50"
                      height="50"
                      style={{ objectFit: 'cover' }}
                    />
                    <div className="list-item-desc">
                      <p className="list-item-username">
                        {item.username} ({item.username})
                      </p>
                      {!item.status ? (
                        <button onClick={() => addFriend(item.username, item.friend_id)}>加好友</button>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'red' }}>已经是好友</span>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </Tabs.TabPane>
          <Tabs.TabPane tab="加群" key="2">
            <div className={styles.searchBox}>
              <Input
                size="small"
                placeholder="请输入群名称"
                prefix={<SearchOutlined />}
                onChange={(value) => {
                  handleGroupNameChange(value);
                }}
              />
              <Button
                type="primary"
                onClick={() => {
                  getGroupListData(groupName);
                }}
              >
                查找
              </Button>
            </div>
            <div className="list">
              {groupList.length !== 0 && (
                <>
                  {groupList.map((item) => (
                    <div className="list-item" key={item.group_id}>
                      <img
                        src={require('@/assets/logo.png')}
                        alt=""
                        width="50"
                        height="50"
                        style={{ objectFit: 'cover' }}
                      />
                      <div className="list-item-desc">
                        <p className="list-item-username">
                          {item.name} ({item.number}人)
                        </p>
                        {!item.status ? (
                          <button onClick={() => joinGroup(item.name, item.group_id)}>加入群聊</button>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'red' }}>已加入群聊</span>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </>
  );
};

export default AddFriendOrGroupModal;
