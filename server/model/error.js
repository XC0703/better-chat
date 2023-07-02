// 返回码
exports.RespTokenErr = 4000
exports.RespUserOrPassErr = 4001
exports.RespUserAlreadyLoggedIn = 4002
exports.RespParamErr = 4003
exports.RespUserExitErr = 4004
exports.RespUserNotExitErr = 4005
exports.RespUpdateErr = 4006
exports.RespExitFriendErr = 4007
exports.RespCreateErr = 4008
exports.RespExitGroupErr = 4009
exports.RespGroupInsertError = 4010
exports.RespGroupDeletError = 4011
exports.RespServerErr = 4012

exports.RespMap = {
    4000: "客户端TOKEN错误",
    4001: "用户名或密码错误",
    4002: "用户已登录",
    4003: "参数有误",
    4004: "用户名或手机号已注册",
    4005: "用户名与手机号不匹配",
    4006: "修改失败",
    4007: "好友已存在",
    4008: "创建失败",
    4009: "你已加入群聊",
    4010: "你邀请的好友都已经加入群聊",
    4011: "退出群聊失败",
    4012: "服务有误",
}
