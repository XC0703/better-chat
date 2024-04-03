import { Input, Modal } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { handleChange } from './api';
import styles from './index.module.less';

import useShowMessage from '@/hooks/useShowMessage';
import { HttpStatus } from '@/utils/constant';
import { handleLogout, IUserInfo } from '@/utils/logout';
import { clearSessionStorage, userStorage } from '@/utils/storage';

interface IChangePwdModal {
	openmodal: boolean;
	handleModal: (open: boolean) => void;
}
const ChangePwdModal = (props: IChangePwdModal) => {
	const { openmodal, handleModal } = props;

	const showMessage = useShowMessage();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [username, setUsername] = useState('');
	const [phone, setPhone] = useState('');
	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');
	const [status1, setStatus1] = useState<'' | 'error' | 'warning' | undefined>();
	const [status2, setStatus2] = useState<'' | 'error' | 'warning' | undefined>();
	const [status3, setStatus3] = useState<'' | 'error' | 'warning' | undefined>();
	const [status4, setStatus4] = useState<'' | 'error' | 'warning' | undefined>();
	const handleUserNameChange = (e: { target: { value: string } }) => {
		setUsername(e.target.value);
	};
	const handlePasswordChange = (e: { target: { value: string } }) => {
		setPassword(e.target.value);
	};
	const handleConfirmChange = (e: { target: { value: string } }) => {
		setConfirm(e.target.value);
	};
	const handlePhoneChange = (e: { target: { value: string } }) => {
		setPhone(e.target.value);
	};

	// 退出登录
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

	// 修改密码
	const handleSubmit = async () => {
		// 前端数据校验
		if (!username) {
			setStatus1('error');
		}
		if (!phone) {
			setStatus2('error');
		}
		if (!password) {
			setStatus3('error');
		}
		if (!confirm) {
			setStatus4('error');
		}
		if (!username || !password || !confirm) {
			showMessage('error', '请输入用户名或密码');
			setTimeout(() => {
				setStatus1(undefined);
				setStatus2(undefined);
				setStatus3(undefined);
				setStatus4(undefined);
			}, 1500);
			return;
		}
		if (!phone) {
			showMessage('error', '请输入手机号');
			setTimeout(() => {
				setStatus2(undefined);
			}, 1500);
			return;
		}
		// 验证手机号格式
		const reg = /^1[3456789]\d{9}$/;
		if (!reg.test(phone)) {
			setStatus2('error');
			showMessage('error', '手机号格式不正确');
			setTimeout(() => {
				setStatus2(undefined);
			}, 1500);
			return;
		}
		if (password !== confirm) {
			setStatus4('error');
			showMessage('error', '两次密码不一致');
			setTimeout(() => {
				setStatus4(undefined);
			}, 1500);
			return;
		}
		setLoading(true);
		try {
			const param = {
				username,
				password,
				confirmPassword: confirm,
				phone
			};
			const res = await handleChange(param);
			if (res.code === HttpStatus.SUCCESS) {
				showMessage('success', '修改成功');
				setLoading(false);
				handleModal(false);
				confirmLogout();
			} else {
				showMessage('error', res.message);
				setLoading(false);
			}
		} catch {
			showMessage('error', '修改失败，请重试');
			setLoading(false);
		}
	};

	return (
		<>
			<Modal
				title="更改密码"
				open={openmodal}
				onOk={handleSubmit}
				confirmLoading={loading}
				onCancel={() => {
					handleModal(false);
				}}
				okText="确认"
				cancelText="取消"
				wrapClassName="changePwdModal"
			>
				<div className={styles.forgetContainer}>
					<Input
						type="text"
						placeholder="请输入用户名"
						name="username"
						onChange={handleUserNameChange}
						maxLength={255}
						status={status1}
					></Input>
					<Input
						type="phone"
						placeholder="请输入绑定的手机号"
						name="phone"
						onChange={handlePhoneChange}
						maxLength={50}
						status={status2}
					></Input>
					<Input
						type="password"
						placeholder="请输入新的密码"
						name="password"
						onChange={handlePasswordChange}
						maxLength={255}
						status={status3}
					></Input>
					<Input
						type="password"
						placeholder="确认新的密码"
						name="password"
						onChange={handleConfirmChange}
						maxLength={255}
						status={status4}
					></Input>
				</div>
			</Modal>
		</>
	);
};

export default ChangePwdModal;
