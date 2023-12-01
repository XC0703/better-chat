import { App, Button, Modal, Tree } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

import { getFriendList } from './api';
import { IFriend, IFriendGroup } from './api/type';
import styles from './index.module.less';

interface IChangeInfoModal {
  openmodal: boolean;
  handleModal: (open: boolean) => void;
}
const CreateGroupModal = (props: IChangeInfoModal) => {
  const { message } = App.useApp();
  const { openmodal, handleModal } = props;

  const [friendList, setFriendList] = useState<IFriendGroup[]>([]); // 好友列表
  const [open, setOpen] = useState(openmodal);
  const [checkedFriends, setCheckedFriends] = useState<[]>([]); // 勾选的好友列表数组
  const [loading, setLoading] = useState(false);
  const step0Ref = useRef<HTMLDivElement | null>(null);
  const step1Ref = useRef<HTMLDivElement | null>(null);

  // 好友列表
  const treeData = friendList.map((group) => {
    return {
      title: <span>{group.name}</span>,
      key: group.name,
      selectable: false,
      children: group.friend.map((friend) => ({
        title: (
          <div className={styles.nodeContent}>
            <img src={friend.avatar} alt="头像" />
            <span>{friend.remark}</span>
          </div>
        ),
        key: JSON.stringify(friend),
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

  // 关闭弹窗
  const handleCancel = () => {
    setOpen(false);
    handleModal(false);
  };

  // 控制第一步和第二步的互相切换
  const handleSwitch = (step: number) => {
    if (step === 0 && step0Ref.current && step1Ref.current) {
      step1Ref.current.style.display = 'none';
      step0Ref.current.style.display = 'block';
    } else if (step === 1 && step0Ref.current && step1Ref.current) {
      step0Ref.current.style.display = 'none';
      step1Ref.current.style.display = 'block';
    }
  };

  // 创建群聊
  const handleCreateGroup = () => {
    console.log(checkedFriends);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('创建群聊成功！', 1.5);
      handleCancel();
    }, 1000);
  };

  useEffect(() => {
    refreshFriendList();
  }, []);

  // 用useMemo包裹，避免每次都重新渲染导致展开的好友列表收起
  const FriendTree = useMemo(() => {
    return (
      <div className={styles.list}>
        <Tree
          checkable
          defaultExpandAll={true}
          treeData={treeData}
          onCheck={(checkedKeys) => {
            setCheckedFriends(checkedKeys as []);
          }}
        />
      </div>
    );
  }, [friendList]);

  return (
    <>
      <Modal title="创建群聊" open={open} footer={null} onCancel={handleCancel} width="5rem">
        <div className={styles.createModal}>
          <div className={`${styles.step} ${styles.step0}`} ref={step0Ref}>
            <div className={styles.selectContainer}>
              <div className={styles.friendList}>
                <div className={styles.title}>好友列表</div>
                {FriendTree}
              </div>
              <div className={styles.selectList}>
                <div className={styles.title}>已选择</div>
                <div className={styles.list}>
                  {checkedFriends.map((item) => {
                    let selectedFriend = {} as IFriend;
                    try {
                      const parsedItem = JSON.parse(item);
                      if (parsedItem.username) {
                        selectedFriend = parsedItem;
                        return (
                          <div key={selectedFriend.username} className={styles.friendInfo}>
                            <div className={styles.avatar}>
                              <img src={selectedFriend.avatar} alt="" />
                            </div>
                            <span className={styles.username}>{selectedFriend.username}</span>
                          </div>
                        );
                      }
                    } catch (error) {
                      /* empty */
                    }
                  })}
                </div>
              </div>
            </div>
            <div className={styles.btns}>
              <Button onClick={() => handleSwitch(1)}>下一步</Button>
            </div>
          </div>
          <div className={`${styles.step} ${styles.step1}`} ref={step1Ref}>
            <div className={styles.selectContainer}></div>
            <div className={styles.btns}>
              <Button onClick={() => handleSwitch(0)}>上一步</Button>
              <Button onClick={handleCreateGroup} type="primary" loading={loading}>
                确定
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateGroupModal;
