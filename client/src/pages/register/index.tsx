import styles from './index.module.less';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const handleSubmit = () => {
    console.log('注册！');
  };
  const handleChange = () => {
    console.log('change');
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
            <input type="password" placeholder="确认密码" name="password" onChange={handleChange} />
            <button type="submit" className={styles.login_button}>
              注册
            </button>
            <span className={styles.login_link}>
              <Link to="/login">已有账号，返回登录</Link>
            </span>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
