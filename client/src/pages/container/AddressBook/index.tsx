import { Tabs } from 'antd';

import styles from './index.module.less';

const AddressBook = () => {
  return (
    <>
      <Tabs centered className="addressBookTabs">
        <Tabs.TabPane tab="好友" key="1">
          好友
        </Tabs.TabPane>
        <Tabs.TabPane tab="群聊" key="2">
          群聊
        </Tabs.TabPane>
      </Tabs>
    </>
  );
};

export default AddressBook;
