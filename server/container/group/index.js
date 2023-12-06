module.exports = {
  CreateGroupChat,
  GetGroupChatList,
};
const { base64ToImage } = require("../../utils/createFile");
const { RespServerErr, RespCreateErr } = require("../../model/error");
const { RespError } = require("../../model/resp");
const { Query } = require("../../db/query");
const { v4: uuidv4 } = require("uuid");

/**
 * 创建群聊
 */
async function CreateGroupChat(req, res) {
  const groupInfo = req.body;
  const uuid = uuidv4();
  // 转化图片文件并保存
  const filePath = base64ToImage(groupInfo.avatar);

  let group_chat = {
    name: groupInfo.name,
    creator_id: req.user.id,
    avatar: filePath,
    announcement: groupInfo.announcement,
    room: uuid,
  };

  //创建群聊
  let sql = "insert into group_chat set ?";
  let { err, results } = await Query(sql, group_chat);
  // 查询数据失败
  if (err) return RespError(res, RespServerErr);
  if (results.affectedRows === 1) {
    //发送消息
    let message = {
      sender_id: req.user.id,
      receiver_id: results.insertId,
      type: "group",
      media_type: "text",
      status: 0,
      content: "大家可以一起聊天了!!",
      room: uuid,
    };
    sql = "insert into message set ?";
    await Query(sql, message);
    sql = "insert into message_statistics set ?";
    await Query(sql, { room: uuid, total: 1 });
    let members = groupInfo.members;
    //插入自己
    members.push({
      user_id: req.user.id,
      username: req.user.name,
      avatar: req.user.avatar,
    });
    //插入成员
    for (const member of members) {
      const memberInfo = {
        group_id: results.insertId,
        user_id: member.user_id,
        nickname: member.username,
      };
      sql = "insert into group_members set ?";
      await Query(sql, memberInfo);
    }
    return RespSuccess(res);
  }

  return RespError(res, RespCreateErr);
}
/**
 * 获取当前用户加入的所有群聊
 * 1.获取当前用户id
 * 2.根据group_members获取所有group_id,在根据left join获取group_chat对应的id下的群聊信息
 * 3.根据group_id,使用count(*)获取group_members的成员数量
 */
async function GetGroupChatList(req, res) {
  //根据id获取所有分组下的所有好友
  const id = req.user.id;
  let groupChatList = [];
  let sql =
    "SELECT gct.*  from ((select group_id from group_members where user_id=?) as gmb LEFT JOIN group_chat as gct on gmb.group_id=gct.id)";
  let { err, results } = await Query(sql, [id]);
  if (err) return RespError(res, RespServerErr);
  groupChatList = results;
  for (const index in groupChatList) {
    sql = "select count(*) as members_len from group_members where group_id=?";
    let resp = await Query(sql, [groupChatList[index].id]);
    groupChatList[index].members_len = resp.results[0].members_len;
  }
  return RespData(res, groupChatList);
}
