import { Button, Form, Input, Modal } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { handleChange } from './api';
import styles from './index.module.less';
import { IChangePwdForm, IChangePwdModalProps } from './type';

import useShowMessage from '@/hooks/useShowMessage';
import { HttpStatus } from '@/utils/constant';
import { handleLogout } from '@/utils/logout';
import { clearSessionStorage, userStorage } from '@/utils/storage';

const ChangePwdModal = (props: IChangePwdModalProps) => {
	const { openmodal, handleModal } = props;

	const showMessage = useShowMessage();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);

	// 退出登录
	const confirmLogout = async () => {
		try {
			const res = await handleLogout(JSON.parse(userStorage.getItem()));
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
	const handleSubmit = async (values: IChangePwdForm) => {
		const { username, phone, password, confirm } = values;
		if (password !== confirm) {
			showMessage('error', '两次密码不一致');
			return;
		}
		setLoading(true);
		try {
			const params = {
				username,
				password,
				confirmPassword: confirm,
				phone
			};
			const res = await handleChange(params);
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
				title="修改密码"
				open={openmodal}
				confirmLoading={loading}
				onCancel={() => {
					handleModal(false);
				}}
				footer={null}
				wrapClassName="changePwdModal"
			>
				<Form name="changePwdForm" onFinish={handleSubmit} className={styles.changePwdForm}>
					<Form.Item
						name="username"
						rules={[
							{ required: true, message: '请输入用户名' },
							{ max: 255, message: '用户名最多输入255个字符' }
						]}
					>
						<Input type="text" placeholder="请输入用户名"></Input>
					</Form.Item>
					<Form.Item
						name="phone"
						rules={[
							{ required: true, message: '请输入手机号' },
							{ pattern: /^1[3456789]\d{9}$/, message: '请输入有效的手机号码' }
						]}
					>
						<Input type="phone" placeholder="请输入绑定的手机号"></Input>
					</Form.Item>
					<Form.Item
						name="password"
						rules={[
							{ required: true, message: '请输入密码' },
							{ max: 255, message: '密码最多输入255个字符' }
						]}
					>
						<Input type="password" placeholder="请输入新的密码"></Input>
					</Form.Item>
					<Form.Item name="confirm" rules={[{ required: true, message: '请确认密码' }]}>
						<Input type="password" placeholder="确认新的密码"></Input>
					</Form.Item>
					<Form.Item>
						<Button
							type="default"
							onClick={() => {
								handleModal(false);
							}}
						>
							取消
						</Button>
						<Button type="primary" htmlType="submit">
							确认
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default ChangePwdModal;
