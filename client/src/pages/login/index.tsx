import { useEffect, useState } from 'react';
import styles from './index.module.less';
import { message, Checkbox } from 'antd';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [isRemember, setIsRemember] = useState(false);
  const handleSubmit = () => {
    console.log('登录！');
  };
  const handleChange = () => {
    console.log('change');
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
      <div className={styles.bgContainer}>
        <form action="" onSubmit={handleSubmit}>
          <div className={styles.logintext}>
            <h2>Welcome</h2>
          </div>
          <div className={styles.loginoptions}>
            <input type="text" placeholder="请输入用户名" name="username" onChange={handleChange} min="3" />
            <input type="password" placeholder="请输入密码" name="password" onChange={handleChange} />
            <div className={styles.login_tools}>
              <div className={styles.remenberTool}>
                <Checkbox onChange={onChange}>记住密码</Checkbox>
              </div>
              <div className={styles.forgetpasTool} onClick={handleForget}>
                忘记密码？
              </div>
            </div>
            <button type="submit" className={styles.login_button}>
              登录
            </button>
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
