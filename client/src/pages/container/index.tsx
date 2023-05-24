import styles from './index.module.less';
import { userStorage, clearSessionStorage } from '@/common/storage';
const Container = () => {
  const { username, avatar, phone, signature } = JSON.parse(userStorage.getItem() || '{}');
  return (
    <>
      <div className={styles.container}>
        <div className={styles.leftContainer}>
          <div className={styles.avatar}>
            <img src={avatar} alt="" />
          </div>
          <div className={styles.topicons}></div>
          <div className={styles.bottomicons}></div>
        </div>
        <div className={styles.middleContainer}></div>
        <div className={styles.rightContainer}></div>
      </div>
    </>
  );
};

export default Container;
