/* global process */

/**
 * 定义全局登录用户房间
 */
global.LoginRooms = {};

/**
 * 引入 app 并启动服务
 */
const expressWs = require('express-ws');
const app = require('./controller/app');
const port = process.env.PORT || 3000;
app.listen(port, () => {
	// eslint-disable-next-line no-console
	console.log(`Server listening on port ${port}`);
});

/**
 * 设置最大传输文件大小 5G
 */
const http = require('http');
const server = http.createServer(app);
expressWs(app, server, { wsOptions: { maxPayload: 5 * 1024 * 1024 * 1024 } });
