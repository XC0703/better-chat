import { Checkbox, Form, Input, Button } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { handleLogin } from './api';
import styles from './index.module.less';

import { BgImage } from '@/assets/images';
import ChangePwdModal from '@/components/ChangePwdModal';
import useShowMessage from '@/hooks/useShowMessage';
import { HttpStatus } from '@/utils/constant';
import { generateRandomString, encrypt, decrypt } from '@/utils/encryption';
import { IUserInfo } from '@/utils/logout';
import { tokenStorage, userStorage } from '@/utils/storage';

// 记住密码 -- 主要就是将用户信息和 token 加密存储到本地
const rememberUser = async (info: IUserInfo) => {
	const userInfo = await encrypt(JSON.stringify(info));
	const authToken = await encrypt(tokenStorage.getItem());
	if (userInfo && authToken) {
		localStorage.setItem('userInfo', userInfo);
		localStorage.setItem('authToken', authToken);
	}
};
// 获取本地存储的用户信息
const getUserInfo = async () => {
	const userInfo = localStorage.getItem('userInfo');
	const authToken = localStorage.getItem('authToken');
	if (userInfo && authToken) {
		const info = JSON.parse(await decrypt(userInfo));
		const token = await decrypt(authToken);
		return { info, token };
	}
	return null;
};

// 登录表单类型
type LoginFormType = {
	username: string;
	password: string;
};
const Login = () => {
	const showMessage = useShowMessage();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [loginFormInstance] = Form.useForm<LoginFormType>();
	const [isRemember, setIsRemember] = useState(false);
	const [openForgetModal, setForgetModal] = useState(false);

	// 判断本地是否有用户信息，有且是相同的用户名则无需向后台发起请求，直接登录
	// 无则向后台发起请求，同时判断是否勾选了记住密码，勾选了则将用户信息存储到本地
	const handleSubmit = async (values: LoginFormType) => {
		const { username, password } = values;
		const res = await getUserInfo();
		if (res && res.info.username === username) {
			tokenStorage.setItem(res.token);
			userStorage.setItem(JSON.stringify(res.info));
			showMessage('success', '登录成功');
			navigate('/');
			return;
		} else {
			setLoading(true);
			try {
				const param = {
					username,
					password
				};
				const res = await handleLogin(param);
				if (res.code === HttpStatus.SUCCESS && res.data) {
					showMessage('success', '登录成功');
					setLoading(false);
					tokenStorage.setItem(res.data.token);
					userStorage.setItem(JSON.stringify(res.data.info));
					// 判断是否勾选了记住密码
					if (isRemember) {
						rememberUser(res.data.info);
					}
					navigate('/');
				} else {
					showMessage('error', res.message);
					setLoading(false);
				}
			} catch {
				showMessage('error', '登录失败，请重试');
				setLoading(false);
			}
		}
	};
	// 记住密码 -- 取消勾选则清除本地存储的用户信息
	const handleRemember = () => {
		const newIsRemember = !isRemember;
		setIsRemember(newIsRemember);
		localStorage.setItem('isRemember', JSON.stringify(newIsRemember));
		if (newIsRemember === false) {
			setIsRemember(false);
			localStorage.removeItem('userInfo');
			localStorage.removeItem('authToken');
		}
	};
	// 初始化时判断本地是否有记住密码，有则将信息填充到输入框中，同时将记住密码勾选上
	useEffect(() => {
		getUserInfo().then(res => {
			if (res) {
				loginFormInstance?.setFieldsValue({
					username: res.info.username,
					password: generateRandomString()
				});
				setIsRemember(true);
			} else {
				setIsRemember(false);
			}
		});
	}, []);
	// 控制修改密码的弹窗显隐
	const handleForgetModal = (visible: boolean) => {
		setForgetModal(visible);
	};
	return (
		<>
			<div className={styles.bgContainer} style={{ backgroundImage: `url(${BgImage})` }}>
				<div className={styles.loginContainer}>
					<div className={styles.text}>
						<h2>Welcome</h2>
					</div>
					<Form name="loginForm" onFinish={handleSubmit} form={loginFormInstance}>
						<Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
							<Input placeholder="请输入用户名" maxLength={255} />
						</Form.Item>
						<Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
							<Input type="password" placeholder="请输入密码" maxLength={255} />
						</Form.Item>
						<Form.Item>
							<div className={styles.login_tools}>
								<div className={styles.remenberTool}>
									<Checkbox onChange={handleRemember} checked={isRemember}>
										记住密码
									</Checkbox>
								</div>
								<div
									className={styles.forgetpasTool}
									onClick={() => {
										handleForgetModal(true);
									}}
								>
									忘记密码？
								</div>
							</div>
						</Form.Item>
						<Form.Item>
							<Button
								type="primary"
								className={styles.login_button}
								loading={loading}
								htmlType="submit"
							>
								登录
							</Button>
						</Form.Item>
					</Form>
					<div className={styles.link}>
						<Link to="/register"> 立即注册 </Link>
					</div>
				</div>
				{
					// 忘记密码弹窗
					openForgetModal && (
						<ChangePwdModal openmodal={openForgetModal} handleModal={handleForgetModal} />
					)
				}
			</div>
		</>
	);
};

export default Login;
