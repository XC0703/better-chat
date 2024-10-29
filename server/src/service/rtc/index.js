/* global LoginRooms */
const { CommonStatus } = require('../../utils/status');
const { RespData, RespError } = require('../../utils/resp');
const { Query } = require('../../utils/query');

const ChatRTCRooms = {}; // 全局变量存储聊天室房间，每个房间是一个对象，对象的键是用户名 username，值是 WebSocket 实例

// 发送给房间内其它人
const broadcastSocket = (username, room, msg, isNeedCalling = true) => {
	for (const key in ChatRTCRooms[room]) {
		if (key === username) {
			continue;
		}
		const ws = ChatRTCRooms[room][key];
		if (ws) {
			// isNeedCalling 为 true 时，需要对方正在通话状态才发送消息，否则不发送
			const shouldSend = isNeedCalling ? !!LoginRooms[key].status : true;
			if (shouldSend) {
				ws.send(JSON.stringify(msg));
			}
		}
	}
};

// 根据好友 username 获取好友相关信息
const getFriendByUsername = async (friend_username, self_username) => {
	try {
		const sql = `
			SELECT
				*
			FROM
				friend
			WHERE
				username = ?
			AND group_id IN (
				SELECT
					id
				FROM
					friend_group
				WHERE
					username = ?
			)
		`;
		const results = await Query(sql, [friend_username, self_username]);
		if (results.length !== 0) {
			return results[0];
		}
	} catch {
		throw new Error('查询失败');
	}
};

/**
 * 音视频聊天的基本逻辑：(参考博客：https://segmentfault.com/a/1190000041614675)
 * 1、邀请人点击音视频按钮，建立 ws 连接并向对方发送 create_room 指令，判断能不能进行通话，能则通知好友打开音视频通话界面，不能则返回 connect_fail 指令及原因
 * 2、被邀请人收到 create_room 指令后，打开音视频通话界面并建立自己的 ws 连接，向邀请人发送 new_peer 指令
 * 3、邀请人收到 new_peer 指令后，创建和对方进行通话的 PC 通道，进入媒体协商环节（主要指 SDP 交换)，设置自己的 SDP，发送 offer 指令和自己的 SDP（媒体信息）给对方
 * 4、被邀请人收到 offer 指令后，设置自己和邀请人的 SDP，发送 answer 指令和自己的 SDP（媒体信息）给邀请人
 * 5、邀请人收到 answer 指令后，设置被邀请人的 SDP，此时双方的 SDP 设置完毕，可以进行 ICE（网络信息） 设置，进入网络连接环节
 * 6、双方互相发送 ice_candidate 指令和网络信息，设置对方的网络信息
 * 7、双方的网络信息设置完毕，可以进行音视频通话
 * 8、群音视频聊天时，邀请人是向所有群友发送邀请（一对多），每个收到邀请的群友同意（即向房间内其它人发送 new_peer 指令，一对多）之后，之后的通话建立过程即重复上述的3到7步（一对一）
 */
