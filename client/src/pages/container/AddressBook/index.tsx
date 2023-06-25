import { useEffect, useState } from 'react';
import { message, Tabs, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';

import styles from './index.module.less';

import { getFriendList } from './api';
import { IFriendGroup } from './api/type';

const AddressBook = () => {
  const [friendList, setFriendList] = useState<IFriendGroup[]>([]); // 好友列表

  // 难点: 如何将后端返回的数据转换成Tree组件需要的数据格式
  const treeData = friendList.map((group) => {
    return {
      title: group.name,
      key: String(Math.random()), // 根据实际情况生成唯一的 key，这里简单使用了随机数
      selectable: false,
      children: group.friend.map((friend) => ({
        title: friend.remark,
        key: String(friend.id),
        // 其他属性可以根据需要自行添加
      })),
    };
  });

  useEffect(() => {
    getFriendList().then((res) => {
      if (res.code === 200) {
        console.log(res.data);
        setFriendList(res.data);
      } else {
        message.error('获取好友数据失败', 1.5);
      }
    });
  }, []);
  return (
    <div className={styles.addressBookTabs}>
      <Tabs centered>
        <Tabs.TabPane tab="好友" key="1">
          <Tree treeData={treeData} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="群聊" key="2">
          群聊
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default AddressBook;
