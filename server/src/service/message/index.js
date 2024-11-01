/* global */
const { CommonStatus } = require('../../utils/status');
const { RespData, RespError } = require('../../utils/resp');
const { formatBytes } = require('../../utils/format');
const { NotificationUser } = require('../../utils/notification');
const { Query } = require('../../utils/query');

const ChatRooms = {}; // 全局变量存储聊天室房间，每个房间是一个对象，对象的键是用户 id / 群聊 id，值是 WebSocket 实例

// 检查 message_statistics 是否存在某条记录，如果不存在则创建后才修改，如果存在则直接修改
const checkAndModifyStatistics = async room => {
	const sql_check = `SELECT * FROM message_statistics WHERE room = ?`;
	const results_check = await Query(sql_check, [room]);
	if (results_check.length === 0) {
		const sql_set = `INSERT INTO message_statistics SET ?`;
		await Query(sql_set, { room: room, total: 0 });
	}
	const sql_update = `UPDATE message_statistics SET total = total + 1 WHERE room = ?`;
	await Query(sql_update, [room]);
};

// 将处理后的消息写入数据库和发送给房间内的所有人(type 表示私聊或者群聊，room 表示房间号，msg 为写入数据库的消息，message 为发送出去的消息)
const writeAndSend = async (type, room, msg, message) => {
	// 将处理后的消息写入数据库和发送给房间内的所有人
	// 这里的处理存在纰漏，因为群聊时，message.receiver_id 是群聊 id，不是用户 id，所以无法判断对方是否在房间，且群聊信息存在很多个接收者，但消息表的结构设计导致一条消息只能有一个接收者，所以这里的处理是不完善的
	// 因此默认群聊消息都是已读状态
	// 写入数据库
	if (type === 'group' || (type === 'private' && ChatRooms[room][message.receiver_id])) {
		msg.status = 1;
	} else {
		msg.status = 0;
	}
	const sql_message = `INSERT INTO message SET ?`;
	await Query(sql_message, msg);
	await checkAndModifyStatistics(room);
	// 发送消息
	message.created_at = new Date().toLocaleString('zh-CN', {
		timeZone: 'Asia/Shanghai'
	});
	message.file_size = formatBytes(msg.file_size);
	for (const key in ChatRooms[room]) {
		ChatRooms[room][key].send(JSON.stringify(message));
	}
	// 通知对方有新消息以便刷新消息列表（登录时的 websocket 连接）
	if (type === 'group') {
		// 通过群聊 id 获取所有成员 id
		const sql = `SELECT user_id FROM group_members WHERE group_id = ?`;
		const results = await Query(sql, [message.receiver_id]);
		for (const key in results) {
			// 排除自己
			if (results[key].user_id !== message.sender_id) {
				NotificationUser({
					receiver_id: results[key].user_id,
					name: 'chatList'
				});
			}
		}
	} else {
		NotificationUser({ receiver_id: message.receiver_id, name: 'chatList' });
	}
};

/**
 * 获取聊天记录列表的逻辑：
 * 私聊类型
 * 1. 先获取好友聊天列表
 * 2. 先根据好友分组表中获取当前用户的所有好友分组 id, 然后根据分组 id 获取指定房间的用户的所有聊天记录, 在根据消息统计表获取最后一次发送消息的时间
 * 3. 如何根据对方 id 和房间号获取未读消息的数量
 * 4. 根据房间号和创建时间获取最后一次消息内容
 * 群聊类型
 * 1. 根据用户 id 去查询加入的所有群聊 id（gm 查询子表）
 * 2. 再根据群聊 id 去查询群聊的信息，群聊 room（联合查询，gc 查询子表）
 * 3. 再根据群聊 room 去查询群聊的最后一条消息（联合查询，msg_sta 查询子表）
 */
