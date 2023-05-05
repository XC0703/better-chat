import { useEffect, useState } from 'react';
import styles from './index.module.less';
import { message, Checkbox, Input, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { bgImage } from '@/assets/links/imagesLinks';
import { handleLogin } from './api';
import { tokenStorage } from '@/common/storage';

const Login = () => {
  const navigate = useNavigate();
  const [isRemember, setIsRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status1, setStatus1] = useState<'' | 'error' | 'warning' | undefined>();
  const [status2, setStatus2] = useState<'' | 'error' | 'warning' | undefined>();
  const handleUserNameChange = (e: { target: { value: string } }) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e: { target: { value: string } }) => {
    setPassword(e.target.value);
  };
  const handleSubmit = () => {
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
    // to do，调用登录接口
    const param = {
      username,
      password,
    };
    handleLogin(param)
      .then((res) => {
        if (res.code === 200) {
          message.success('登录成功！', 1.5);
          setLoading(false);
          tokenStorage.setItem(res.data.token);
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
  };
  // 记住密码
  const onChange = () => {
    setIsRemember(!isRemember);
  };
  useEffect(() => {
    // todo: 本地存储
    // console.log(isRemember);
  }, [isRemember]);
  // 忘记密码
  const handleForget = () => {
    message.info('请联系系统开发者处理');
  };
  return (
    <>
      <div className={styles.bgContainer} style={{ backgroundImage: `url(${bgImage})` }}>
        <form action="">
          <div className={styles.logintext}>
            <h2>Welcome</h2>
          </div>
          <div className={styles.loginoptions}>
            <Input
              type="text"
              placeholder="请输入用户名"
              name="username"
              onChange={handleUserNameChange}
              maxLength={255}
              status={status1}
            />
            <Input
              type="password"
              placeholder="请输入密码"
              name="password"
              onChange={handlePasswordChange}
              maxLength={255}
              status={status2}
            />
            <div className={styles.login_tools}>
              <div className={styles.remenberTool}>
                <Checkbox onChange={onChange}>记住密码</Checkbox>
              </div>
              <div className={styles.forgetpasTool} onClick={handleForget}>
                忘记密码？
              </div>
            </div>
            <Button type="primary" className={styles.login_button} onClick={handleSubmit} loading={loading}>
              登录
            </Button>
            <span className={styles.login_link}>
              <Link to="/register">立即注册</Link>
            </span>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
