// 1xx 开头的状态码用于 通用 模块
exports.CommonStatus = {
	SERVER_ERR: 1001,
	TOKEN_ERR: 1002,
	PARAM_ERR: 1003,
	CREATE_ERR: 1004,
	UPDATE_ERR: 1005
};
const CommonStatusMap = {
	1001: '服务有误',
	1002: 'Token 错误或过期',
	1003: '参数错误',
	1004: '创建失败',
	1005: '修改失败'
};

// 2xx 开头的状态码用于 auth 模块
exports.AuthStatus = {
	USER_OR_PASS_ERR: 2001,
	USER_ALREADY_LOGGEDIN: 2002,
	USER_EXIT_ERR: 2003,
	USER_NOTEXIT_ERR: 2004,
	PHONE_EXIT_ERR: 2005
};
const AuthStatusMap = {
	2001: '用户名或密码错误',
	2002: '用户已登录',
	2003: '用户名或手机号已注册',
	2004: '用户名与手机号不匹配',
	2005: '该手机号已被绑定'
};

// 3xx 开头的状态码用于 friend 模块

// 4xx 开头的状态码用于 group 模块
exports.GroupStatus = {
	ALL_EXIT_ERR: 4001,
	EXIT_GROUP_ERR: 4002
};
const GroupStatusMap = {
	4001: '你邀请的好友都已经加入群聊',
	4002: '你已加入群聊'
};

// 5xx 开头的状态码用于 message 模块

// 6xx 开头的状态码用于 file 模块
exports.FileStatus = {
	FILE_EXIST: 6001,
	ALL_CHUNK_UPLOAD: 6002
};
const FileStatusMap = {
	6001: '该文件已被上传',
	6002: '已完成所有分片上传，请合并文件'
};

// 合并所有的状态码
exports.StatusMap = {
	...AuthStatusMap,
	...GroupStatusMap,
	...CommonStatusMap,
	...FileStatusMap
};

exports.SUCCESS_CODE = 200;
