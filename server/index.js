/* global process */
/**
 * 初始化所有的全局变量和全局方法
 */
const initGlobal = require('./global');
initGlobal();

/**
 * 引入 app 并启动服务
 */
const expressWs = require('express-ws');
const app = require('./app/app');
const port = process.env.PORT || 3000;
app.listen(port, () => {
	// eslint-disable-next-line no-console
	console.log(`Server listening on port ${port}`);
});

/**
 * 设置最大传输文件大小
 */
const http = require('http');
const server = http.createServer(app);
expressWs(app, server, { wsOptions: { maxPayload: 5 * 1024 * 1024 * 1024 } });
