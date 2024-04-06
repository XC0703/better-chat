import { Input, Button, Form } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { handleRegister } from './api';
import styles from './index.module.less';
import { IRegisterForm } from './type';

import { BgImage } from '@/assets/images';
import { generateAvatarAPI } from '@/assets/images';
import useShowMessage from '@/hooks/useShowMessage';
import { HttpStatus } from '@/utils/constant';

const Register = () => {
	const showMessage = useShowMessage();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (values: IRegisterForm) => {
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
				phone,
				avatar: `${generateAvatarAPI}${username}`
			};
			const res = await handleRegister(params);
			if (res.code === HttpStatus.SUCCESS) {
				showMessage('success', '注册成功');
				setLoading(false);
				navigate('/login');
			} else {
				showMessage('error', res.message);
				setLoading(false);
			}
		} catch {
			showMessage('error', '注册失败，请重试');
			setLoading(false);
		}
	};
	return (
		<>
			<div className={styles.bgContainer} style={{ backgroundImage: `url(${BgImage})` }}>
				<div className={styles.registerContainer}>
					<div className={styles.text}>
						<h2>Welcome</h2>
					</div>
					<Form name="registerForm" onFinish={handleSubmit}>
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
							<Input type="phone" placeholder="请输入手机号"></Input>
						</Form.Item>
						<Form.Item
							name="password"
							rules={[
								{ required: true, message: '请输入密码' },
								{ max: 255, message: '密码最多输入255个字符' }
							]}
						>
							<Input type="password" placeholder="请输入密码"></Input>
						</Form.Item>
						<Form.Item name="confirm" rules={[{ required: true, message: '请确认密码' }]}>
							<Input type="password" placeholder="确认密码"></Input>
						</Form.Item>
						<Form.Item>
							<Button
								type="primary"
								className={styles.register_button}
								loading={loading}
								htmlType="submit"
							>
								注册
							</Button>
						</Form.Item>
					</Form>
					<div className={styles.link}>
						<Link to="/login"> 已有账号，返回登录 </Link>
					</div>
				</div>
			</div>
		</>
	);
};

export default Register;
