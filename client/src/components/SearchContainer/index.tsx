import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Tooltip, Input } from 'antd';
import { useState } from 'react';

import styles from './index.module.less';

import AddFriendOrGroupModal from '@/components/AddFriendOrGroupModal';
import CreateGroupChatModal from '@/components/CreateGroupChatModal';

const SearchContainer = () => {
	const [openAddModal, setAddModal] = useState(false);
	const [openCreateModal, setCreateModal] = useState(false);

	// 控制添加好友 / 群聊的弹窗显隐
	const handleAddModal = (visible: boolean) => {
		setAddModal(visible);
	};
	// 控制创建群聊的弹窗显隐
	const handleCreateModal = (visible: boolean) => {
		setCreateModal(visible);
	};
	const addContent = (
		<ul>
			<li onClick={() => handleAddModal(true)}> 加好友/加群 </li>
			<li onClick={() => handleCreateModal(true)}> 创建群聊 </li>
		</ul>
	);

	return (
		<>
			<div className={styles.searchContainer}>
				<div className={styles.searchBox}>
					<Input size="small" placeholder="搜索" prefix={<SearchOutlined />} />
				</div>
				<Tooltip
					placement="bottomLeft"
					title={addContent}
					arrow={false}
					overlayClassName="addContent"
				>
					<div className={styles.addBox}>
						<PlusOutlined />
					</div>
				</Tooltip>
			</div>
			{
				// 添加好友或群聊弹窗
				openAddModal && (
					<AddFriendOrGroupModal openmodal={openAddModal} handleModal={handleAddModal} />
				)
			}
			{
				// 创建群聊弹窗
				openCreateModal && (
					<CreateGroupChatModal
						openmodal={openCreateModal}
						handleModal={handleCreateModal}
						type={'create'}
					/>
				)
			}
		</>
	);
};

export default SearchContainer;
