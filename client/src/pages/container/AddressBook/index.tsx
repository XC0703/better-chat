import { Tabs, Tree, Tooltip, TabsProps, App, Form, Input, Select, Button } from 'antd';
import type { DirectoryTreeProps } from 'antd/es/tree';
import { useEffect, useMemo, useState } from 'react';

import { WechatOutlined } from '@ant-design/icons';
import { statusIconList } from '@/assets/icons';
import SearchContainer from '@/components/SearchContainer';

import { getFriendList, getFriendInfoById } from './api';
import { IFriendGroup, IFriendInfo } from './api/type';
import styles from './index.module.less';

const { DirectoryTree } = Tree;
const AddressBook = () => {
  const { message } = App.useApp();
  const [friendList, setFriendList] = useState<IFriendGroup[]>([]); // 好友列表
  const [infoChangeInstance] = Form.useForm<{ newRemark: string; newGroup: string }>();
  const [curFriendInfo, setCurFriendInfo] = useState<IFriendInfo>(); // 当前选中的好友信息

  // 难点: 如何将后端返回的数据转换成Tree组件需要的数据格式
  const treeData = friendList.map((group) => {
    return {
      title: group.name,
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
                title={friend.online_status === 'offline' ? statusIconList[1].text : statusIconList[0].text}
                arrow={false}
              >
                <span
                  className={`iconfont ${
                    friend.online_status === 'offline' ? statusIconList[1].icon : statusIconList[0].icon
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
          newRemark: res.data.remark,
          newGroup: res.data.group_name,
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
  useEffect(() => {
    refreshFriendList();
  }, []);

  // tabs标签切换
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `好友`,
      children: (
        <>
          <div className={styles.friendTree}>
            <DirectoryTree defaultExpandAll onSelect={onSelect} treeData={treeData} icon={null} showIcon={false} />
          </div>
        </>
      ),
    },
    {
      key: '2',
      label: `群聊`,
      children: <>群聊</>,
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
                    <Input />
                  </Form.Item>
                  <Form.Item label="昵称" name="username">
                    <Input />
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
                      onChange={(e) => infoChangeInstance.setFieldsValue({ newGroup: e.target.value })}
                    />
                  </Form.Item>
                </Form>
              </div>
              <div className={styles.btns}>
                <Button
                  onClick={() => {
                    console.log('发送消息');
                  }}
                >
                  发送消息
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    console.log('保存信息');
                  }}
                >
                  保存信息
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddressBook;
