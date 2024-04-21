const jwt = require('jsonwebtoken');
const secretKey = 'xWbiNA3FqnK77MnVCj5CAcfA-VlXj7xoQLd1QaAme6l_t0Yp1TdHbSw';

const { CommonErrStatus } = require('./error');
const { RespError } = require('./resp');

// JWT 校验中间件
const authenticateToken = (req, res, next) => {
	// 获取 JWT 字符串
	const token = req.headers.authorization;
	if (!token) {
		return RespError(res, CommonErrStatus.TOKEN_ERR);
	}
	// 验证 JWT
	jwt.verify(token, secretKey, (err, decoded) => {
		if (err) {
			return RespError(res, CommonErrStatus.TOKEN_ERR);
		} else {
			// JWT 验证成功，将 JWT 中的信息存储在请求对象中，并调用 next() 继续处理请求
			req.user = decoded;
			next();
		}
	});
};

module.exports = {
	authenticateToken,
	secretKey
};
