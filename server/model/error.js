// 返回码
exports.RespServerErr = 4000;
exports.RespTokenErr = 4001;
exports.RespUserOrPassErr = 4002;
exports.RespUserAlreadyLoggedIn = 4003;
exports.RespParamErr = 4004;
exports.RespUserExitErr = 4005;
exports.RespUserNotExitErr = 4006;
exports.RespUpdateErr = 4007;
exports.RespCreateErr = 4008;
exports.RespGroupInsertError = 4009;
exports.RespExitGroupErr = 4010;

exports.RespMap = {
	4000: '服务有误',
	4001: '客户端 TOKEN 错误',
	4002: '用户名或密码错误',
	4003: '用户已登录',
	4004: '参数有误',
	4005: '用户名或手机号已注册',
	4006: '用户名与手机号不匹配',
	4007: '修改失败',
	4008: '创建失败',
	4009: '你邀请的好友都已经加入群聊',
	4010: '你已加入群聊'
};
