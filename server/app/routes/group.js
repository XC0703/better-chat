const express = require("express");
const router = express.Router();
const group = require("../../container/group/index");
const jwt = require("jsonwebtoken");
const secretKey = "xWbiNA3FqnK77MnVCj5CAcfA-VlXj7xoQLd1QaAme6l_t0Yp1TdHbSw";
let { RespTokenErr } = require("../../model/error");

// JWT 校验中间件
function authenticateToken(req, res, next) {
  // 获取 JWT 字符串
  const token = req.headers.authorization;
  if (!token) {
    // 如果没有 JWT，则返回 401 Unauthorized
    return RespError(res, RespTokenErr);
  }

  // 验证 JWT
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      // JWT 验证失败，则返回 401 Unauthorized
      console.error(err);
      return RespError(res, RespTokenErr);
    } else {
      // JWT 验证成功，将 JWT 中的信息存储在请求对象中，并调用 next() 继续处理请求
      req.user = decoded;
      next();
    }
  });
}
module.exports = function () {
  router.post("/create_group", authenticateToken, group.CreateGroupChat);
  router.get("/group_chat_list", authenticateToken, group.GetGroupChatList);
  router.get("/search_group", authenticateToken, group.SearchGroupChat);
  router.get("/group_chat_info", authenticateToken, group.GroupInfo);
  router.post(
    "/invite_friends",
    authenticateToken,
    group.InviteFriendsToGroupChat
  );
  router.post("/add_group", authenticateToken, group.JoinGroupChat);
  return router;
};
