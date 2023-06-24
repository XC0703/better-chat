import { message, Tabs } from 'antd';
import { useEffect, useState } from 'react';

import styles from './index.module.less';

import { getFriendList } from './api';
import { IFriendGroup } from './api/type';

const AddressBook = () => {
  const [friendList, setFriendList] = useState<IFriendGroup[]>([]); // 好友列表

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
          好友
        </Tabs.TabPane>
        <Tabs.TabPane tab="群聊" key="2">
          群聊
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default AddressBook;