const connectRTC = async (ws, req) => {
	const url = req.url.split('?')[1];
	const params = new URLSearchParams(url);
	const room = params.get('room');
	const username = params.get('username');
	const type = params.get('type');
	if (!(room && username && type)) {
		ws.close();
		return;
	}
	try {
		if (!ChatRTCRooms[room]) {
			ChatRTCRooms[room] = {};
		}
		ChatRTCRooms[room][username] = ws;
		ws.on('message', async data => {
			const message = JSON.parse(data); // 服务端接收到的 message 包含 name、mode、callReceiverList、data、receiver，其中只有 name 指令名称是必须收到的，mode 和 callReceiverList 是 create_room 时收到的，data、receiver 是 offer、answer、ice_candidate 时收到的
			const { callReceiverList } = message;
			let msg;
			switch (message.name) {
				/**
				 * create_room：邀请人发送邀请，被邀请人接收邀请 ———— 由邀请人向被邀请人通知
				 * 1. 如果是私聊，则判断好友是否在线、是否空闲，能则通知对方打开音视频通话界面，不能则返回 connect_fail 及原因
				 * 2. 如果是群聊，遍历所有的被邀请者，判断是否在线，是否空闲，无法邀请的删除，之后更新 callReceiverList，给所有在线且空闲的被邀请人发送邀请通知
				 * 3. 此时的邀请通知是通过 LoginRooms 存储的 ws 连接实例实现
				 * 4. 被通知方要拿到聊天房间内其它人的信息（私聊时只有邀请人一个人，群聊时有邀请人和其它被邀请人），方便后续用到
				 */
				case 'create_room':
					if (!LoginRooms[username]) {
						ws.send(
							JSON.stringify({
								name: 'connect_fail',
								reason: '你已经下线了!!!'
							})
						);
						return;
					}
					if (LoginRooms[username].status) {
						ws.send(
							JSON.stringify({
								name: 'connect_fail',
								reason: '你正在通话中, 请勿发送其他通话请求...'
							})
						);
						return;
					}
					// 私聊时
					if (type === 'private') {
						if (!LoginRooms[callReceiverList[0].username]) {
							ws.send(JSON.stringify({ name: 'connect_fail', reason: '对方当前不在线!!!' }));
							return;
						}
						if (LoginRooms[callReceiverList[0].username].status) {
							ws.send(JSON.stringify({ name: 'connect_fail', reason: '对方正在通话中!!!' }));
							return;
						}
					}
					// 群聊时
					if (type === 'group') {
						// 群聊时的处理较为复杂，需要遍历所有的接收者（记得先排除邀请方），判断是否在线，是否空闲，无法邀请的删除，之后更新 callReceiverList
						for (let i = 0; i < callReceiverList.length; i++) {
							const receiver_username = callReceiverList[i].username;
							if (receiver_username !== username) {
								if (!LoginRooms[receiver_username]) {
									callReceiverList.splice(i, 1);
									i--;
									continue;
								}
								if (LoginRooms[receiver_username].status) {
									callReceiverList.splice(i, 1);
									i--;
									continue;
								}
							}
						}
						// 如果此时没有可以通话的人 (即此时的 callReceiverList 里只有邀请方自己)
						if (callReceiverList.length === 1) {
							ws.send(JSON.stringify({ name: 'connect_fail', reason: '当前没有可以通话的人!!!' }));
							return;
						}
					}

					// 设置当前用户通话状态
					LoginRooms[username].status = true;
					// 发送邀请 —— 利用 LoginRooms 存储的 ws 连接实例向在线且空闲的被邀请人发送邀请
					for (let i = 0; i < callReceiverList.length; i++) {
						const receiver_username = callReceiverList[i].username;
						if (receiver_username === username) {
							continue;
						}
						// 每个被邀请人都要拿到聊天房间内其它人的信息（即将当前的 callReceiverList 进行处理：排除自己和加上邀请方），方便后续用到
						// 排除自己较为简单，即将 callReceiverList 进行过滤即可
						// 私聊时加上邀请方较为复杂，因为此时邀请方不在 callReceiverList 中，需要单独加上
						const newCallReceiverList = callReceiverList.filter(
							item => item.username !== receiver_username
						);
						if (type === 'private') {
							const friendInfo = await getFriendByUsername(username, receiver_username); // 此时邀请方是当前 receiver 的好友
							newCallReceiverList.push({
								username: username,
								avatar: friendInfo.avatar,
								alias: friendInfo.remark
							});
						}
						msg = {
							name: 'create_room',
							room: room,
							mode: message.mode,
							callReceiverList: newCallReceiverList
						};
						LoginRooms[receiver_username].ws.send(JSON.stringify(msg));
					}
					break;
				/**
				 * new_peer：告诉房间内其他人自己要进入房间
				 */
				case 'new_peer':
					msg = {
						name: 'new_peer',
						sender: username
					};
					// 设置当前用户通话状态
					LoginRooms[username].status = true;
					broadcastSocket(username, room, msg);
					break;
				/**
				 * offer：发送自己 offer 信息给进入房间的新人（ offer 信息包含自己的 SDP 信息）
				 */
				case 'offer':
					msg = {
						name: 'offer',
						data: message.data,
						sender: username
					};
					ChatRTCRooms[room][message.receiver].send(JSON.stringify(msg));
					break;
				/**
				 * answer：此时已收到并设置对方发送过来的 SDP 后，也发送自己的 SDP 给对方
				 */
				case 'answer':
					msg = {
						name: 'answer',
						data: message.data,
						sender: username
					};
					ChatRTCRooms[room][message.receiver].send(JSON.stringify(msg));
					break;
				/**
				 * ice_candidate：设置对方的 candidate ———— 双方都可能收到，此时双方的 ICE 设置完毕，可以进行音视频通话
				 */
				case 'ice_candidate':
					msg = {
						name: 'ice_candidate',
						data: message.data,
						sender: username
					};
					ChatRTCRooms[room][message.receiver].send(JSON.stringify(msg));
					break;
				/**
				 * 拒绝 / 挂断通话
				 */
				case 'reject':
					msg = {
						name: 'reject',
						sender: username
					};
					broadcastSocket(username, room, msg);
					delete ChatRTCRooms[room][username];
					LoginRooms[username].status = false;
					break;
			}
		});
		ws.on('close', () => {
			if (ChatRTCRooms[room][username]) {
				delete ChatRTCRooms[room][username];
				LoginRooms[username].status = false;
			}
		});
	} catch {
		ws.send(
			JSON.stringify({
				name: 'connect_fail',
				reason: '服务有误!!!'
			})
		);
		ws.close();
		return;
	}
};

/**
 * 获取当前房间内正在通话的所有人
 */
const getRoomMembers = async (req, res) => {
	const url = req.url.split('?')[1];
	const params = new URLSearchParams(url);
	const room = params.get('room');
	const { username } = req.user;
	if (!room) {
		return RespError(res, CommonStatus.PARAM_ERR);
	}
	try {
		const data = [];
		for (const key in ChatRTCRooms[room]) {
			if (key === username || !LoginRooms[key].status) {
				continue;
			}
			data.push(key);
		}
		return RespData(res, data);
	} catch {
		return RespError(res, CommonStatus.SERVER_ERR);
	}
};

module.exports = {
	connectRTC,
	getRoomMembers
};
