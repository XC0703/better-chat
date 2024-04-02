import { App, Form, Input, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { handleChange } from './api';
import styles from './index.module.less';

import { handleLogout, IUserInfo } from '@/utils/logout';
import { clearSessionStorage, userStorage } from '@/utils/storage';

interface IChangeInfoModal {
	openmodal: boolean;
	handleModal: (open: boolean) => void;
}
const ChangeInfoModal = (props: IChangeInfoModal) => {
	const { message } = App.useApp();
	const navigate = useNavigate();
	const { username, name, avatar, phone, signature } = JSON.parse(userStorage.getItem() || '{}');
	const [infoChangeInstance] = Form.useForm<{
		newName: string;
		newPhone: string;
		newSignature: string;
	}>();
	const { openmodal, handleModal } = props;
	const [newName, setNewName] = useState<string>(name);
	const newAvatar = avatar;
	// const [newAvatar, setNewAvatar] = useState<string>(avatar);
	const [newPhone, setNewPhone] = useState<string>(phone);
	const [newSignature, setNewSignature] = useState<string>(signature);
	const [loading, setLoading] = useState(false);

	const [status1, setStatus1] = useState<'' | 'error' | 'warning' | undefined>();
	const [status2, setStatus2] = useState<'' | 'error' | 'warning' | undefined>();

	// 退出登录
	const confirmLogout = () => {
		handleLogout(JSON.parse(userStorage.getItem() || '{}') as IUserInfo)
			.then(res => {
				if (res.code === 200) {
					clearSessionStorage();
					message.success('登录已过期，请重新登录', 1.5);
					navigate('/login');
				} else {
					message.error('退出失败, 请重试', 1.5);
				}
			})
			.catch(() => {
				message.error('退出失败, 请重试', 1.5);
			});
	};

	const handleSubmit = () => {
		// 前端数据校验
		if (!newName) {
			setStatus1('error');
			message.error('请输入用户昵称！', 1.5);
			setTimeout(() => {
				setStatus1(undefined);
			}, 1500);
			return;
		}
		if (!newPhone) {
			setStatus2('error');
			message.error('请输入手机号！', 1.5);
			setTimeout(() => {
				setStatus2(undefined);
			}, 1500);
			return;
		}
		// 验证手机号格式
		const reg = /^1[3456789]\d{9}$/;
		if (!reg.test(newPhone)) {
			setStatus2('error');
			message.error('手机号格式不正确！', 1.5);
			setTimeout(() => {
				setStatus2(undefined);
			}, 1500);
			return;
		}
		setLoading(true);
		const params = {
			username,
			name: newName,
			avatar: newAvatar,
			phone: newPhone,
			signature: newSignature
		};
		handleChange(params)
			.then(res => {
				if (res.code === 200) {
					message.success('修改成功！', 1.5);
					setLoading(true);
					handleModal(false);
					confirmLogout();
				} else {
					message.error('修改失败，请稍后再试！', 1.5);
					setLoading(true);
				}
				setLoading(false);
			})
			.catch(() => {
				message.error('修改失败，请稍后再试！', 1.5);
				setLoading(false);
			});
	};

	// 表单数据回显
	useEffect(() => {
		infoChangeInstance?.setFieldsValue({
			newName,
			newPhone,
			newSignature: newSignature && newSignature !== '' ? newSignature : '暂无个性签名'
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
						<div className={styles.avatar}>
							<img src={avatar} alt="" />
						</div>
						<div className={styles.info}>
							<div className={styles.name}>{name}</div>
							<div className={styles.phone}> 手机号：{phone}</div>
							<div className={styles.signature}>
								{signature === '' ? '暂无个性签名' : signature}
							</div>
						</div>
					</div>
					<div className={styles.changeContainer}>
						<Form form={infoChangeInstance}>
							<Form.Item label="账户昵称" name="newName" rules={[{ required: true }]}>
								<Input
									placeholder="请输入账户昵称"
									onChange={e => setNewName(e.target.value)}
									status={status1}
								/>
							</Form.Item>
							<Form.Item label="手机号码" name="newPhone" rules={[{ required: true }]}>
								<Input
									placeholder="请输入手机号码"
									onChange={e => setNewPhone(e.target.value)}
									status={status2}
								/>
							</Form.Item>
							<Form.Item label="个性签名" name="newSignature">
								<Input
									placeholder="请输入个性签名"
									onChange={e => setNewSignature(e.target.value)}
								/>
							</Form.Item>
						</Form>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default ChangeInfoModal;
