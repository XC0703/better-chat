/* global LoginRooms */
const { v4: uuidv4 } = require('uuid');

const { CommonErrStatus } = require('../../utils/error');
const { RespData, RespSuccess, RespError } = require('../../utils/resp');
const { NotificationUser } = require('../../utils/notification');
const { Query } = require('../../utils/query');

// 查询分组下的好友信息
const getFriendByGroup = async group_id => {
	try {
		const sql = `SELECT * FROM friend WHERE group_id = ?`;
		const results = await Query(sql, [group_id]);
		return results;
	} catch {
		throw new Error('查询失败');
	}
};
// 查询某个用户下的所有好友（数组平铺）
const getFriendByUser = async user_id => {
	try {
		const friends = [];
		// 获取用户的所有分组
		const sql = `SELECT id FROM friend_group WHERE user_id = ?`;
		const results = await Query(sql, [user_id]);
		for (const group of results) {
			const results = await getFriendByGroup(group.id);
			friends.push(...results);
		}
		return friends;
	} catch {
		throw new Error('查询失败');
	}
};
// 添加好友
const addFriendRecord = async friend_info => {
	try {
		const sql = `INSERT INTO friend SET ?`;
		const results = await Query(sql, friend_info);
		if (results.affectedRows === 1) {
			return '添加成功';
		} else {
			throw new Error('添加失败');
		}
	} catch {
		throw new Error('添加失败');
	}
};

/**
 * 查询用户的基本逻辑：
 * 1. 查询用户表, 模糊查询
 * 2. 判断查询出来的数据中, 判断是否存在已经好友的现象
 * 3. 筛选出已经是好友的和不是好友的，非好友的才能添加
 */
const searchUser = async (req, res) => {
	// 获取当前登录的用户信息、模糊查询关键字
	const sender = req.user;
	const { username } = req.query;
	if (!(sender && username)) {
		return RespError(res, CommonErrStatus.PARAM_ERR);
	}
	try {
		const sql_get_user = `SELECT id, name, username, avatar FROM user WHERE username LIKE ?`;
		const results_user = await Query(sql_get_user, [`%${username}%`]);
		// 获取当前用户的所有好友
		const friends = await getFriendByUser(sender.id);
		const searchList = [];
		if (results_user.length !== 0) {
			for (const userInfo of results_user) {
				let flag = false;
				// 如果是自己，跳过
				if (userInfo.username === sender.username) {
					continue;
				}
				// 如果已经是好友，则增加标记
				for (const friend of friends) {
					if (friend.username === userInfo.username) {
						flag = true;
						break;
					}
				}
				// 返回的信息：昵称、用户名、用户 id、用户头像、是否是好友
				searchList.push({
					name: userInfo.name,
					username: userInfo.username,
					id: userInfo.id,
					avatar: userInfo.avatar,
					status: flag
				});
			}
		}
		return RespData(res, searchList);
	} catch {
		return RespError(res, CommonErrStatus.SERVER_ERR);
	}
};
/**
 * 添加好友的基本逻辑：
 * 1. 首先将好友添加到自己的好友列表中
 * 2. 然后将自己也插入到别人的好友列表中
 */
const addFriend = async (req, res) => {
	// 获取发送方信息、好友 id、好友用户名、好友头像（注意：好友备注及好友分组是默认值）
	const sender = req.user;
	const { id, username, avatar } = req.body;
	if (!(sender && id && username && avatar)) {
		return RespError(res, CommonErrStatus.PARAM_ERR);
	}
	try {
		const uuid = uuidv4();
		// 获取接收方/自己的所有分组方便插入到默认分组中
		const sql_get_group = `SELECT id FROM friend_group WHERE user_id = ?`;
		// 将好友添加到自己的好友列表中并通知对方, 让其好友列表进行更新
		const results_receiver = await Query(sql_get_group, [sender.id]);
		const info_receiver = {
			user_id: id,
			username: username,
			avatar: avatar,
			online_status: LoginRooms[username] ? 'online' : 'offline',
			remark: username,
			group_id: results_receiver[0].id,
			room: uuid
		};
		await addFriendRecord(info_receiver);
		NotificationUser({ receiver_username: username, name: 'friendList' });
		// 将自己添加到好友的好友列表中并通知自己，让好友列表进行更新
		const results_sender = await Query(sql_get_group, [id]);
		const info_sender = {
			user_id: sender.id,
			username: sender.username,
			avatar: sender.avatar,
			online_status: LoginRooms[sender.username] ? 'online' : 'offline',
			remark: sender.name,
			group_id: results_sender[0].id,
			room: uuid
		};
		await addFriendRecord(info_sender);
		NotificationUser({ receiver_username: sender.username, name: 'friendList' });
		return RespSuccess(res);
	} catch {
		return RespError(res, CommonErrStatus.SERVER_ERR);
	}
};
/**
 * 获取好友列表的基本逻辑：
 * 1. 根据当前用户的 id 获取其所有好友分组的 id 和 name
 * 2. 然后查询各个分组下的好友，最后拼接在一起返回
 */
