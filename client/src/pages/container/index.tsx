import styles from './index.module.less';
import { userStorage, clearSessionStorage } from '@/common/storage';
import { iconList } from './variable';
import { Tooltip } from 'antd';
import { useState } from 'react';

const Container = () => {
  const { username, avatar, phone, signature } = JSON.parse(userStorage.getItem() || '{}');
  const [currentIcon, setCurrentIcon] = useState<string>('icon-message');

  return (
    <>
      <div className={styles.container}>
        <div className={styles.leftContainer}>
          <div className={styles.avatar}>
            <img src={avatar} alt="" />
          </div>
          <div className={styles.iconList}>
            <ul className={styles.topIcons}>
              {iconList.slice(0, 5).map((item) => {
                return (
                  <Tooltip key={item.text} placement="bottomLeft" title={item.text} arrow={false}>
                    <li
                      className={`iconfont ${item.icon}`}
                      onClick={() => {
                        setCurrentIcon(item.icon);
                      }}
                      style={{ color: currentIcon === item.icon ? '#07c160' : '#979797' }}
                    ></li>
                  </Tooltip>
                );
              })}
            </ul>
            <ul className={styles.bottomIcons}>
              {iconList.slice(5, 8).map((item) => {
                return (
                  <Tooltip key={item.text} placement="bottomLeft" title={item.text} arrow={false}>
                    <li
                      className={`iconfont ${item.icon}`}
                      onClick={() => {
                        setCurrentIcon(item.text);
                      }}
                      style={{ color: currentIcon === item.text ? '#07c160' : '#979797' }}
                    ></li>
                  </Tooltip>
                );
              })}
            </ul>
          </div>
          <div className={styles.bottomIcons}></div>
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
