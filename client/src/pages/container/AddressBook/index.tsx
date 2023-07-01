import { message, Tabs, Tree, Tooltip } from 'antd';
import type { DirectoryTreeProps } from 'antd/es/tree';
import { useEffect, useState } from 'react';

import { statusIconList } from '@/assets/icons';
import SearchContainer from '@/components/SearchContainer';

import { getFriendList } from './api';
import { IFriendGroup } from './api/type';
import styles from './index.module.less';

const { TabPane } = Tabs;
const { DirectoryTree } = Tree;
const AddressBook = () => {
  const [friendList, setFriendList] = useState<IFriendGroup[]>([]); // 好友列表

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
        // 其他属性可以根据需要自行添加
      })),
    };
  });
  const onSelect: DirectoryTreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  // 刷新好友列表
  const refreshFriendList = () => {
    getFriendList().then((res) => {
      if (res.code === 200) {
        console.log(res.data);
        setFriendList(res.data);
      } else {
        message.error('获取好友数据失败', 1.5);
      }
    });
  };
  useEffect(() => {
    refreshFriendList();
  }, []);

  return (
    <>
      <div className={styles.addressBook}>
        <div className={styles.leftContainer}>
          <div className={styles.search}>
            <SearchContainer />
          </div>
          <div className={styles.list}>
            <div className={styles.addressBookTabs}>
              <Tabs centered>
                <TabPane tab="好友" key="1">
                  <div className={styles.friendTree}>
                    <DirectoryTree
                      defaultExpandAll
                      onSelect={onSelect}
                      treeData={treeData}
                      icon={null}
                      showIcon={false}
                    />
                  </div>
                </TabPane>
                <TabPane tab="群聊" key="2">
                  群聊
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
        <div className={styles.rightContainer}>好友信息</div>
      </div>
    </>
  );
};

export default AddressBook;
