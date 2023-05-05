import styles from './index.module.less';
import { Link, useNavigate } from 'react-router-dom';
import { bgImage } from '@/assets/links/imagesLinks';
import { Input, Button, message } from 'antd';
import { useState } from 'react';
import { handleRegister } from './api';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status1, setStatus1] = useState<'' | 'error' | 'warning' | undefined>();
  const [status2, setStatus2] = useState<'' | 'error' | 'warning' | undefined>();
  const [status3, setStatus3] = useState<'' | 'error' | 'warning' | undefined>();
  const handleUserNameChange = (e: { target: { value: string } }) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e: { target: { value: string } }) => {
    setPassword(e.target.value);
  };
  const handleConfirmChange = (e: { target: { value: string } }) => {
    setConfirm(e.target.value);
  };
  const handleSubmit = () => {
    // 前端数据校验
    if (!username) {
      setStatus1('error');
    }
    if (!password) {
      setStatus2('error');
    }
    if (!confirm) {
      setStatus3('error');
    }
    if (!username || !password || !confirm) {
      message.error('请输入用户名或密码！', 1.5);
      setTimeout(() => {
        setStatus1(undefined);
        setStatus2(undefined);
        setStatus3(undefined);
      }, 1500);
      return;
    }
    if (password !== confirm) {
      setStatus3('error');
      message.error('两次密码不一致！');
      setTimeout(() => {
        setStatus3(undefined);
      }, 1500);
      return;
    }
    setLoading(true);
    const param = {
      username,
      password,
      confirmPassword: confirm,
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
              type="password"
              placeholder="请输入密码"
              name="password"
              onChange={handlePasswordChange}
              maxLength={255}
              status={status2}
            ></Input>
            <Input
              type="password"
              placeholder="确认密码"
              name="password"
              onChange={handleConfirmChange}
              maxLength={255}
              status={status3}
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
