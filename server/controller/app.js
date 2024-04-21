/**
 * 用于启动 node 服务并处理相关路由
 */
const express = require('express');
const expressWs = require('express-ws');
const app = express();
expressWs(app);

/**
 * 解决跨域
 */
const cors = (req, res, next) => {
	// 设置允许跨域的域名，* 代表允许任意域名跨域
	res.header('Access-Control-Allow-Origin', '*');
	// 允许的 header 类型
	res.header('Access-Control-Allow-Headers', '*');
	res.header('Access-Control-Allow-Credentials', true);
	// 跨域允许的请求方式
	res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
	res.header('Content-Type', 'application/json;charset=utf-8');

	if (req.method.toLowerCase() === 'options')
		res.sendStatus(200); // 让 options 尝试请求快速结束
	else next();
};

/**
 * 静态文件访问的中间件，利用 Express 托管静态文件，它使得从指定的目录（这里是uploads）中提供文件。
 */
const staticDownload = (req, res, next) => {
	// 设置允许跨域的域名，* 代表允许任意域名跨域
	res.header('Access-Control-Allow-Origin', '*');
	// 允许的 header 类型
	res.header('Access-Control-Allow-Headers', '*');
	res.header('Access-Control-Allow-Credentials', true);
	// 跨域允许的请求方式
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS, HEAD');
	res.header('content-type', 'application/octet-stream');
	if (req.method.toLowerCase() === 'options')
		res.sendStatus(200); // 让 options 尝试请求快速结束
	else next();
};
app.use('/uploads', staticDownload, express.static('uploads'));

/**
 * 处理 HTTP 请求体中的参数，将请求体解析成 JSON 对象或者 URL-encoded 格式，并限制请求体大小为 100mb
 */
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '100mb' })); //parse application/json
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true })); //parse application/json

/**
 * 注册路由
 */
const indexRouter = require('./routes/auth')();
const friendRouter = require('./routes/friend')();
const messageRouter = require('./routes/message')();
const groupRouter = require('./routes/group')();
const rtcRouter = require('./routes/rtc')();
app.use('', cors); // 防止浏览器的预检请求导致控制台报的跨域错误
app.use('/api/chat/v1/auth', cors, indexRouter);
app.use('/api/chat/v1/friend', cors, friendRouter);
app.use('/api/chat/v1/message', cors, messageRouter);
app.use('/api/chat/v1/group', cors, groupRouter);
app.use('/api/chat/v1/rtc', cors, rtcRouter);
module.exports = app;
