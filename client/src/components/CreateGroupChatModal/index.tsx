import { Button, Modal, Tree, Form, Input } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

import { getFriendList, createGroup, inviteFriend } from './api';
import styles from './index.module.less';
import {
	ICreateGroupModal,
	ICreateGroupForm,
	IFriendItem,
	IFriendGroupItem,
	IGroupMemberItem,
	ICreateGroupParams
} from './type';

import ImageLoad from '@/components/ImageLoad';
import { ImageUpload } from '@/components/ImageUpload';
import useShowMessage from '@/hooks/useShowMessage';
import { HttpStatus } from '@/utils/constant';

const CreateGroupModal = (props: ICreateGroupModal) => {
	const showMessage = useShowMessage();
	const { openmodal, handleModal, type, groupChatInfo } = props;

	const [friendList, setFriendList] = useState<IFriendGroupItem[]>([]); // 好友列表
	const [checkedFriends, setCheckedFriends] = useState<[]>([]); // 勾选的好友列表数组
	const [loading, setLoading] = useState(false);
	const [createGroupFormInstance] = Form.useForm<ICreateGroupForm>();
	const step0Ref = useRef<HTMLDivElement | null>(null);
	const step1Ref = useRef<HTMLDivElement | null>(null);

	// 好友列表
	const treeData = friendList.map(group => {
		return {
			title: <span>{group.name}</span>,
			key: group.name,
			selectable: false,
			disabled: group.friend.length ? false : true,
			children: group.friend.map(friend => ({
				title: (
					<div className={styles.nodeContent}>
						<ImageLoad src={friend.avatar} />
						<span>{friend.remark}</span>
					</div>
				),
				key: JSON.stringify(friend),
				isLeaf: true,
				selectable: false
			}))
		};
	});

	// 刷新好友列表
	const refreshFriendList = async () => {
		try {
			const res = await getFriendList();
			if (res.code === HttpStatus.SUCCESS && res.data) {
				setFriendList(res.data);
			} else {
				showMessage('error', '好友数据获取失败');
			}
		} catch {
			showMessage('error', '好友数据获取失败');
		}
	};

	// 关闭弹窗
	const handleCancel = () => {
		handleModal(false);
	};

	// 控制第一步和第二步的互相切换
	const handleSwitch = (step: number) => {
		if (step === 0 && step0Ref.current && step1Ref.current) {
			step1Ref.current.style.opacity = '0';
			step0Ref.current.style.opacity = '1';
			setTimeout(() => {
				if (step1Ref.current && step0Ref.current) {
					step1Ref.current.style.display = 'none';
					step0Ref.current.style.display = 'block';
				}
			}, 500);
		} else if (step === 1 && step0Ref.current && step1Ref.current) {
			if (checkedFriends.length !== 0) {
				step0Ref.current.style.opacity = '0';
				step1Ref.current.style.opacity = '1';
				setTimeout(() => {
					if (step0Ref.current && step1Ref.current) {
						step0Ref.current.style.display = 'none';
						step1Ref.current.style.display = 'block';
					}
				}, 500);
			} else {
				showMessage('error', '请至少选择一位好友加入群聊');
			}
		}
	};

	// 创建群聊
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleCreateGroup = async (values: any) => {
		setLoading(true);
		// 将第一步的好友数据筛选并作格式转化
		const selectedFriends: IGroupMemberItem[] = [];
		checkedFriends.map(item => {
			try {
				const parsedItem = JSON.parse(item);
				if (parsedItem.username) {
					selectedFriends.push({
						user_id: parsedItem.user_id,
						username: parsedItem.username,
						avatar: parsedItem.avatar
					});
				}
			} catch {
				/* empty */
			}
		});
		if (selectedFriends.length === 0) {
			showMessage('error', '请至少选择一位好友加入群聊');
			setLoading(false);
			return;
		}

		try {
			// 拼接选中好友数据、群聊头像、群名、公告（可空）
			const createGroupParams: ICreateGroupParams = {
				name: values.groupName,
				announcement: values.announcement ? values.announcement : null,
				members: selectedFriends,
				avatar: values.groupAvatar
			};
			const res = await createGroup(createGroupParams);
			if (res.code === HttpStatus.SUCCESS) {
				showMessage('success', '创建群聊成功');
				setLoading(false);
				handleCancel();
			} else {
				showMessage('error', '创建群聊失败，请重试');
				setLoading(false);
			}
		} catch {
			showMessage('error', '创建群聊失败，请重试');
			setLoading(false);
		}
	};

	// 群聊弹窗类型是邀请新的好友时
	const handlInvite = async () => {
		setLoading(true);
		// 将第一步的好友数据筛选并作格式转化
		const selectedFriends: IGroupMemberItem[] = [];
		checkedFriends.map(item => {
			try {
				const parsedItem = JSON.parse(item);
				if (parsedItem.username) {
					selectedFriends.push({
						user_id: parsedItem.user_id,
						username: parsedItem.username,
						avatar: parsedItem.avatar
					});
				}
			} catch {
				/* empty */
			}
		});
		if (selectedFriends.length !== 0) {
			try {
				const inviteFriendParams = {
					groupId: groupChatInfo!.id,
					invitationList: selectedFriends
				};
				const res = await inviteFriend(inviteFriendParams);
				if (res.code === HttpStatus.SUCCESS) {
					showMessage('success', '邀请成功');
					setLoading(false);
					handleCancel();
				} else if (res.code === HttpStatus.ALL_EXIT_ERR) {
					showMessage('error', '你邀请的好友都已经加入群聊');
					setLoading(false);
				} else {
					showMessage('error', res.message);
					setLoading(false);
				}
			} catch {
				showMessage('error', '邀请失败，请重试');
				setLoading(false);
			}
		} else {
			showMessage('error', '请至少邀请一位好友');
			setLoading(false);
		}
	};

	useEffect(() => {
		refreshFriendList();
	}, []);

	// 用 useMemo 包裹，避免每次都重新渲染导致展开的好友列表收起
	const FriendTree = useMemo(() => {
		return (
			<div className={styles.list}>
				<Tree
					checkable
					defaultExpandAll={true}
					treeData={treeData}
					onCheck={checkedKeys => {
						setCheckedFriends(checkedKeys as []);
					}}
				/>
			</div>
		);
	}, [friendList]);

	return (
		<>
			<Modal
				title={type === 'invite' ? '邀请新的好友进群聊' : '创建群聊'}
				open={openmodal}
				footer={null}
				onCancel={handleCancel}
				width="5rem"
			>
				<div className={styles.createModal}>
					<div className={`${styles.step} ${styles.step0}`} ref={step0Ref}>
						<div className={styles.selectContainer}>
							<div className={styles.friendList}>
								<div className={styles.title}> 好友列表 </div>
								{FriendTree}
							</div>
							<div className={styles.selectList}>
								<div className={styles.title}> 已选择 </div>
								<div className={styles.list}>
									{checkedFriends.map(item => {
										let selectedFriend = {} as IFriendItem;
										try {
											const parsedItem = JSON.parse(item);
											if (parsedItem.username) {
												selectedFriend = parsedItem;
												return (
													<div key={selectedFriend.username} className={styles.friendInfo}>
														<div className={styles.avatar}>
															<ImageLoad src={selectedFriend.avatar} />
														</div>
														<span className={styles.username}>{selectedFriend.username}</span>
													</div>
												);
											}
										} catch {
											/* empty */
										}
									})}
								</div>
							</div>
						</div>
						<div className={styles.btns}>
							{type === 'invite' ? (
								<Button onClick={handlInvite} loading={loading}>
									邀请
								</Button>
							) : (
								<Button onClick={() => handleSwitch(1)}> 下一步 </Button>
							)}
						</div>
					</div>
					<div className={`${styles.step} ${styles.step1}`} ref={step1Ref}>
						<div className={styles.selectContainer}>
							<Form
								form={createGroupFormInstance}
								name="createGroupChatForm"
								onFinish={handleCreateGroup}
							>
								<Form.Item
									label="头像"
									rules={[{ required: true, message: '请上传头像' }]}
									name="groupAvatar"
								>
									<ImageUpload
										onUploadSuccess={filePath => {
											createGroupFormInstance.setFieldsValue({ groupAvatar: filePath });
										}}
									/>
								</Form.Item>
								<Form.Item
									label="群名"
									rules={[{ required: true, message: '请输入群名' }]}
									name="groupName"
								>
									<Input maxLength={10} showCount={true} placeholder="请输入群名" />
								</Form.Item>
								<Form.Item label="公告" name="announcement">
									<Input maxLength={30} showCount={true} />
								</Form.Item>
								<Form.Item>
									<div className={styles.btns}>
										<Button onClick={() => handleSwitch(0)}> 上一步 </Button>
										<Button type="primary" loading={loading} htmlType="submit">
											确定
										</Button>
									</div>
								</Form.Item>
							</Form>
						</div>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default CreateGroupModal;
