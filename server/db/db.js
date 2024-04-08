/* global process */
const mysql = require('mysql');
const fs = require('fs');

/**
 * 1、读取 MySQL 数据库配置文件
 */
let host = '127.0.0.1'; // 数据库的 IP 地址
let port = 3306; // 端口
let user = 'root'; // 登录数据库的账号
let password = '123456'; // 登录数据库的密码
let database = 'better-chat'; // 指定要操作哪个数据库
if (fs.existsSync('config.json')) {
	const res = JSON.parse(fs.readFileSync('config.json'));
	host = res.host;
	port = res.port;
	user = res.user;
	password = res.password;
	database = res.database;
}

/**
 * 2. 建立与 MySQL 数据库的连接关系
 */
const db = mysql.createPool({
	host,
	port,
	user,
	password,
	database,
	multipleStatements: true,
	charset: 'utf8mb4'
});

/**
 * 3. 建表
 */
// 创建用户 user 表
const initUserTable = () => {
	const sql = `
    CREATE TABLE IF NOT EXISTS user (
      id INT (11) NOT NULL AUTO_INCREMENT PRIMARY KEY, 
      username VARCHAR (255) NOT NULL UNIQUE, 
      password VARCHAR (255) NOT NULL, 
      phone VARCHAR (50) NOT NULL, 
      avatar VARCHAR (255) NULL, 
      name VARCHAR (255) NULL, 
      salt VARCHAR (20) NOT NULL, 
      signature LONGTEXT NULL, 
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE = INNODB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
  `;
	db.query(sql, error => {
		// eslint-disable-next-line no-console
		if (error) console.log(error);
	});
};
// 创建好友 friend 表
const initFirendTable = () => {
	const sql = `
    CREATE TABLE IF NOT EXISTS friend (
      id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, 
      user_id INT(11) NOT NULL, 
      username VARCHAR(50) NOT NULL, 
      avatar VARCHAR (255) NULL, 
      online_status ENUM('online', 'offline') DEFAULT 'offline', 
      remark VARCHAR(50), 
      group_id INT(11), 
      room VARCHAR(255), 
      unread_msg_count INT(11) DEFAULT 0, 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
      INDEX idx_group_id (group_id), 
      FOREIGN KEY (group_id) REFERENCES friend_group(id) ON DELETE SET NULL
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
  `;
	db.query(sql, error => {
		// eslint-disable-next-line no-console
		if (error) console.log(error);
	});
};
// 创建分组 friend_group 表
const initGroupTable = () => {
	const sql = `
    CREATE TABLE IF NOT EXISTS friend_group (
      id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, 
      user_id INT(11) NOT NULL, 
      username VARCHAR (255) NOT NULL, 
      name VARCHAR(50) NOT NULL, 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
      INDEX idx_user_id (user_id), 
      FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
  `;
	db.query(sql, error => {
		// eslint-disable-next-line no-console
		if (error) console.log(error);
		initFirendTable();
		initGroupChatTable();
	});
};
// 创建消息 message 表
const initMessageTable = () => {
	const sql = `
    CREATE TABLE IF NOT EXISTS message (
      id int(11) NOT NULL AUTO_INCREMENT, 
      sender_id int(11) NOT NULL, 
      receiver_id int(11) NOT NULL, 
      content longtext NOT NULL, 
      room VARCHAR(255) NOT NULL, 
      type enum('private', 'group') NOT NULL, 
      media_type enum('text', 'image', 'video', 'file') NOT NULL, 
      file_size int(11) NULL DEFAULT 0, 
      status int(1) NOT NULL DEFAULT 0, 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
      PRIMARY KEY (id), 
      FOREIGN KEY (sender_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
  `;
	db.query(sql, error => {
		// eslint-disable-next-line no-console
		if (error) console.log(error);
		initmessageStatisticsTable();
	});
};
// 创建消息统计 message_statistics 表
const initmessageStatisticsTable = () => {
	const sql = `
    CREATE TABLE IF NOT EXISTS message_statistics (
      id int(11) NOT NULL AUTO_INCREMENT, 
      room VARCHAR(255) NOT NULL, 
      total int(255) NOT NULL, 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
      PRIMARY KEY (id)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
  `;
	db.query(sql, error => {
		// eslint-disable-next-line no-console
		if (error) console.log(error);
	});
};
// 创建群聊 group_chat 表
const initGroupChatTable = () => {
	const sql = `
    CREATE TABLE IF NOT EXISTS group_chat (
      id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, 
      name VARCHAR(50) NOT NULL, 
      creator_id INT(11) NOT NULL, 
      avatar VARCHAR(255), 
      announcement TEXT, 
      room VARCHAR(255), 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
      INDEX idx_creator_id (creator_id), 
      FOREIGN KEY (creator_id) REFERENCES user(id) ON DELETE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
  `;
	db.query(sql, error => {
		// eslint-disable-next-line no-console
		if (error) console.log(error);
		initGroupMembersTable();
	});
};
// 创建群成员 group_members 表
const initGroupMembersTable = () => {
	const sql = `
    CREATE TABLE IF NOT EXISTS group_members (
      id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, 
      group_id INT(11) NOT NULL, 
      user_id INT(11) NOT NULL, 
      nickname VARCHAR(50) NOT NULL, 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
      INDEX idx_user_id (user_id), 
      INDEX idx_group_id (group_id), 
      FOREIGN KEY (group_id) REFERENCES group_chat(id) ON DELETE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
  `;
	db.query(sql, error => {
		// eslint-disable-next-line no-console
		if (error) console.log(error);
	});
};

/**
 * 4、测试 mysql 模块能否正常工作
 */
db.query('select 1', error => {
	// mysql 模块工作期间报错了，就进入这个 if 判断语句，打印这个错误信息
	if (error) {
		// eslint-disable-next-line no-console
		console.log('MySQL 连接失败', error.message);
		process.exit(1);
	}
	initUserTable();
	initGroupTable();
	initMessageTable();
	// eslint-disable-next-line no-console
	console.log('MySQL 连接成功');
});

/**
 * 5、将连接好的数据库对象向外导出, 供外界使用
 */
module.exports = db;
