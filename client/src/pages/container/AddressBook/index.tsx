import { WechatOutlined } from '@ant-design/icons';
import { Tabs, Tree, Tooltip, TabsProps, Form, Input, Select, Button, Modal, Empty } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';

import {
	getFriendList,
	getFriendInfoById,
	getFriendGroup,
	updateFriendInfo,
	createFriendGroup,
	getGroupChatList,
	getGroupChatInfo
} from './api';
import styles from './index.module.less';
import {
	IFriendInfo,
	IFriendGroupListItem,
	IGroupChatItem,
	IAddressBookProps,
	TabType,
	IFriendInfoForm
} from './type';
import type { DirectoryTreeProps } from 'antd/es/tree';

import { StatusIconList } from '@/assets/icons';
import CreateGroupChatModal from '@/components/CreateGroupChatModal';
import { IFriendGroupItem, IGroupChatInfo } from '@/components/CreateGroupChatModal/type';
import ImageLoad from '@/components/ImageLoad';
import SearchContainer from '@/components/SearchContainer';
import useShowMessage from '@/hooks/useShowMessage';
import { HttpStatus } from '@/utils/constant';
import { userStorage } from '@/utils/storage';

const { DirectoryTree } = Tree;

const AddressBook = forwardRef((props: IAddressBookProps, ref) => {
	const { handleChooseChat } = props;
	const showMessage = useShowMessage();

	const [curTab, setCurTab] = useState<string>(TabType.FRIEND); // 当前 tab 是好友还是群聊
	// 好友相关状态
	const [friendList, setFriendList] = useState<IFriendGroupItem[]>([]); // 好友列表
	const [curFriendInfo, setCurFriendInfo] = useState<IFriendInfo>(); // 当前选中的好友信息
	const [groupList, setGroupList] = useState<IFriendGroupListItem[]>([]); // 好友分组列表
	const [friendInfoFormInstance] = Form.useForm<IFriendInfoForm>(); // 好友信息表单实例
	const [openCreateGroupModal, setOpenCreateGroupModal] = useState(false); // 是否打开新建分组的 modal
	const [newGroupName, setNewGroupName] = useState(''); // 新建分组的名称
	// 群聊相关状态
	const [groupChatList, setGroupChatList] = useState<IGroupChatItem[]>([]); // 群聊列表
	const [curGroupChatInfo, setCurGroupChatInfo] = useState<IGroupChatInfo>(); // 当前选中的群聊信息
	const [openCreateModal, setCreateModal] = useState(false); // 是否打开创建群聊的 modal

	// 难点: 如何将后端返回的数据转换成 Tree 组件需要的数据格式
	const treeData = friendList.map(group => {
		return {
			title: (
				<span>
					{group.name}&nbsp;&nbsp;&nbsp;&nbsp;{group.online_counts}/{group.friend.length}
				</span>
			),
			key: String(Math.random()), // 根据实际情况生成唯一的 key，这里简单使用了随机数
			selectable: false,
			children: group.friend.map(friend => ({
				title: (
					<div className={styles.nodeContent}>
						<ImageLoad src={friend.avatar} />
						<span>{friend.remark}</span>
						<span className={styles.friendStatus}>
							<Tooltip
								placement="bottomLeft"
								title={
									friend.online_status === 'offline'
										? StatusIconList[1].text
										: StatusIconList[0].text
								}
								arrow={false}
							>
								<span
									className={`iconfont ${
										friend.online_status === 'offline'
											? StatusIconList[1].icon
											: StatusIconList[0].icon
									}`}
								></span>
							</Tooltip>
						</span>
					</div>
				),
				key: String(friend.id),
				isLeaf: true
			}))
		};
	});
	// 根据节点的 key 获取节点的信息
	const getNodeInfoById = async (id: number) => {
		try {
			const res = await getFriendInfoById(id);
			if (res.code === HttpStatus.SUCCESS && res.data) {
				setCurFriendInfo(res.data);
				friendInfoFormInstance?.setFieldsValue({
					username: res.data.username,
					name: res.data.name,
					remark: res.data.remark,
					group: res.data.group_id
				});
			} else {
				showMessage('error', '获取好友信息失败');
			}
		} catch {
			showMessage('error', '获取好友信息失败');
		}
	};
	const onSelect: DirectoryTreeProps['onSelect'] = (selectedKeys, info) => {
		// 获取节点信息
		getNodeInfoById(Number(info.node.key));
	};

	// 刷新好友列表
	const refreshFriendList = async () => {
		try {
			const res = await getFriendList();
			if (res.code === HttpStatus.SUCCESS && res.data) {
				setFriendList(res.data);
			} else {
				showMessage('error', '获取好友列表失败');
			}
		} catch {
			showMessage('error', '获取好友列表失败');
		}
	};

	// 获取好友分组列表
	const getFriendGroupList = async () => {
		try {
			const res = await getFriendGroup();
			if (res.code === HttpStatus.SUCCESS && res.data) {
				setGroupList(res.data);
			} else {
				showMessage('error', '获取好友分组列表失败');
			}
		} catch {
			showMessage('error', '获取好友分组列表失败');
		}
	};

	// 修改好友信息
	const updateFriend = () => {
		friendInfoFormInstance.validateFields().then(async values => {
			try {
				const params = {
					friend_id: curFriendInfo?.friend_id as number,
					remark: values.remark,
					group_id: values.group
				};
				const res = await updateFriendInfo(params);
				if (res.code === HttpStatus.SUCCESS) {
					showMessage('success', '修改成功');
					refreshFriendList();
				} else {
					showMessage('error', '修改失败，请重试');
				}
			} catch {
				showMessage('error', '修改失败，请重试');
			}
		});
	};

	// 新建分组
	const createGroup = async () => {
		if (!newGroupName) {
			showMessage('error', '请输入分组名称');
			return;
		}

		try {
			const params = {
				user_id: JSON.parse(userStorage.getItem()).id,
				username: JSON.parse(userStorage.getItem()).username,
				name: newGroupName
			};
			const res = await createFriendGroup(params);
			if (res.code === HttpStatus.SUCCESS) {
				showMessage('success', '新建成功');
				refreshFriendList();
				getFriendGroupList();
				setOpenCreateGroupModal(false);
			} else {
				showMessage('error', '新建失败，请重试');
			}
		} catch {
			showMessage('error', '新建失败，请重试');
		}
	};

	// 获取群聊列表
	const refreshGroupChatList = async () => {
		try {
			const res = await getGroupChatList();
			if (res.code === HttpStatus.SUCCESS) {
				setGroupChatList(res.data);
			} else {
				showMessage('error', '获取群聊列表失败');
			}
		} catch {
			showMessage('error', '获取群聊列表失败');
		}
	};

	// 选择某一群聊
	const handleSelectGroupChat = async (item: IGroupChatItem) => {
		try {
			const res = await getGroupChatInfo(item.id);
			if (res.code === HttpStatus.SUCCESS) {
				setCurGroupChatInfo(res.data);
			} else {
				showMessage('error', '获取群聊信息失败');
			}
		} catch {
			showMessage('error', '获取群聊信息失败');
		}
	};

	// 群聊具体信息 tabs 标签切换
	const infoItems: TabsProps['items'] = [
		{
			key: TabType.FRIEND,
			label: '首页',
			children: (
				<div className={styles.homePage}>
					<span>
						<b> 群主：</b>
						{curGroupChatInfo?.creator_username}
					</span>
					<span>
						<b> 群创建时间：</b> 本群创建于
						{curGroupChatInfo?.created_at.split('.')[0].replace('T', ' ')}
					</span>
					<span>
						<b> 群人数：</b>
						{curGroupChatInfo?.members.length}
					</span>
				</div>
			)
		},
		{
			key: TabType.GROUP_CHAT,
			label: '成员',
			children: (
				<div className={styles.memberTable}>
					<div className={styles.tableTitle}>
						<li> 用户名 </li>
						<li> 群昵称 </li>
						<li> 加入时间 </li>
						<li> 最后发言时间 </li>
					</div>
					<div className={styles.tableContent}>
						{curGroupChatInfo?.members.map(item => {
							return (
								<div className={styles.tableItem} key={item.user_id}>
									<li>{item.name}</li>
									<li>{item.nickname}</li>
									<li>{item.created_at.split('.')[0].replace('T', ' ')}</li>
									<li>{item.lastMessageTime?.split('.')[0].replace('T', ' ')}</li>
								</div>
							);
						})}
					</div>
				</div>
			)
		}
	];

	// 邀请好友（控制创建群聊的弹窗显隐）
	const handleCreateModal = (visible: boolean) => {
		setCreateModal(visible);
	};

	useEffect(() => {
		refreshFriendList();
		getFriendGroupList();
		refreshGroupChatList();
	}, []);

	// 鼠标右键内容
	const addContent = (key: number) => {
		if (key === 1) {
			return (
				<ul>
					<li onClick={refreshFriendList}> 刷新列表 </li>
					<li
						onClick={() => {
							setOpenCreateGroupModal(true);
						}}
					>
						新建分组
					</li>
				</ul>
			);
		} else {
			return (
				<ul>
					<li onClick={refreshGroupChatList}> 刷新列表 </li>
				</ul>
			);
		}
	};

	// tabs 标签切换
	const titleLabel = (key: number) => {
		const title = key === 1 ? '好友' : '群聊';
		return (
			<Tooltip
				placement="bottomLeft"
				title={addContent(key)}
				arrow={false}
				overlayClassName="addContent"
				trigger={'contextMenu'}
			>
				{title}
			</Tooltip>
		);
	};
	const items: TabsProps['items'] = [
		{
			key: TabType.FRIEND,
			label: titleLabel(1),
			children:
				treeData.length === 0 ? (
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
				) : (
					<div className={styles.friendTree}>
						<DirectoryTree onSelect={onSelect} treeData={treeData} icon={null} showIcon={false} />
					</div>
				)
		},
		{
			key: TabType.GROUP_CHAT,
			label: titleLabel(2),
			children:
				groupChatList.length === 0 ? (
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
				) : (
					<div className={styles.groupChatList}>
						{groupChatList.map(item => {
							return (
								<div
									className={`${styles.groupChat} ${
										curGroupChatInfo?.id === item.id ? styles.curGroupChatInfo : ''
									}`}
									key={item.id}
									onClick={() => handleSelectGroupChat(item)}
								>
									<ImageLoad src={item.avatar} />
									<span>{item.name}</span>
								</div>
							);
						})}
					</div>
				)
		}
	];
	const onChange = (key: string) => {
		setCurTab(key);
	};

	// 用 useMemo 包裹，避免每次都重新渲染导致展开的好友列表收起
	const LeftContainer = useMemo(() => {
		return (
			<div className={styles.leftContainer}>
				<div className={styles.search}>
					<SearchContainer />
				</div>
				<div className={styles.list}>
					<div className={styles.addressBookTabs}>
						<Tabs centered defaultActiveKey="1" items={items} onChange={onChange}></Tabs>
					</div>
				</div>
			</div>
		);
	}, [friendList, groupChatList, curGroupChatInfo]);

	// 暴露方法出去
	useImperativeHandle(ref, () => ({
		refreshFriendList,
		refreshGroupChatList
	}));
	return (
		<>
			<div className={styles.addressBook}>
				{LeftContainer}
				<div className={styles.rightContainer}>
					{curTab === TabType.FRIEND && curFriendInfo !== undefined && (
						<div className={styles.infoModal}>
							<div className={styles.infoContainerHead}>
								<div className={styles.avatar}>
									<ImageLoad src={curFriendInfo?.avatar} />
								</div>
								<div className={styles.info}>
									<div className={styles.username}>{curFriendInfo?.username}</div>
									<div className={`icon iconfont icon-gexingqianming ${styles.signature}`}>
										{curFriendInfo.signature ? curFriendInfo.signature : '暂无个性签名'}
									</div>
								</div>
							</div>
							<div className={styles.changeContainer}>
								<Form name="friendInfoForm" form={friendInfoFormInstance}>
									<Form.Item label="账号" name="username">
										<Input readOnly />
									</Form.Item>
									<Form.Item label="昵称" name="name">
										<Input readOnly />
									</Form.Item>
									<Form.Item label="备注" name="remark">
										<Input placeholder="请输入好友备注" />
									</Form.Item>
									<Form.Item label="分组" name="group">
										<Select
											size="small"
											notFoundContent="暂无分组"
											placeholder="请选择分组"
											options={groupList.map(item => {
												return {
													label: item.name,
													value: item.id
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
										handleChooseChat(curFriendInfo);
									}}
								>
									发送消息
								</Button>
							</div>
						</div>
					)}
					{curTab === TabType.GROUP_CHAT && curGroupChatInfo !== undefined && (
						<div className={styles.infoModal}>
							<div className={styles.infoContainerHead}>
								<div className={styles.avatar}>
									<ImageLoad src={curGroupChatInfo?.avatar} />
								</div>
								<div className={styles.info}>
									<div className={styles.username}>{curGroupChatInfo?.name}</div>
									<div className={`icon iconfont icon-qungonggao ${styles.signature}`}>
										{curGroupChatInfo.announcement ? curGroupChatInfo.announcement : '暂无公告'}
									</div>
								</div>
							</div>
							<div className={styles.infoContainerBody}>
								<Tabs centered defaultActiveKey="1" items={infoItems}></Tabs>
							</div>
							<div className={styles.btns}>
								<Button onClick={() => handleCreateModal(true)}> 邀请好友 </Button>
								<Button
									type="primary"
									onClick={() => {
										handleChooseChat(curGroupChatInfo);
									}}
								>
									发送消息
								</Button>
							</div>
						</div>
					)}
					{curTab === TabType.FRIEND && curFriendInfo === undefined && <WechatOutlined />}
					{curTab === TabType.GROUP_CHAT && curGroupChatInfo === undefined && <WechatOutlined />}
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
						<Form name="createGroupForm">
							<Form.Item name="groupName">
								<Input
									placeholder="请输入分组名称"
									onChange={e => {
										setNewGroupName(e.target.value);
									}}
								/>
							</Form.Item>
						</Form>
					</Modal>
				)}
				{openCreateModal && (
					<CreateGroupChatModal
						openmodal={openCreateModal}
						groupChatInfo={curGroupChatInfo}
						handleModal={handleCreateModal}
						type={'invite'}
					/>
				)}
			</div>
		</>
	);
});

// 指定显示名称
AddressBook.displayName = 'AddressBook';
export default AddressBook;