const getFriendList = async (req, res) => {
	try {
		const sender = req.user;
		const sql = `SELECT id, name FROM friend_group WHERE user_id = ?`;
		// 获取当前用户的所有分组
		const results = await Query(sql, [sender.id]);
		const friendList = [];
		if (results.length !== 0) {
			// 获取每个分组下的好友
			for (const result of results) {
				const groupFriends = { name: result.name, online_counts: 0, friend: [] };
				const friends = await getFriendByGroup(result.id);
				// 在线好友数量
				for (const friend of friends) {
					groupFriends.friend.push(friend);
					if (friend.online_status === 'online') {
						groupFriends.online_counts++;
					}
				}
				friendList.push(groupFriends);
			}
		}
		return RespData(res, friendList);
	} catch {
		return RespError(res, CommonErrStatus.SERVER_ERR);
	}
};
/**
 * 根据好友 id 获取好友信息的基本逻辑：
 * 1. 由于前端传给后端的只是一个friend表的id，若一个接口既要获取到完整的好友个人信息、又要获取到好友所在的分组，
 * 2. 则需要联表查询（friend表与user表通过user_id可进行关联，friend表与friend_group表通过group_id可进行关联）
 */
const getFriendById = async (req, res) => {
	const { id } = req.query;
	if (!id) {
		return RespError(res, CommonErrStatus.PARAM_ERR);
	}
	try {
		const sql = `
			SELECT 
				f.id AS friend_id,
				f.user_id AS friend_user_id,
				f.online_status,
				f.remark,
				f.group_id,
				fg.name AS group_name,
				f.room,
				f.unread_msg_count,
				u.username,
				u.avatar,
				u.phone,
				u.name,
				u.signature
			FROM
				friend AS f
			JOIN
				user AS u ON f.user_id = u.id
			JOIN
				friend_group AS fg ON f.group_id = fg.id
			WHERE
				f.id = ?
		`;
		const results = await Query(sql, [id]);
		if (results.length !== 0) {
			return RespData(res, results[0]);
		}
	} catch {
		return RespError(res, CommonErrStatus.SERVER_ERR);
	}
};
/**
 * 获取当前用户的分组列表
 */
const getFriendGroupList = async (req, res) => {
	const user_id = req.user.id;
	if (!user_id) {
		return RespError(res, CommonErrStatus.PARAM_ERR);
	}
	try {
		const sql = `SELECT * FROM friend_group WHERE user_id = ?`;
		const results = await Query(sql, [user_id]);
		return RespData(res, results);
	} catch {
		return RespError(res, CommonErrStatus.SERVER_ERR);
	}
};
/**
 * 添加好友分组
 */
const createFriendGroup = async (req, res) => {
	const friend_group = req.body;
	if (!friend_group) {
		return RespError(res, CommonErrStatus.PARAM_ERR);
	}
	try {
		const sql = `INSERT INTO friend_group SET ?`;
		const results = await Query(sql, friend_group);
		if (results.affectedRows === 1) {
			return RespSuccess(res);
		}
	} catch {
		return RespError(res, CommonErrStatus.SERVER_ERR);
	}
};
/**
 * 修改好友信息（备注、分组）
 */
const updateFriend = async (req, res) => {
	const { friend_id, remark, group_id } = req.body;
	if (!(friend_id && remark && group_id)) {
		return RespError(res, CommonErrStatus.PARAM_ERR);
	}
	try {
		const sql = `UPDATE friend SET remark = ?, group_id = ? WHERE id = ?`;
		const results = await Query(sql, [remark, group_id, friend_id]);
		if (results.affectedRows === 1) {
			return RespSuccess(res);
		}
	} catch {
		return RespError(res, CommonErrStatus.SERVER_ERR);
	}
};

module.exports = {
	getFriendList,
	getFriendGroupList,
	createFriendGroup,
	searchUser,
	addFriend,
	getFriendById,
	updateFriend
};
