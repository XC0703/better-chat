import { Form, Input, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { handleChange } from './api';
import styles from './index.module.less';

import { ImageUpload } from '@/components/ImageUpload';
import useShowMessage from '@/hooks/useShowMessage';
import { HttpStatus } from '@/utils/constant';
import { handleLogout, IUserInfo } from '@/utils/logout';
import { clearSessionStorage, userStorage } from '@/utils/storage';

interface IChangePerInfoModal {
	openmodal: boolean;
	handleModal: (open: boolean) => void;
}
// 修改用户信息表单类型
type ChangePerInfoFormType = {
	avatar: string;
	name: string;
	phone: string;
	signature: string;
};
const ChangePerInfoModal = (props: IChangePerInfoModal) => {
	const showMessage = useShowMessage();
	const navigate = useNavigate();
	const { username, name, avatar, phone, signature } = JSON.parse(userStorage.getItem() || '{}');
	const [changePerInfoFormInstance] = Form.useForm<ChangePerInfoFormType>();
	const { openmodal, handleModal } = props;
	const [loading, setLoading] = useState(false);

	// 退出登录
	// TODO：只有修改密码后才需要退出登录，这里暂时先退出登录
	const confirmLogout = async () => {
		try {
			const res = await handleLogout(JSON.parse(userStorage.getItem() || '{}') as IUserInfo);
			if (res.code === HttpStatus.SUCCESS) {
				clearSessionStorage();
				showMessage('success', '登录已过期，请重新登录');
				navigate('/login');
			} else {
				showMessage('error', '退出失败, 请重试');
			}
		} catch {
			showMessage('error', '退出失败, 请重试');
		}
	};

	const handleSubmit = async () => {
		changePerInfoFormInstance.validateFields().then(async values => {
			const { name, phone, signature } = values;
			const avatar = changePerInfoFormInstance.getFieldValue('avatar');
			setLoading(true);
			try {
				const params = {
					username,
					name,
					avatar,
					phone,
					signature
				};
				const res = await handleChange(params);
				if (res.code === HttpStatus.SUCCESS) {
					showMessage('success', '修改成功');
					setLoading(true);
					handleModal(false);
					confirmLogout();
				} else {
					showMessage('error', '修改失败，请重试');
					setLoading(false);
				}
			} catch {
				showMessage('error', '修改失败，请重试');
				setLoading(false);
			}
		});
	};

	// 表单数据回显
	useEffect(() => {
		changePerInfoFormInstance?.setFieldsValue({
			name,
			phone,
			signature: signature && signature !== '' ? signature : '暂无个性签名'
		});
	}, []);

	return (
		<>
			<Modal
				open={openmodal}
				onOk={handleSubmit}
				confirmLoading={loading}
				onCancel={() => {
					handleModal(false);
				}}
				okText="确认"
				cancelText="取消"
				wrapClassName={styles.infoChangeModal}
			>
				<div className={styles.infoModal}>
					<div className={styles.infoContainer}>
						<ImageUpload
							onUploadSuccess={filePath => {
								changePerInfoFormInstance?.setFieldsValue({ avatar: filePath });
							}}
							initialImageUrl={avatar}
						/>
						<div className={styles.info}>
							<div className={styles.name}>{name}</div>
							<div className={styles.phone}> 手机号：{phone}</div>
							<div className={styles.signature}>
								{signature === '' ? '暂无个性签名' : signature}
							</div>
						</div>
					</div>
					<div className={styles.changeContainer}>
						<Form name="personalInfoForm" form={changePerInfoFormInstance}>
							<Form.Item
								label="账户昵称"
								name="name"
								rules={[
									{ required: true, message: '请输入昵称' },
									{ max: 255, message: '昵称最多输入255个字符' }
								]}
							>
								<Input placeholder="请输入昵称" />
							</Form.Item>
							<Form.Item
								label="手机号码"
								name="phone"
								rules={[
									{ required: true },
									{ pattern: /^1[3456789]\d{9}$/, message: '请输入有效的手机号码' }
								]}
							>
								<Input placeholder="请输入手机号码" />
							</Form.Item>
							<Form.Item label="个性签名" name="signature">
								<Input placeholder="请输入个性签名" />
							</Form.Item>
						</Form>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default ChangePerInfoModal;