const getChatList = async (req, res) => {
	try {
		const data = [];
		const id = req.user.id;
		// 获取所有私聊聊天列表
		const sql_private = `
			SELECT 
				user_id AS receiver_id,
				remark AS name,
				username AS receiver_username,
				f.room,
				msg_sta.updated_at
			FROM 
				friend AS f,
				(SELECT 
					id
				FROM 
					friend_group
				WHERE 
					user_id = ?
				) AS fp, message_statistics AS msg_sta
			WHERE 
				fp.id = f.group_id AND f.room = msg_sta.room
			ORDER BY msg_sta.updated_at DESC;
		`;
		const results_private = await Query(sql_private, [id]);
		for (const index in results_private) {
			const item = results_private[index];
			// 获取私聊未读消息的数量
			const sql_unread = `
				SELECT count(*) AS unreadCount
				FROM message
				WHERE room = ?
					AND receiver_id = ?
					AND status=0
			`;
			const results_unread = await Query(sql_unread, [item.room, id]);
			results_private[index].unreadCount = results_unread[0].unreadCount;
			// 获取私聊最后一条消息
			const sql_last_private = `
				SELECT content AS lastMessage, media_type AS type
				FROM message
				WHERE room = ?
				ORDER BY created_at DESC LIMIT 1
			`;
			const results_last_private = await Query(sql_last_private, [item.room, id]);
			results_private[index].lastMessage = results_last_private[0].lastMessage;
			results_private[index].type = results_last_private[0].type;
			// 获取私聊好友头像
			const sql_avatar_private = `SELECT avatar from user where id = ?`;
			const results_avatar_private = await Query(sql_avatar_private, [item.receiver_id]);
			results_private[index].avatar = results_avatar_private[0].avatar;
		}
		// 处理一开始查询结果可能为空 results_private 的值 undefined 导致报错
		if (results_private) {
			data.push(...results_private);
		}

		// 获取所有群聊聊天列表
		const sql_group = `
			SELECT 
				gc.id AS receiver_id,
        avatar,
        name,
        gc.room,
        msg_sta.updated_at
			FROM group_chat AS gc,
				(SELECT *
				FROM group_members
				WHERE user_id = ?
				) AS gm, message_statistics AS msg_sta
			WHERE 
				gc.id = gm.group_id AND gc.room = msg_sta.room
			ORDER BY msg_sta.updated_at DESC;
		`;
		const results_group = await Query(sql_group, [id]);
		for (const index in results_group) {
			const item = results_group[index];
			// 获取群聊未读消息的数量 (因为是群聊消息, 此时的 receiver_id 为 group_id，因此目前无法处理，先设置为 0)
			results_group[index].unreadCount = 0;
			// 获取群聊最后一条消息
			const sql = `SELECT content as lastMessage, media_type as type FROM message WHERE room = ? ORDER BY created_at DESC LIMIT 1`;
			const results_last_group = await Query(sql, [item.room, id]);
			results_group[index].lastMessage = results_last_group[0].lastMessage;
			results_group[index].type = results_last_group[0].type;
		}
		if (results_group) {
			data.push(...results_group);
		}

		// 根据时间排序
		data.sort((a, b) => {
			const t1 = new Date(a.updated_at).getTime();
			const t2 = new Date(b.updated_at).getTime();

			if (t1 < t2) {
				return 1;
			} else if (t1 > t2) {
				return -1;
			} else {
				return 0;
			}
		});

		return RespData(res, data);
	} catch {
		return RespError(res, CommonStatus.SERVER_ERR);
	}
};
/**
 * 建立聊天的基本逻辑：
 * 需要获取信息: 发送人 ID, 接收人 ID, 聊天内容, 房间号, 头像, 内容的类型, 文件大小, 创建时间
 * 1. 获取房间号和对方 id / 群聊 id
 * 2. 根据房间号获取所有聊天记录
 * 3. 将当前用户的所有未读变成已读
 * 4. 监听 message
 * 5. 消息类型目前分为 text(文本), image(图片), video(视频), file(文件)
 * 6. text 文本不做任何处理
 * 7. image(图片), video(视频), file(文件) 先获取文件名, 在判断存储的目录是否存在, 不存在则创建, 然后将其进行保存, 并发送相关存储路径给前端
 * 8. 插入数据到 message 表中
 * 9. 并修改当前房间的最早一次的聊天时间
 * 10. 并将消息发送给对方
 */
