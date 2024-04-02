import { Checkbox, Input, Button, App } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { handleLogin } from './api';
import styles from './index.module.less';

import { BgImage } from '@/assets/images';
import ChangePwdModal from '@/components/ChangePwdModal';
import { encrypt, decrypt } from '@/utils/encryption';
import { tokenStorage, userStorage } from '@/utils/storage';

// 用户信息接口
interface IUserInfo {
	id: number;
	avatar: string;
	username: string;
	name: string;
	phone: string;
	created_at: string;
	signature: string;
}
// 记住密码 -- 主要就是将用户信息和 token 加密存储到本地
async function remenberUser(info: IUserInfo) {
	const userInfo = await encrypt(JSON.stringify(info));
	const authToken = await encrypt(tokenStorage.getItem());
	if (userInfo && authToken) {
		localStorage.setItem('userInfo', userInfo);
		localStorage.setItem('authToken', authToken);
	}
}
// 获取本地存储的用户信息
async function getUserInfo() {
	const userInfo = localStorage.getItem('userInfo');
	const authToken = localStorage.getItem('authToken');
	if (userInfo && authToken) {
		const info = JSON.parse(await decrypt(userInfo));
		const token = await decrypt(authToken);
		return { info, token };
	}
	return null;
}
// 随机生成一个字符串
const generateRandomString = () => {
	const randomValues = new Uint32Array(4);
	crypto.getRandomValues(randomValues);
	return Array.from(randomValues, decimal => decimal.toString(16)).join('');
};
const Login = () => {
	const { message } = App.useApp();
	const navigate = useNavigate();
	const [isRemember, setIsRemember] = useState(false);
	const [loading, setLoading] = useState(false);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [status1, setStatus1] = useState<'' | 'error' | 'warning' | undefined>();
	const [status2, setStatus2] = useState<'' | 'error' | 'warning' | undefined>();
	const [openForgetModal, setForgetModal] = useState(false);
	const handleUserNameChange = (e: { target: { value: string } }) => {
		setUsername(e.target.value);
	};
	const handlePasswordChange = (e: { target: { value: string } }) => {
		setPassword(e.target.value);
	};
	// 判断本地是否有用户信息，有且是相同的用户名则无需向后台发起请求，直接登录
	// 无则向后台发起请求，同时判断是否勾选了记住密码，勾选了则将用户信息存储到本地
	const handleSubmit = () => {
		getUserInfo().then(res => {
			if (res && res.info.username === username) {
				tokenStorage.setItem(res.token);
				userStorage.setItem(JSON.stringify(res.info));
				message.success('登录成功！', 1.5);
				navigate('/');
				return;
			} else {
				// 前端数据校验
				if (!username) {
					setStatus1('error');
				}
				if (!password) {
					setStatus2('error');
				}
				if (!username || !password || !confirm) {
					message.error('请输入用户名或密码！', 1.5);
					setTimeout(() => {
						setStatus1(undefined);
						setStatus2(undefined);
					}, 1500);
					return;
				}
				setLoading(true);
				// 调用登录接口
				const param = {
					username,
					password
				};
				handleLogin(param)
					.then(res => {
						if (res.code === 200 && res.data) {
							message.success('登录成功！', 1.5);
							setLoading(false);
							tokenStorage.setItem(res.data.token);
							userStorage.setItem(JSON.stringify(res.data.info));
							// 判断是否勾选了记住密码
							if (isRemember) {
								remenberUser(res.data.info);
							}
							navigate('/');
						} else {
							message.error(res.message, 1.5);
							setLoading(false);
						}
					})
					.catch(() => {
						message.error('登录失败，请稍后再试！', 1.5);
						setLoading(false);
					});
			}
		});
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
				setUsername(res.info.username);
				setPassword(generateRandomString());
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
				<form action="">
					<div className={styles.logintext}>
						<h2>Welcome</h2>
					</div>
					<div className={styles.loginoptions}>
						<Input
							type="text"
							placeholder="请输入用户名"
							name="username"
							value={username}
							onChange={handleUserNameChange}
							maxLength={255}
							status={status1}
						/>
						<Input
							type="password"
							placeholder="请输入密码"
							name="password"
							value={password}
							onChange={handlePasswordChange}
							maxLength={255}
							status={status2}
						/>
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
						<Button
							type="primary"
							className={styles.login_button}
							onClick={handleSubmit}
							loading={loading}
						>
							登录
						</Button>
						<span className={styles.login_link}>
							<Link to="/register"> 立即注册 </Link>
						</span>
					</div>
				</form>
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
