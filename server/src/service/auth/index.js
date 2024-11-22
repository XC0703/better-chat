/* global LoginRooms */
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Redis = require('ioredis');

const { AuthStatus, CommonStatus } = require('../../utils/status');
const { RespData, RespSuccess, RespError } = require('../../utils/resp');
const { secretKey } = require('../../utils/authenticate');
const { NotificationUser } = require('../../utils/notification');
const { Query } = require('../../utils/query');

const better_chat = new Redis();

/**
 * 登录的基本逻辑：
 * 1. 获取到前端传来的 username 和 password
 * 2. 查询数据库, 判断用户名和密码是否正确
 * 3. 正确后生成 jwt, 判断 redis 中是否有该用户的 token，没有则返回想要 token 给前端去保存
 */
const login = async (req, res) => {
	const { username, password } = req.body;
	if (!(username && password)) {
		return RespError(res, CommonStatus.PARAM_ERR);
	}
	try {
		const sql = `SELECT * FROM user WHERE username = ?`;
		const results = await Query(sql, [username]);
		if (results.length !== 0) {
			// 1. 获取到用户信息
			const payload = {
				id: results[0].id,
				avatar: results[0].avatar,
				username: results[0].username,
				password: results[0].password,
				name: results[0].name,
				phone: results[0].phone,
				salt: results[0].salt
			};
			// 2. 加盐
			const M = payload.salt.slice(0, 3) + password + payload.salt.slice(3);
			// 3. 将 M 进行 MD5 哈希，得到哈希值
			const hash = crypto.createHash('md5').update(M).digest('hex');
			if (hash !== payload.password) {
				return RespError(res, AuthStatus.USER_OR_PASS_ERR);
			}
			// 4. 生成 jwt，之后 payload 会携带在请求头的 req.user 中（前提是通过了中间件）
			const token = jwt.sign(payload, secretKey);
			const data = {
				token: token,
				info: {
					id: results[0].id,
					avatar: results[0].avatar,
					username: results[0].username,
					name: results[0].name,
					phone: results[0].phone,
					created_at: new Date(results[0].created_at)
						.toLocaleString('zh-CN', { hour12: false })
						.replace(/\//g, '-'),
					signature: results[0].signature
				}
			};
			// 4. 检查 Redis 缓存中的 Token
			const redisToken = await better_chat.get(`token:${payload.username}`);
			if (redisToken) {
				return RespError(res, AuthStatus.USER_ALREADY_LOGGEDIN);
			}
			// 5. 登录成功去改变好友表中的状态
			const sql = `UPDATE friend SET online_status = ? WHERE username = ?`;
			await Query(sql, ['online', username]);
			// 6. 保存 Token 到 Redis 缓存中
			await better_chat.set(`token:${payload.username}`, token, 'EX', 60 * 60 * 24 * 14); // 有效期为 14 天
			return RespData(res, data);
		} else {
			return RespError(res, AuthStatus.USER_OR_PASS_ERR);
		}
	} catch {
		return RespError(res, CommonStatus.SERVER_ERR);
	}
};
/**
 * 退出登录的基本逻辑：
 * 1. 获取到前端传来的 username
 * 2. 删除 redis 中的 token 并更新好友表中的状态
 * 3. 返回成功
 */
const logout = async (req, res) => {
	const { username } = req.body;
	if (!username) {
		return RespError(res, CommonStatus.PARAM_ERR);
	}
	// 退出登录成功去改变好友表中的状态
	try {
		const sql = `UPDATE friend SET online_status = ? WHERE username = ?`;
		await Query(sql, ['offline', username]);
		// 删除 redis 中的 token
		await better_chat.del(`token:${username}`);
		return RespSuccess(res);
	} catch {
		return RespError(res, CommonStatus.SERVER_ERR);
	}
};
/**
 * 注册的基本逻辑：
 * 1. 获取到前端传来的注册信息
 * 2. 先判断用户名或手机号是否已经注册
 * 3. 未注册则插入 user 表中
 * 4. 给新用户添加一个好友分组
 * 5. 生成 jwt, 把 token 和用户信息返回给前端
 */
const register = async (req, res) => {
	const { username, password, phone, avatar } = req.body;
	if (!(username && password && phone)) {
		return RespError(res, CommonStatus.PARAM_ERR);
	}
	try {
		// 判断用户名或手机号是否已经注册
		const sql_check = `SELECT username, password, phone FROM user WHERE username = ? OR phone = ?`;
		const results_check = await Query(sql_check, [username, phone]);
		if (results_check.length !== 0) {
			return RespError(res, AuthStatus.USER_EXIT_ERR);
		}
		// 加盐（3 个字节的字节码转化成 16 进制字符串，生成一个 6 位的 salt）
		const salt = crypto.randomBytes(3).toString('hex');
		const M = salt.slice(0, 3) + password + salt.slice(3);
		// 将 M 进行 MD5 哈希，得到哈希值
		const hash = crypto.createHash('md5').update(M).digest('hex');
		const user = {
			avatar,
			username: username,
			password: hash,
			name: username,
			phone: phone,
			signature: '',
			salt: salt
		};
		// 插入 user 表中
		const sql_set_user = `INSERT INTO user SET ?`;
		const results_set_user = await Query(sql_set_user, user);
		// 注册成功后将相关信息返回给前端
		if (results_set_user.affectedRows === 1) {
			const sql_get_user = `SELECT * FROM user WHERE username = ?`;
			const results_get_user = await Query(sql_get_user, [username]);
			const info = results_get_user[0];
			// 创建一个新的默认分组 ("我的好友"")
			const friend_group = {
				user_id: info.id,
				username: username,
				name: '我的好友'
			};
			const sql_set_group = `INSERT INTO friend_group SET ?`;
			await Query(sql_set_group, friend_group);
			// 生成 jwt
			const payload = {
				id: info.id,
				avatar: info.avatar,
				username: info.username,
				name: info.name,
				phone: info.phone
			};
			const token = jwt.sign(payload, secretKey);
			// 返回 token 和用户信息
			const data = {
				token: token,
				info: info
			};
			return RespData(res, data);
		}
	} catch {
		return RespError(res, CommonStatus.SERVER_ERR);
	}
};
/**
 * 忘记密码/修改密码的基本逻辑：
 * 1. 判断用户手机号和用户名是否存在
 * 2. 如果数据符合则修改 user 表的数据（密码重新加盐哈希）
 * 3. 前端重新登录
 */
const forgetPassword = async (req, res) => {
	const { username, phone, password } = req.body;
	if (!(username && phone && password)) {
		return RespError(res, CommonStatus.PARAM_ERR);
	}
	try {
		const sql_check = `SELECT username, phone, salt FROM user WHERE username = ? AND phone = ?`;
		// 判断用户手机号和用户名是否存在
		const results_check = await Query(sql_check, [username, phone]);
		if (results_check.length === 0) {
			return RespError(res, AuthStatus.USER_NOTEXIT_ERR);
		}
		// 重新进行 MD5 哈希加盐
		const salt = results_check[0].salt;
		const M = salt.slice(0, 3) + password + salt.slice(3);
		const hash = crypto.createHash('md5').update(M).digest('hex');
		const sql_set = `UPDATE user SET PASSWORD = ? WHERE username = ?`;
		const results_set = await Query(sql_set, [hash, username]);
		if (results_set.affectedRows === 1) {
			return RespSuccess(res);
		}
	} catch {
		return RespError(res, CommonStatus.SERVER_ERR);
	}
};
/**
 * 修改用户信息的基本逻辑：
 * 1. 获取到前端传来的更新信息，判断新手机号是否已被注册，若未被注册则直接更新 user 表中的数据
 * 2. 生成 jwt, 更新 redis 中的 token，返回新的用户信息和 token 给前端
 * 3. 前端重新刷新相关信息
 */
const updateInfo = async (req, res) => {
	const { username, avatar, name, phone, signature } = req.body;
	if (!username) {
		return RespError(res, CommonStatus.PARAM_ERR);
	}
	try {
		// 判断手机号是否已经注册(排除自己)
		const sql_check = `SELECT * FROM user WHERE phone = ?`;
		const results_check = await Query(sql_check, [phone]);
		if (results_check.length !== 0 && results_check[0].username !== username) {
			return RespError(res, AuthStatus.PHONE_EXIT_ERR);
		}
		// 更新 user 表中的数据
		const info = {
			avatar,
			name,
			phone,
			signature
		};
		const sql_set = `UPDATE user SET ? WHERE username = ?`;
		const results_set = await Query(sql_set, [info, username]);
		if (results_set.affectedRows === 1) {
			// 返回新的用户信息和 token 给前端
			const sql_get = `SELECT * FROM user WHERE username = ?`;
			const results_get = await Query(sql_get, [username]);
			const payload = {
				id: results_get[0].id,
				avatar: results_get[0].avatar,
				username: results_get[0].username,
				password: results_get[0].password,
				name: results_get[0].name,
				phone: results_get[0].phone,
				salt: results_get[0].salt
			};
			const token = jwt.sign(payload, secretKey);
			// 刷新 redis 中的 token
			await better_chat.set(`token:${payload.username}`, token, 'EX', 60 * 60 * 24 * 14); // 有效期为 14 天
			// 通知好友刷新本人信息

			const data = {
				token: token,
				info: {
					id: results_get[0].id,
					avatar: results_get[0].avatar,
					username: results_get[0].username,
					name: results_get[0].name,
					phone: results_get[0].phone,
					created_at: new Date(results_get[0].created_at)
						.toLocaleString('zh-CN', { hour12: false })
						.replace(/\//g, '-'),
					signature: results_get[0].signature
				}
			};
			return RespData(res, data);
		}
	} catch {
		return RespError(res, CommonStatus.SERVER_ERR);
	}
};
/**
 * 登录成功后初始化用户的通知管道（websocket连接信息全局存储）, 用于通知用户好友列表的更新
 */
const initUserNotification = async (ws, req) => {
	const url = req.url.split('?')[1];
	const params = new URLSearchParams(url);
	const curUsername = params.get('username');
	LoginRooms[curUsername] = {
		ws: ws,
		status: false // 表示用户是否正在音视频通话中
	};
	// 通知当前登录的所有好友进行好友列表更新（目前处理方式是通知所有已登录用户，后续可以优化）
	for (const username in LoginRooms) {
		if (username === curUsername) continue;
		NotificationUser({ receiver_username: username, name: 'friendList' });
	}
	// 监听 websocket 关闭事件（比如用户关闭页面或者退出登录等）
	ws.on('close', () => {
		if (LoginRooms[curUsername]) {
			delete LoginRooms[curUsername];
			// 通知当前登录的所有好友进行好友列表更新（目前处理方式是通知所有已登录用户，后续可以优化）
			for (const username in LoginRooms) {
				NotificationUser({ receiver_username: username, name: 'friendList' });
			}
		}
	});
};

module.exports = {
	login,
	logout,
	register,
	forgetPassword,
	updateInfo,
	initUserNotification
};
