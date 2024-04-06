/* global Query LoginRooms */

// 通知对方（传入receiver_username或者receiver_id）
const NotificationUser = async data => {
	// 接收者
	let receiver_username = data.receiver_username;
	if (!receiver_username) {
		const sql = 'SELECT username FROM user where id=?';
		const { err, results } = await Query(sql, [data.receiver_id]);
		// eslint-disable-next-line no-console
		if (err) console.log('NotificationUser:', err);
		receiver_username = results[0].username;
	}
	if (LoginRooms[receiver_username]) {
		LoginRooms[receiver_username].ws.send(JSON.stringify(data));
	}
};

module.exports = {
	NotificationUser
};
