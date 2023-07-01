import { Input, Button, message } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { bgImage } from '@/assets/links/imagesLinks';

import { handleRegister } from './api';
import styles from './index.module.less';

const Register = () => {
  const generateAvatarAPI = 'https://ui-avatars.com/api/?name=';
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
  const handleSubmit = () => {
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
      message.error('请输入用户名或密码！', 1.5);
      setTimeout(() => {
        setStatus1(undefined);
        setStatus2(undefined);
        setStatus3(undefined);
        setStatus4(undefined);
      }, 1500);
      return;
    }
    if (!phone) {
      message.error('请输入手机号！', 1.5);
      setTimeout(() => {
        setStatus2(undefined);
      }, 1500);
      return;
    }
    // 验证手机号格式
    const reg = /^1[3456789]\d{9}$/;
    if (!reg.test(phone)) {
      setStatus2('error');
      message.error('手机号格式不正确！');
      setTimeout(() => {
        setStatus2(undefined);
      }, 1500);
      return;
    }
    if (password !== confirm) {
      setStatus4('error');
      message.error('两次密码不一致！');
      setTimeout(() => {
        setStatus4(undefined);
      }, 1500);
      return;
    }
    setLoading(true);
    const param = {
      username,
      password,
      confirmPassword: confirm,
      phone,
      avatar: `${generateAvatarAPI}${username}`,
    };
    handleRegister(param)
      .then((res) => {
        if (res.code === 200) {
          message.success('注册成功！', 1.5);
          setLoading(false);
          navigate('/login');
        } else {
          message.error(res.message, 1.5);
          setLoading(false);
        }
      })
      .catch(() => {
        message.error('注册失败，请稍后再试！', 1.5);
        setLoading(false);
      });
  };
  return (
    <>
      <div className={styles.bgContainer} style={{ backgroundImage: `url(${bgImage})` }}>
        <form action="">
          <div className={styles.registertext}>
            <h2>Welcome</h2>
          </div>
          <div className={styles.registeroptions}>
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
              placeholder="请输入手机号"
              name="phone"
              onChange={handlePhoneChange}
              maxLength={50}
              status={status2}
            ></Input>
            <Input
              type="password"
              placeholder="请输入密码"
              name="password"
              onChange={handlePasswordChange}
              maxLength={255}
              status={status3}
            ></Input>
            <Input
              type="password"
              placeholder="确认密码"
              name="password"
              onChange={handleConfirmChange}
              maxLength={255}
              status={status4}
            ></Input>
            <Button type="primary" className={styles.register_button} onClick={handleSubmit} loading={loading}>
              注册
            </Button>
            <span className={styles.register_link}>
              <Link to="/login">已有账号，返回登录</Link>
            </span>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
