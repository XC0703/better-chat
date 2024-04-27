import { Form, Input, Modal } from 'antd';
import { useEffect, useState } from 'react';

import { handleChange } from './api';
import styles from './index.module.less';
import { IChangePerInfoModalProps, IChangePerInfoForm } from './type';

import { ImageUpload } from '@/components/ImageUpload';
import useShowMessage from '@/hooks/useShowMessage';
import { HttpStatus } from '@/utils/constant';
import { tokenStorage, userStorage } from '@/utils/storage';

const ChangePerInfoModal = (props: IChangePerInfoModalProps) => {
	const showMessage = useShowMessage();
	const user = JSON.parse(userStorage.getItem());
	const [changePerInfoFormInstance] = Form.useForm<IChangePerInfoForm>();
	const { openmodal, handleModal } = props;
	const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		changePerInfoFormInstance.validateFields().then(async values => {
			const { name, phone, signature } = values;
			const avatar = changePerInfoFormInstance.getFieldValue('avatar');
			setLoading(true);
			try {
				const params = {
					username: user.username,
					name,
					avatar,
					phone,
					signature
				};
				const res = await handleChange(params);
				if (res.code === HttpStatus.SUCCESS && res.data) {
					showMessage('success', '修改成功');
					setLoading(true);
					handleModal(false);
					// 更新本地存储
					tokenStorage.setItem(res.data.token);
					userStorage.setItem(JSON.stringify(res.data.info));
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
		changePerInfoFormInstance.setFieldsValue({
			name: user.name,
			avatar: user.avatar,
			phone: user.phone,
			signature: user.signature && user.signature !== '' ? user.signature : '暂无个性签名'
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
								changePerInfoFormInstance.setFieldsValue({ avatar: filePath });
							}}
							initialImageUrl={user.avatar}
						/>
						<div className={styles.info}>
							<div className={styles.name}>{user.name}</div>
							<div className={styles.phone}> 手机号：{user.phone}</div>
							<div className={styles.signature}>
								{user.signature === '' ? '暂无个性签名' : user.signature}
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