const connectChat = async (ws, req) => {
	const url = req.url.split('?')[1];
	const params = new URLSearchParams(url);
	const room = params.get('room');
	const id = params.get('id');
	const type = params.get('type');
	if (!(room && id && type)) {
		ws.close();
		return;
	}
	try {
		// 重置聊天房间
		if (!ChatRooms[room]) {
			ChatRooms[room] = {};
		}
		ChatRooms[room][id] = ws;
		// 获取历史消息
		let results_msg;
		if (type === 'group') {
			const sql_group = `
			SELECT 
				gm.nickname,
        m.*,
        u.avatar
			FROM 
				(SELECT 
					sender_id,
					receiver_id,
					content,
					room,
					media_type,
					file_size,
					message.created_at
				FROM message
				WHERE room = ? AND type = ?
				) AS m
				LEFT JOIN user AS u
				ON u.id = m.sender_id
				LEFT JOIN group_members AS gm
				ON gm.group_id = ?
        AND user_id = u.id
				ORDER BY created_at ASC
		`;
			results_msg = await Query(sql_group, [room, type, id]);
		} else {
			const sql_private = `
			SELECT m.*,
        u.avatar
			FROM 
				(SELECT 
					sender_id,
					receiver_id,
					content,
					room,
					media_type,
					file_size,
					message.created_at
				FROM message
				WHERE room = ? AND type = ?
				ORDER BY created_at ASC
				) AS m
				LEFT JOIN user AS u
				ON u.id = m.sender_id
		`;
			results_msg = await Query(sql_private, [room, type]);
		}
		const historyMsg = results_msg.map(item => {
			return {
				sender_id: item.sender_id, // 发送者 id
				receiver_id: item.receiver_id, // 接受者 id
				content: item.content, // 文本消息内容，如果是图片、视频、文件消息则为文件路径
				room: item.room, // 房间号
				avatar: item.avatar, // 发送者头像
				type: item.media_type, // 媒体类型，枚举类型，可选值为’text’、‘image’、‘video’和’file’
				file_size: formatBytes(item.file_size), // 文件大小
				created_at: new Date(item.created_at).toLocaleString('zh-CN', {
					timeZone: 'Asia/Shanghai'
				}) // 消息创建时间，格式化为本地时间
			};
		});
		ws.send(JSON.stringify(historyMsg));
		// 进入房间时，将所有未读消息变成已读且通知更新
		const sql_set = `UPDATE message SET status = 1 WHERE receiver_id = ? AND room = ? AND type = ? AND status = 0`;
		await Query(sql_set, [id, room, type]);
		ws.on('message', async data => {
			const message = JSON.parse(data); // message 是接收到的消息，处理后会发送出去
			// msg 是存储到数据库的消息
			const msg = {
				sender_id: message.sender_id,
				receiver_id: message.receiver_id,
				content: message.content, // 文本消息内容，如果是图片、视频、文件消息则为文件路径
				room: room,
				type: type, // 私聊还是群聊，枚举类型，可选值为’private’和’group’
				media_type: message.type, // 媒体类型，枚举类型，可选值为’text’、‘image’、‘video’和’file’
				file_size: message.fileSize ? message.fileSize : 0, // 文本消息则统一为 0
				status: 0 // 0 未读 1 已读
			};
			// 消息写入和发送
			await writeAndSend(type, room, msg, message);
		});
		ws.on('close', () => {
			if (ChatRooms[room][id]) {
				delete ChatRooms[room][id];
			}
		});
	} catch {
		ws.close();
		return;
	}
};

module.exports = {
	getChatList,
	connectChat
};
