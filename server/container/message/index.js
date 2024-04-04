/* global Buffer process NotificationUser */
module.exports = {
	getChatList,
	connectChat
};

const path = require('path');
const { RespServerErr } = require('../../model/error');
const { RespError, RespData } = require('../../model/resp');
const { Query } = require('../../db/query');
const fs = require('fs');
const { generateRandomString, notExitCreate } = require('../../utils/file');
const { formatBytes } = require('../../utils/format');
const rooms = {};

/**
 * 获取消息列表 -- 私聊类型
 * 1. 先获取好友聊天列表
 * 2. 先根据好友分组表中获取当前用户的所有好友分组 id, 然后根据分组 id 获取指定房间的用户的所有聊天记录, 在根据消息统计表获取最后一次发送消息的时间
 * 3. 如何根据对方 id 和房间号获取未读消息的数量
 * 4. 根据房间号和创建时间获取最后一次消息内容
 * 获取消息列表 -- 群聊类型
 * 1. 根据用户 id 去查询加入的所有群聊 id（gm 查询子表）
 * 2. 再根据群聊 id 去查询群聊的信息，群聊 room（联合查询，gc 查询子表）
 * 3. 再根据群聊 room 去查询群聊的最后一条消息（联合查询，msg_sta 查询子表）
 */
async function getChatList(req, res) {
	const data = [];
	const id = req.user.id;
	// 获取所有好友聊天列表
	const sqlFriend = `SELECT user_id as receiver_id,remark as name,username as receiver_username,f.room,msg_sta.updated_at from friend as f,(SELECT id FROM friend_group WHERE user_id=?) as fp,message_statistics as msg_sta WHERE fp.id=f.group_id and f.room=msg_sta.room  ORDER BY msg_sta.updated_at DESC;`;
	const sqlfriendRes = await Query(sqlFriend, [id]);
	// 查询数据失败
	if (sqlfriendRes.err) return RespError(res, RespServerErr);
	let results = sqlfriendRes.results;
	for (const index in results) {
		const item = results[index];
		// 获取未读消息的数量
		let sql = `SELECT count(*) as unreadCount FROM message WHERE room=? and receiver_id=? and status=0`;
		let r = await Query(sql, [item.room, id]);
		results[index].unreadCount = r.results[0].unreadCount;
		// 获取最后一条消息
		sql = `SELECT content as lastMessage,media_type as type FROM message WHERE room=? ORDER BY created_at DESC LIMIT 1`;
		r = await Query(sql, [item.room, id]);
		results[index].lastMessage = r.results[0].lastMessage;
		results[index].type = r.results[0].type;
		// 获取好友头像
		sql = `SELECT  avatar from user where id=?`;
		r = await Query(sql, [item.receiver_id]);
		results[index].avatar = r.results[0].avatar;
	}
	// 处理 一开始查询结果可能为空 results 的值 undefined 导致报错
	if (results) {
		data.push(...results);
	}

	// 获取所有群聊聊天列表
	const sqlGroupChat =
		'SELECT gc.id as receiver_id,avatar,name,gc.room,msg_sta.updated_at FROM group_chat as gc,(SELECT * FROM group_members WHERE user_id=?) as gm,message_statistics as msg_sta  WHERE gc.id=gm.group_id and gc.room=msg_sta.room  ORDER BY msg_sta.updated_at DESC;';
	const sqlGroupChatRes = await Query(sqlGroupChat, [id]);
	// 查询数据失败
	if (sqlGroupChatRes.err) return RespError(res, RespServerErr);

	results = sqlGroupChatRes.results;
	for (const index in results) {
		const item = results[index];
		// 获取未读消息的数量 (因为是群聊消息, 此时的 receiver_id 为 group_id，因此目前无法处理，先设置为 0)
		results[index].unreadCount = 0;

		// 获取最后一条消息
		const sql = `SELECT content as lastMessage,media_type as type FROM message WHERE room=? ORDER BY created_at DESC LIMIT 1`;
		const r = await Query(sql, [item.room, id]);
		results[index].lastMessage = r.results[0]?.lastMessage;
		results[index].type = r.results[0]?.type;
	}
	if (results) {
		data.push(...results);
	}

	// 根据时间排序
	data.sort((a, b) => {
		const t1 = new Date(a.updated_at).getTime();
		const t2 = new Date(b.updated_at).getTime();

		if (t1 < t2) {
			return 1; // a 应该排在 b 前面
		} else if (t1 > t2) {
			return -1; // a 应该排在 b 后面
		} else {
			return 0; // a 和 b 相等，位置不变
		}
	});

	return RespData(res, data);
}

