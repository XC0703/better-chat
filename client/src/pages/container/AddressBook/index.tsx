import { Tabs, Tree, Tooltip, TabsProps, App, Form, Input, Select, Button, Modal } from 'antd';
import type { DirectoryTreeProps } from 'antd/es/tree';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';

import { WechatOutlined } from '@ant-design/icons';
import { StatusIconList } from '@/assets/icons';
import SearchContainer from '@/components/SearchContainer';
import { userStorage } from '@/utils/storage';

import { getFriendList, getFriendInfoById, getFriendGroup, updateFriendInfo, createFriendGroup } from './api';
import { IFriendGroup, IFriendInfo, IFriendGroupList } from './api/type';
import styles from './index.module.less';

const { DirectoryTree } = Tree;

interface IAddressBookProps {
  handleChooseFriend: (friendInfo: IFriendInfo) => void;
}

const AddressBook = forwardRef((props: IAddressBookProps, ref) => {
  const { handleChooseFriend } = props;
  const { message } = App.useApp();
  const [friendList, setFriendList] = useState<IFriendGroup[]>([]); // 好友列表
  const [infoChangeInstance] = Form.useForm<{ username: string; name: string; newRemark: string; newGroup: number }>();
  const [curFriendInfo, setCurFriendInfo] = useState<IFriendInfo>(); // 当前选中的好友信息
  const [groupList, setGroupList] = useState<IFriendGroupList[]>([]); // 好友分组列表
  const [newGroupName, setNewGroupName] = useState(''); // 新建分组

  // 控制新建分组弹窗的显隐
  const [openCreateGroupModal, setOpenCreateGroupModal] = useState(false);

  // 难点: 如何将后端返回的数据转换成Tree组件需要的数据格式
  const treeData = friendList.map((group) => {
    return {
      title: (
        <span>
          {group.name}&nbsp;&nbsp;&nbsp;&nbsp;{group.online_counts}/{group.friend.length}
        </span>
      ),
      key: String(Math.random()), // 根据实际情况生成唯一的 key，这里简单使用了随机数
      selectable: false,
      children: group.friend.map((friend) => ({
        title: (
          <div className={styles.nodeContent}>
            <img src={friend.avatar} alt="头像" />
            <span>{friend.remark}</span>
            <span className={styles.friendStatus}>
              <Tooltip
                placement="bottomLeft"
                title={friend.online_status === 'offline' ? StatusIconList[1].text : StatusIconList[0].text}
                arrow={false}
              >
                <span
                  className={`iconfont ${
                    friend.online_status === 'offline' ? StatusIconList[1].icon : StatusIconList[0].icon
                  }`}
                ></span>
              </Tooltip>
            </span>
          </div>
        ),
        key: String(friend.id),
        isLeaf: true,
      })),
    };
  });
  // 根据节点的key获取节点的信息
  const getNodeInfoById = (id: number) => {
    getFriendInfoById(id).then((res) => {
      if (res.code === 200 && res.data) {
        setCurFriendInfo(res.data);
        infoChangeInstance?.setFieldsValue({
          username: res.data.username,
          name: res.data.name,
          newRemark: res.data.remark,
          newGroup: res.data.group_id,
        });
      } else {
        message.error('获取好友信息失败', 1.5);
      }
    });
  };
  const onSelect: DirectoryTreeProps['onSelect'] = (selectedKeys, info) => {
    // 获取节点信息
    getNodeInfoById(Number(info.node.key));
  };

  // 刷新好友列表
  const refreshFriendList = () => {
    getFriendList().then((res) => {
      if (res.code === 200 && res.data) {
        setFriendList(res.data);
      } else {
        message.error('获取好友数据失败', 1.5);
      }
    });
  };

  // 获取好友分组列表
  const getFriendGroupList = () => {
    getFriendGroup().then((res) => {
      if (res.code === 200 && res.data) {
        setGroupList(res.data);
      } else {
        message.error('获取好友数据失败', 1.5);
      }
    });
  };

  // 修改好友信息
  const updateFriend = () => {
    infoChangeInstance.validateFields().then((values) => {
      const params = {
        friend_id: curFriendInfo?.friend_id as number,
        remark: values.newRemark,
        group_id: values.newGroup,
      };
      updateFriendInfo(params).then((res) => {
        if (res.code === 200) {
          message.success('修改成功', 1.5);
          refreshFriendList();
        } else {
          message.error('修改失败', 1.5);
        }
      });
    });
  };

  // 新建分组
  const createGroup = () => {
    if (!newGroupName) {
      message.error('请输入分组名称', 1.5);
      return;
    }
    const params = {
      user_id: JSON.parse(userStorage.getItem()).id,
      username: JSON.parse(userStorage.getItem()).username,
      name: newGroupName,
    };
    createFriendGroup(params).then((res) => {
      if (res.code === 200) {
        message.success('新建成功', 1.5);
        refreshFriendList();
        getFriendGroupList();
        setOpenCreateGroupModal(false);
      } else {
        message.error('新建失败', 1.5);
      }
    });
  };

  useEffect(() => {
    refreshFriendList();
    getFriendGroupList();
  }, []);

  // 鼠标右键内容
  const addContent = (
    <ul>
      <li onClick={refreshFriendList}>刷新列表</li>
      <li
        onClick={() => {
          setOpenCreateGroupModal(true);
        }}
      >
        新建分组
      </li>
    </ul>
  );
  // tabs标签切换
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <Tooltip
          placement="bottomLeft"
          title={addContent}
          arrow={false}
          overlayClassName="addContent"
          trigger={'contextMenu'}
        >
          好友
        </Tooltip>
      ),
      children: (
        <>
          <div className={styles.friendTree}>
            <DirectoryTree onSelect={onSelect} treeData={treeData} icon={null} showIcon={false} />
          </div>
        </>
      ),
    },
    {
      key: '2',
      label: `群聊`,
      children: <>todo：群聊列表</>,
    },
  ];
  // 用useMemo包裹，避免每次都重新渲染导致展开的好友列表收起
  const LeftContainer = useMemo(() => {
    return (
      <div className={styles.leftContainer}>
        <div className={styles.search}>
          <SearchContainer />
        </div>
        <div className={styles.list}>
          <div className={styles.addressBookTabs}>
            <Tabs centered defaultActiveKey="1" items={items}></Tabs>
          </div>
        </div>
      </div>
    );
  }, [friendList]);

  // 暴露方法出去
  useImperativeHandle(ref, () => ({
    refreshFriendList,
  }));
  return (
    <>
      <div className={styles.addressBook}>
        {LeftContainer}
        <div className={styles.rightContainer}>
          {curFriendInfo === undefined ? (
            <WechatOutlined />
          ) : (
            <div className={styles.infoModal}>
              <div className={styles.infoContainer}>
                <div className={styles.avatar}>
                  <img src={curFriendInfo?.avatar} alt="" />
                </div>
                <div className={styles.info}>
                  <div className={styles.username}>{curFriendInfo?.username}</div>
                  <div className={styles.signature}>
                    {curFriendInfo?.signature === '' ? '暂无个性签名' : curFriendInfo?.signature}
                  </div>
                </div>
              </div>
              <div className={styles.changeContainer}>
                <Form form={infoChangeInstance}>
                  <Form.Item label="账号" name="username">
                    <Input readOnly />
                  </Form.Item>
                  <Form.Item label="昵称" name="name">
                    <Input readOnly />
                  </Form.Item>
                  <Form.Item label="备注" name="newRemark">
                    <Input
                      placeholder="请输入好友备注"
                      onChange={(e) => infoChangeInstance.setFieldsValue({ newRemark: e.target.value })}
                    />
                  </Form.Item>
                  <Form.Item label="分组" name="newGroup">
                    <Select
                      size="small"
                      notFoundContent="暂无分组"
                      placeholder="请选择分组"
                      onChange={(value) => {
                        infoChangeInstance.setFieldsValue({ newGroup: value });
                      }}
                      options={groupList.map((item) => {
                        return {
                          label: item.name,
                          value: item.id,
                        };
                      })}
                    />
                  </Form.Item>
                </Form>
              </div>
              <div className={styles.btns}>
                <Button
                  onClick={() => {
                    updateFriend();
                  }}
                >
                  保存信息
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    handleChooseFriend(curFriendInfo);
                  }}
                >
                  发送消息
                </Button>
              </div>
            </div>
          )}
        </div>
        {openCreateGroupModal && (
          <Modal
            title="新建分组"
            open={openCreateGroupModal}
            onCancel={() => setOpenCreateGroupModal(false)}
            onOk={() => createGroup()}
            cancelText="取消"
            okText="确定"
            width="4rem"
          >
            <Form>
              <Form.Item name="groupName">
                <Input
                  placeholder="请输入分组名称"
                  onChange={(e) => {
                    setNewGroupName(e.target.value);
                  }}
                />
              </Form.Item>
            </Form>
          </Modal>
        )}
      </div>
    </>
  );
});
// 指定显示名称
AddressBook.displayName = 'AddressBook';
export default AddressBook;
