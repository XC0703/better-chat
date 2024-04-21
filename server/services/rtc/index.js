/* global LoginRooms */
const ChatRTCRooms = {}; // 全局变量存储聊天室房间，每个房间是一个对象，对象的键是用户名 username，值是 WebSocket 实例

// 发送给其他人
const broadcastSocket = (username, room, msg) => {
	for (const key in ChatRTCRooms[room]) {
		if (key === username) {
			continue;
		}
		if (ChatRTCRooms[room][key]) {
			const ws = ChatRTCRooms[room][key];
			ws.send(JSON.stringify(msg));
		}
	}
};

/**
 * 建立音视频聊天的基本逻辑：
 * 1、邀请人点击音视频按钮，建立 ws 连接并建立创建自己的 RTCPeerConnection 连接实例，并向对方发送 createRoom 指令，判断能不能进行通话，能则通知好友打开音视频通话界面，不能则返回 notConnect 及原因
 * 2、被邀请人收到 createRoom 指令后，打开音视频通话界面并建立创建自己的 RTCPeerConnection 连接实例，向邀请人发送 new_peer 指令
 * 3、邀请人收到 new_peer 指令后，向被邀请人发送视频流和 offer 指令，offer 信息是邀请人发给被邀请人的 SDP（媒体信息）
 * 4、被邀请人收到视频流和 offer 指令后，向邀请人发送视频流和 answer 指令，answer 信息被邀请人发给邀请人的 SDP（媒体信息）
 * 5、邀请人收到 answer 指令后，设置被邀请人的 SDP，并向被邀请人发送 ice_candidate 指令和自己的 ICE（网络信息）
 * 6、被邀请人收到 ice_candidate 指令后，设置邀请人的 SDP，并向邀请人发送 ice_candidate 指令和自己的 ICE（网络信息）
 * 7、双方都收到 ice_candidate 指令后，双方的 ICE 设置完毕，可以进行音视频通话
 */
const singleRTCConnect = async (ws, req) => {
	const url = req.url.split('?')[1];
	const params = new URLSearchParams(url);
	const room = params.get('room');
	const username = params.get('username');
	if (!(room && username)) {
		ws.close();
		return;
	}
	try {
		if (!ChatRTCRooms[room]) {
			ChatRTCRooms[room] = {};
		}
		ChatRTCRooms[room][username] = ws;
		ws.on('message', async data => {
			const message = JSON.parse(data);
			let msg;
			let receiverWs;
			const { receiver_username } = message;
			switch (message.name) {
				// createRoom：给被邀请人发送创建房间的指令，判断能不能进行通话，能则通知好友打开音视频通话界面，不能则返回 notConnect 及原因 ———— 由邀请人向被邀请人通知
				case 'createRoom':
					if (!LoginRooms[receiver_username]) {
						ws.send(JSON.stringify({ name: 'notConnect', result: '对方当前不在线!!!' }));
						return;
					}
					if (LoginRooms[receiver_username].status) {
						ws.send(JSON.stringify({ name: 'notConnect', result: '对方正在通话中!!!' }));
						return;
					}
					if (LoginRooms[username].status) {
						ws.send(
							JSON.stringify({
								name: 'notConnect',
								result: '你正在通话中, 请勿发送其他通话请求...'
							})
						);
						return;
					}
					// 设置当前用户通话状态
					LoginRooms[username].status = true;
					// 发送邀请
					msg = {
						name: 'createRoom',
						sender_username: username,
						mode: message.mode
					};
					LoginRooms[receiver_username].ws.send(JSON.stringify(msg));
					break;
				// new_peer：邀请人接收到有新人进入房间, 则发送视频流和 offer 指令给新人，offer 信息是邀请人发给被邀请人的 SDP（媒体信息）———— 由被邀请人向邀请人通知
				case 'new_peer':
					msg = {
						name: 'new_peer',
						sender_username: username
					};
					broadcastSocket(username, room, msg);
					break;
				// offer：被邀请人收到邀请人的视频流和 offer 指令，发送 answer 给邀请人 ———— 由邀请人向被邀请人通知，answer 信息被邀请人发给邀请人的 SDP（媒体信息）
				case 'offer':
					msg = {
						name: 'offer',
						sender_username: username,
						data: message.data
					};
					receiverWs = ChatRTCRooms[room][message.receiver];
					receiverWs.send(JSON.stringify(msg));
					break;
				// answer：邀请人收到被邀请人的 answer 指令，设置被邀请人的 SDP ———— 由被邀请人向邀请人通知
				case 'answer':
					msg = {
						name: 'answer',
						sender_username: username,
						data: message.data
					};
					receiverWs = ChatRTCRooms[room][message.receiver];
					receiverWs.send(JSON.stringify(msg));
					break;
				// ice_candidate：设置对方的 candidate ———— 双方都可能收到，此时双方的 ICE 设置完毕，可以进行音视频通话
				case 'ice_candidate':
					// 接收 answer
					msg = {
						name: 'ice_candidate',
						sender_username: username,
						data: message.data
					};
					receiverWs = ChatRTCRooms[room][message.receiver];
					receiverWs.send(JSON.stringify(msg));
					break;
				// 被邀请方拒绝 ———— 两方都会收到
				case 'reject':
					msg = {
						name: 'reject',
						sender_username: username
					};
					broadcastSocket(username, room, msg);
					// 设置当前用户通话状态
					LoginRooms[username].status = false;
					break;
			}
		});
		ws.on('close', () => {
			if (ChatRTCRooms[room][username]) {
				delete ChatRTCRooms[room][username];
			}
		});
	} catch {
		ws.close();
		return;
	}
};

module.exports = {
	singleRTCConnect
};