/**
 * 建立聊天
 * 需要获取信息: 发送人 ID, 接收人 ID, 聊天内容, 房间号, 头像, 内容的类型, 文件大小, 创建时间
 * 1. 获取房间号和对方 id / 群聊 id
 * 2. 根据房间号获取所有聊天记录
 * 3. 将当前用户的所有未读变成已读
 * 4. 监听 message
 * 5. 消息类型目前分为 text(文本),image(图片),video(视频),file(文件)
 * 6.text 文本不做任何处理
 * 7. image(图片),video(视频),file(文件) 先获取文件名, 在判断存储的目录是否存在, 不存在则创建, 然后将其进行保存, 并发送相关存储路径给前端
 * 8. 插入数据到 message 表中
 * 9. 并修改当前房间的最早一次的聊天时间
 *
 */
async function connectChat(ws, req) {
	// 获取 name 和 room（聊天类型默认传入为 private，group 只是为了方便后续群聊功能的扩展）
	const url = req.url.split('?')[1];
	const params = new URLSearchParams(url);
	const room = params.get('room');
	const id = params.get('id');
	const type = params.get('type');
	// 重置聊天房间
	if (!rooms[room]) {
		rooms[room] = {};
	}
	rooms[room][id] = ws;
	// 获取历史消息
	let sql;
	let resp;
	if (type === 'group') {
		sql =
			'SELECT gm.nickname,m.*,u.avatar FROM (SELECT sender_id, receiver_id, content, room, media_type,message.created_at FROM message WHERE `room` =? AND `type` = ?) AS m LEFT JOIN user as u ON u.`id`=m.`sender_id` LEFT JOIN group_members as gm on gm.group_id=? and user_id=u.`id` ORDER BY created_at ASC';
		resp = await Query(sql, [room, type, id]);
	} else {
		sql =
			'SELECT m.*,u.avatar FROM (SELECT sender_id, receiver_id, content, room, media_type, file_size, message.created_at FROM message WHERE room =? AND type = ?  ORDER BY created_at ASC) AS m LEFT JOIN user as u ON u.id=m.sender_id';
		resp = await Query(sql, [room, type]);
	}
	const results = resp.results;
	const historyMsg = results.map(item => {
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
	sql = 'update message set status=1 where receiver_id=? and room=? and type=? and status=0';
	await Query(sql, [id, room, type]);
	let fileInfo = null;
	let receivedSize = 0;
	let writeStream = null;
	ws.on('message', async Resp_data => {
		const message = JSON.parse(Resp_data);
		let fileContent, fileSuffix, filename;

		// 判断其类型
		const msg = {
			sender_id: message.sender_id,
			receiver_id: message.receiver_id,
			type: type,
			media_type: message.type,
			room: room,
			file_size: 0
		};
		switch (message.type) {
			case 'text':
				msg.content = message.content;
				break;
			case 'image':
				fileContent = Buffer.from(message.content);
				fileSuffix = message.filename
					.substring(message.filename.lastIndexOf('.') + 1)
					.toLowerCase();
				filename = generateRandomString(32) + '.' + fileSuffix;
				notExitCreate(
					path.join(process.cwd(), `uploads/message/${room.replace(/-/g, '_')}/images`)
				);
				fs.writeFileSync(
					path.join(process.cwd(), `uploads/message/${room.replace(/-/g, '_')}/images/${filename}`),
					fileContent
				);
				msg.content = `/uploads/message/${room.replace(/-/g, '_')}/images/${filename}`;
				message.content = `/uploads/message/${room.replace(/-/g, '_')}/images/${filename}`;
				break;
			case 'video':
				fileContent = Buffer.from(message.content);
				fileSuffix = message.filename
					.substring(message.filename.lastIndexOf('.') + 1)
					.toLowerCase();
				filename = generateRandomString(32) + '.' + fileSuffix;
				notExitCreate(path.join(process.cwd(), `uploads/message/${room.replace(/-/g, '_')}/video`));
				fs.writeFileSync(
					path.join(process.cwd(), `uploads/message/${room.replace(/-/g, '_')}/video/${filename}`),
					fileContent
				);
				msg.content = `/uploads/message/${room.replace(/-/g, '_')}/video/${filename}`;
				message.content = `/uploads/message/${room.replace(/-/g, '_')}/video/${filename}`;
				break;
			case 'file':
				if (message.fileType === 'start') {
					receivedSize = 0;
					fileInfo = JSON.parse(message.fileInfo);
					const filePath = path.join(
						process.cwd(),
						`uploads/message/${room.replace(/-/g, '_')}/file`
					);
					// 判断文件是否已经有过传输，如果有则断点续传（TODO：由于不准确，待完善）
					// if (fs.existsSync(path.join(filePath, message.filename))) {
					// 	// 这个是已经传输的文件大小，应该传回给客户端，让客户端从这个大小开始传输
					// 	const transmittedSize = fs.statSync(path.join(filePath, message.filename)).size;
					// }
					notExitCreate(filePath);
					writeStream = fs.createWriteStream(
						path.join(
							process.cwd(),
							`uploads/message/${room.replace(/-/g, '_')}/file/${message.filename}`
						)
					);
					return;
				} else if (message.fileType === 'upload') {
					fileContent = Buffer.from(message.content);
					// 接收文件块并写入文件
					writeStream.write(fileContent);
					receivedSize += fileContent.length;
					// 如果接收完整个文件，则关闭文件流并发送上传成功消息
					if (receivedSize === fileInfo.fileSize) {
						writeStream.end(async () => {
							msg.content = `/uploads/message/${room.replace(/-/g, '_')}/file/${message.filename}`;
							msg.file_size = receivedSize;
							message.content = `/uploads/message/${room.replace(/-/g, '_')}/file/${
								message.filename
							}`;
							if (rooms[room][message.receiver_id]) {
								msg.status = 1;
							} else {
								msg.status = 0;
							}
							sql = 'insert into message set ?';
							await Query(sql, msg);
							await checkAndModifyStatistics(room);
							message.created_at = new Date().toLocaleString('zh-CN', {
								timeZone: 'Asia/Shanghai'
							});
							message.file_size = formatBytes(msg.file_size);
							for (const key in rooms[room]) {
								rooms[room][key].send(JSON.stringify(message));
							}
							return;
						});
					}
					return;
				}
				break;
		}
		// 这里的处理存在纰漏，因为群聊时，message.receiver_id 是群聊 id，不是用户 id，所以无法判断对方是否在房间，且群聊信息存在很多个接收者，但消息表的结构设计导致一条消息只能有一个接收者，所以这里的处理是不完善的
		// 默认群聊消息都是已读状态
		if (type === 'group' || (type === 'private' && rooms[room][message.receiver_id])) {
			msg.status = 1;
		} else {
			msg.status = 0;
		}
		sql = 'insert into message set ?';
		await Query(sql, msg);
		await checkAndModifyStatistics(room);
		message.created_at = new Date().toLocaleString('zh-CN', {
			timeZone: 'Asia/Shanghai'
		});
		message.file_size = formatBytes(msg.file_size);
		// 通知属于该房间的所有人（当前的 websocket 连接）
		for (const key in rooms[room]) {
			rooms[room][key].send(JSON.stringify(message));
		}
		// 通知对方有新消息以便刷新消息列表（登录时的 websocket 连接）
		if (type === 'group') {
			// 通过群聊 id 获取所有成员 id
			const sql = 'select user_id from group_members where group_id = ?';
			const result = await Query(sql, [message.receiver_id]);
			for (const key in result.results) {
				// 排除自己
				if (result.results[key].user_id !== message.sender_id) {
					NotificationUser({
						receiver_id: result.results[key].user_id,
						name: 'chatList'
					});
				}
			}
		} else {
			NotificationUser({ receiver_id: message.receiver_id, name: 'chatList' });
		}
	});
	ws.on('close', function () {
		if (rooms[room][id]) {
			delete rooms[room][id];
		}
	});
}

// 检查 message_statistics 是否存在某条记录，如果不存在则创建后才修改，如果存在则直接修改
const checkAndModifyStatistics = async room => {
	let sql = 'select * from message_statistics where room = ?';
	const result = await Query(sql, [room]);
	if (result.results.length === 0) {
		sql = 'insert into message_statistics set ?';
		await Query(sql, { room: room, total: 0 });
	}
	sql = 'update message_statistics set total = total + 1 where room = ?';
	await Query(sql, [room]);
};
