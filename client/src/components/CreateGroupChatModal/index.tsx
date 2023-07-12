import { App, Button, Modal, Tooltip, Tree } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import { statusIconList } from '@/assets/icons';

import { getFriendList } from './api';
import { IFriendGroup } from './api/type';
import styles from './index.module.less';

interface IChangeInfoModal {
  openmodal: boolean;
  handleCreate: () => void;
}
const CreateGroupModal = (props: IChangeInfoModal) => {
  const { message } = App.useApp();
  const [friendList, setFriendList] = useState<IFriendGroup[]>([]); // 好友列表

  const { openmodal, handleCreate } = props;

  const [open, setOpen] = useState(openmodal);
  const [step, setStep] = useState(0);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);

  // 难点: 如何将后端返回的数据转换成Tree组件需要的数据格式
  const treeData = friendList.map((group) => {
    return {
      title: <span>{group.name}</span>,
      key: String(Math.random()), // 根据实际情况生成唯一的 key，这里简单使用了随机数
      selectable: false,
      children: group.friend.map((friend) => ({
        title: (
          <div className={styles.nodeContent}>
            <img src={friend.avatar} alt="头像" />
            <span>{friend.remark}</span>
          </div>
        ),
        key: String(friend.id),
        isLeaf: true,
        selectable: false,
      })),
    };
  });

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

  const handleCancel = () => {
    setOpen(false);
    handleCreate();
  };

  useEffect(() => {
    refreshFriendList();
  }, []);

  // 用useMemo包裹，避免每次都重新渲染导致展开的好友列表收起
  const FriendTree = useMemo(() => {
    return (
      <div className={styles.friendTree}>
        <Tree
          checkable
          defaultExpandAll={true}
          treeData={treeData}
          onCheck={(checkedKeys, e) => {
            console.log(e);
          }}
        />
      </div>
    );
  }, [friendList]);

  return (
    <>
      <Modal title="创建群聊" open={open} footer={null} onCancel={handleCancel} width="5rem">
        <div className={styles.createModal}>
          {step === 0 ? (
            <div className={styles.step0}>
              <div className={styles.selectContainer}>
                <div className={styles.friendList}>
                  <div className={styles.title}>好友列表</div>
                  {FriendTree}
                </div>
                <div className={styles.selectList}>
                  <div className={styles.title}>已选择</div>
                </div>
              </div>
              <div className={styles.btns}>
                <Button onClick={() => setStep(1)} type="primary">
                  下一步
                </Button>
              </div>
            </div>
          ) : (
            <div className={styles.step1}>
              <span>第二步</span>
              <Button onClick={() => setStep(0)} type="primary">
                上一步
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default CreateGroupModal;
