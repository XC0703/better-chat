import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Tree, Upload, Form, Input } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

import { getFriendList, createGroup, inviteFriends } from './api';
import { IFriend, IFriendGroup, IGroupMember, ICreateGroupParams } from './api/type';
import styles from './index.module.less';

import useShowMessage from '@/hooks/useShowMessage';
import { IGroupChatInfo } from '@/pages/container/AddressBook/api/type';
import { HttpStatus } from '@/utils/constant';

interface IChangeInfoModal {
	type: 'create' | 'invite';
	groupChatInfo?: IGroupChatInfo;
	openmodal: boolean;
	handleModal: (open: boolean) => void;
}
const CreateGroupModal = (props: IChangeInfoModal) => {
	const showMessage = useShowMessage();
	const { type, groupChatInfo, openmodal, handleModal } = props;

	const [friendList, setFriendList] = useState<IFriendGroup[]>([]); // 好友列表
	const [open, setOpen] = useState(openmodal);
	const [checkedFriends, setCheckedFriends] = useState<[]>([]); // 勾选的好友列表数组
	const [loading, setLoading] = useState(false);
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const step0Ref = useRef<HTMLDivElement | null>(null);
	const step1Ref = useRef<HTMLDivElement | null>(null);

	// 好友列表
	const treeData = friendList.map(group => {
		return {
			title: <span>{group.name}</span>,
			key: group.name,
			selectable: false,
			children: group.friend.map(friend => ({
				title: (
					<div className={styles.nodeContent}>
						<img src={friend.avatar} alt="头像" />
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
		setOpen(false);
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

	// 上传图片 (这里的处理是将图片的 base64 编码和群聊信息一并传给后端，后端将文件存在服务器后再将文件 URL 存在数据库表中)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleUpload = (options: any) => {
		const file = options.file;
		const reader = new FileReader();
		if (file.size <= 2 * 1024 * 1024) {
			// 判断文件大小是否超过 2m
			reader.readAsDataURL(file);
			reader.onload = event => {
				// 当读取操作成功完成时调用
				const base64 = event.target!.result; // 获取文件的 Base64 编码
				setImageUrl(base64 as string);
			};
		} else {
			showMessage('error', '图片文件不能超过 2M');
		}
	};

	// upload 组件写在表单里必须这样操作传值
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const normFile = (e: any) => {
		if (Array.isArray(e)) {
			return e;
		}
		return e && e.fileList;
	};

	// 创建群聊
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleCreateGroup = async (values: any) => {
		setLoading(true);
		// 将第一步的好友数据筛选并作格式转化
		const selectedFriends: IGroupMember[] = [];
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

		try {
			// 拼接选中好友数据、群聊头像（base64 编码、文件）、群名、公告（可空）
			const createGroupParams: ICreateGroupParams = {
				name: values.groupName,
				announcement: values.announcement ? values.announcement : null,
				members: selectedFriends,
				avatar: imageUrl as string
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
		if (checkedFriends.length !== 0) {
			setLoading(true);
			// 将第一步的好友数据筛选并作格式转化
			const selectedFriends: IGroupMember[] = [];
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

			try {
				const inviteFriendsParams = {
					groupId: groupChatInfo?.id as number,
					invitationList: selectedFriends
				};
				const res = await inviteFriends(inviteFriendsParams);
				if (res.code === HttpStatus.SUCCESS) {
					showMessage('success', '邀请成功');
					setLoading(false);
					handleCancel();
				} else if (res.code === 4009) {
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

	// 上传按钮
	const uploadButton = (
		<div>
			{loading ? <LoadingOutlined /> : <PlusOutlined />}
			<div style={{ marginTop: 8 }}>Upload</div>
		</div>
	);

	return (
		<>
			<Modal
				title={type === 'invite' ? '邀请新的好友进群聊' : '创建群聊'}
				open={open}
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
										} catch {
											/* empty */
										}
									})}
								</div>
							</div>
						</div>
						<div className={styles.btns}>
							{type === 'invite' ? (
								<Button onClick={handlInvite}> 邀请 </Button>
							) : (
								<Button onClick={() => handleSwitch(1)}> 下一步 </Button>
							)}
						</div>
					</div>
					<div className={`${styles.step} ${styles.step1}`} ref={step1Ref}>
						<div className={styles.selectContainer}>
							<Form onFinish={handleCreateGroup}>
								<Form.Item
									label="头像"
									rules={[{ required: true, message: '请上传头像' }]}
									name="avatar"
									valuePropName="fileList"
									getValueFromEvent={normFile}
								>
									<Upload
										name="avatar"
										listType="picture-card"
										showUploadList={false}
										customRequest={handleUpload}
										accept="image/*"
										maxCount={1}
									>
										{imageUrl ? (
											<img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
										) : (
											uploadButton
										)}
									</Upload>
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
