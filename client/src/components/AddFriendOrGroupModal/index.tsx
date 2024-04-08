import { SearchOutlined } from '@ant-design/icons';
import { Button, Empty, Input, Modal, Tabs, TabsProps } from 'antd';
import { useState } from 'react';

import { getFriendList, addFriend, getGroupList, addGroup } from './api';
import styles from './index.module.less';
import { IAddFriendOrGroupModalProps, IFriendItem, IGroupItem } from './type';

import ImageLoad from '@/components/ImageLoad';
import useShowMessage from '@/hooks/useShowMessage';
import { HttpStatus } from '@/utils/constant';

const AddFriendOrGroupModal = (props: IAddFriendOrGroupModalProps) => {
	const { openmodal, handleModal } = props;

	const showMessage = useShowMessage();
	const [friendList, setFriendList] = useState<IFriendItem[]>([]);
	const [groupList, setGroupList] = useState<IGroupItem[]>([]);
	const [friendName, setFriendName] = useState('');
	const [groupName, setGroupName] = useState('');
	const [loading, setLoading] = useState(false);
	// 查询好友关键字改变
	const handleFriendNameChange = (e: { target: { value: string } }) => {
		setFriendName(e.target.value);
		if (e.target.value === '') {
			setFriendList([]);
		}
	};
	// 获取模糊查询的好友列表
	const getFriendListData = async (username: string) => {
		try {
			if (username === '') {
				setFriendList([]);
				return;
			}
			const res = await getFriendList(username);
			if (res.code === HttpStatus.SUCCESS && res.data) {
				setFriendList(res.data);
			} else {
				showMessage('error', '查询失败, 请重试');
				setFriendList([]);
			}
		} catch {
			showMessage('error', '查询失败, 请重试');
			setFriendList([]);
		}
	};
	// 加好友
	const handleAddFriend = async (id: number, username: string, avatar: string) => {
		setLoading(true);
		try {
			const params = {
				id: id,
				username: username,
				avatar: avatar
			};
			const res = await addFriend(params);
			if (res.code === HttpStatus.SUCCESS) {
				showMessage('success', '添加成功');
				setLoading(false);
				handleModal(false);
			} else {
				showMessage('error', '添加失败, 请重试');
				setLoading(false);
			}
		} catch {
			showMessage('error', '添加失败, 请重试');
			setLoading(false);
		}
	};
	// 查询群关键字改变
	const handleGroupNameChange = (e: { target: { value: string } }) => {
		setGroupName(e.target.value);
		if (e.target.value === '') {
			setGroupList([]);
		}
	};
	// 获取模糊查询的群列表
	const getGroupChatListData = async (group_name: string) => {
		try {
			if (group_name === '') {
				setGroupList([]);
				return;
			}
			const res = await getGroupList(group_name);
			if (res.code === HttpStatus.SUCCESS && res.data) {
				setGroupList(res.data);
			} else {
				showMessage('error', '查询失败, 请重试');
				setGroupList([]);
			}
		} catch {
			showMessage('error', '查询失败, 请重试');
			setGroupList([]);
		}
	};
	// 加入群聊
	const joinGroup = async (group_id: number) => {
		setLoading(true);
		try {
			const params = {
				group_id
			};
			const res = await addGroup(params);
			if (res.code === HttpStatus.SUCCESS) {
				showMessage('success', '成功加入该群聊');
				setLoading(false);
				handleModal(false);
			} else {
				showMessage('error', '加入群聊失败, 请重试');
				setLoading(false);
			}
		} catch {
			showMessage('error', '加入群聊失败, 请重试');
			setLoading(false);
		}
	};
	// tabs 标签切换
	const items: TabsProps['items'] = [
		{
			key: '1',
			label: `加好友`,
			children: (
				<>
					<div className={styles.searchBox}>
						<Input
							size="small"
							placeholder="请输入对方的用户名"
							prefix={<SearchOutlined />}
							onChange={value => {
								handleFriendNameChange(value);
							}}
						/>
						<Button
							type="primary"
							onClick={() => {
								getFriendListData(friendName);
							}}
						>
							查找
						</Button>
					</div>
					{friendList.length === 0 ? (
						<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
					) : (
						<div className={styles.searchResult}>
							{friendList.map(item => (
								<div className={styles.list_item} key={item.username}>
									<ImageLoad src={item.avatar} />
									<div className={styles.list_item_desc}>
										<span className={styles.list_item_username}>
											{item.username} ({item.username})
										</span>
										{!item.status ? (
											<Button
												onClick={() => handleAddFriend(item.id, item.username, item.avatar)}
												type="primary"
												size="small"
												loading={loading}
											>
												加好友
											</Button>
										) : (
											<span> 已经是好友 </span>
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</>
			)
		},
		{
			key: '2',
			label: `加群`,
			children: (
				<>
					<div className={styles.searchBox}>
						<Input
							size="small"
							placeholder="请输入群名称"
							prefix={<SearchOutlined />}
							onChange={value => {
								handleGroupNameChange(value);
							}}
						/>
						<Button
							type="primary"
							onClick={() => {
								getGroupChatListData(groupName);
							}}
						>
							查找
						</Button>
					</div>
					{groupList.length === 0 ? (
						<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
					) : (
						<div className={styles.searchResult}>
							{groupList.map(item => (
								<div className={styles.list_item} key={item.group_id}>
									<ImageLoad src={item.avatar} />
									<div className={styles.list_item_desc}>
										<span className={styles.list_item_username}>
											{item.name} ({item.number}人)
										</span>
										{!item.status ? (
											<button onClick={() => joinGroup(item.group_id)}> 加入群聊 </button>
										) : (
											<span> 已加入群聊 </span>
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</>
			)
		}
	];
	return (
		<>
			<Modal
				open={openmodal}
				footer={null}
				onCancel={() => {
					handleModal(false);
				}}
			>
				<Tabs defaultActiveKey="1" items={items}></Tabs>
			</Modal>
		</>
	);
};

export default AddFriendOrGroupModal;
