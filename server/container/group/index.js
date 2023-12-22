module.exports = {
  CreateGroupChat,
  GetGroupChatList,
  SearchGroupChat,
  GroupInfo,
  InviteFriendsToGroupChat,
  JoinGroupChat,
};
const { base64ToImage } = require("../../utils/createFile");
const {
  RespServerErr,
  RespCreateErr,
  RespGroupInsertError,
  RespExitGroupErr,
} = require("../../model/error");
const { RespError } = require("../../model/resp");
const { Query } = require("../../db/query");
const { v4: uuidv4 } = require("uuid");

/**
 * 创建群聊
 * 1.将前端传过来的群聊头像base64码转成图片文件并保存在本地服务器
 * 2.服务端拿到创建群聊所需要的信息后在群聊表(group_chat)新建一个群聊
 * 3.在群聊成员表(group_numbers)中循环插入所有群聊成员记录
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
 */
async function GetGroupChatList(req, res) {
  //根据id获取所有分组下的所有好友
  const id = req.user.id;
  let sql =
    "SELECT gct.*  from ((select group_id from group_members where user_id=?) as gmb LEFT JOIN group_chat as gct on gmb.group_id=gct.id)";
  let { err, results } = await Query(sql, [id]);
  if (err) return RespError(res, RespServerErr);
  return RespData(res, results);
}
/**
 * 模糊查询群聊
 * 1.根据name查询group_chat获取相似的所有群聊
 * 2.根据user_id和id查询group_members判断当前用户是否加入群聊
 */
async function SearchGroupChat(req, res) {
  const { name } = req.query;
  let sql = "select * from group_chat where name like ?";
  let { err, results } = await Query(sql, [`%${name}%`]);
  // 查询数据失败
  if (err) return RespError(res, RespServerErr);
  let searchList = [];
  if (results.length != 0) {
    const { id } = req.user;
    sql = "select id,user_id from group_members where group_id=?";
    for (const item of results) {
      let status = false;
      const res = await Query(sql, [item.id, id]);
      for (const { user_id } of res.results) {
        if (user_id == id) {
          status = true;
          break;
        }
      }
      searchList.push({
        name: item.name,
        avatar: item.avatar,
        number: res.results.length,
        status: status,
        group_id: item.id,
      });
    }
  }
  RespData(res, searchList);
}
/**
 * 获取群聊信息
 * 1.需要获取群介绍,群主,所有群成员(头像,群昵称,name,加入群聊时间,最后发言时间)
 * 2.根据group_id查询group_chat表获取群主的id,房间room,群介绍,群头像
 * 3.根据group_id查询group_numbers表获取群成员的user_id,nickname,created_at,并查询user表获取成员username和头像
 * 4.使用left join 根据user_id和room查询message表获取用户的最后一次发消息时间
 */
async function GroupInfo(req, res) {
  const group_id = req.query.group_id;
  let sql =
    "SELECT gc.id, gc.name, gc.creator_id, u.username AS creator_username, gc.avatar, gc.announcement, gc.room, gc.created_at FROM group_chat gc JOIN user u ON gc.creator_id = u.id WHERE gc.id = ?";
  let { err, results } = await Query(sql, [group_id]);
  // 查询数据失败
  if (err) return RespError(res, RespServerErr);
  let info = {
    id: results[0].id,
    name: results[0].name,
    creator_id: results[0].creator_id,
    creator_username: results[0].creator_username,
    avatar: results[0].avatar,
    announcement: results[0].announcement,
    room: results[0].room,
    created_at: results[0].created_at,
    members: [],
  };
  sql =
    "SELECT s.*,m.lastMessageTime FROM (SELECT user_id,user.avatar,user.name,nickname,group_members.created_at FROM group_members,user WHERE group_id=?  and user_id=user.id) as s left JOIN (SELECT sender_id,Max(created_at) as lastMessageTime FROM message as msg WHERE msg.room=? GROUP BY sender_id) as m on m.sender_id=s.user_id";
  let resp = await Query(sql, [group_id, info.room]);
  (err = resp.err), (results = resp.results);
  // 查询数据失败
  if (err) return RespError(res, RespServerErr);
  for (const item of results) {
    info.members.push({ ...item });
  }
  return RespData(res, info);
}
/**
 * 邀请新的好友进入群聊
 * 1.获取邀请名单和group_id
 * 2.根据group_id查询group_numbers表去筛选邀请名单,过滤掉已经存在群里的用户
 * 3.在group_members表插入新的数据（包含group_id、user_id、nickname三个字段，其中nickname直接为name即可）
 */
async function InviteFriendsToGroupChat(req, res) {
  let { groupId, invitationList } = req.body;
  let userIdArr = invitationList.map((item) => item.user_id);
  let sql =
    "SELECT user_id FROM group_members WHERE group_id = ? AND FIND_IN_SET(user_id, ?)";
  let { err, results } = await Query(sql, [groupId, userIdArr.join(",")]);
  // 查询数据失败
  if (err) return RespError(res, RespServerErr);

  let invitationInfoList = [];
  let hasInvitedUserIdArr = results.map((item) => item.user_id);
  for (const item of invitationList) {
    if (!hasInvitedUserIdArr.includes(item.user_id)) {
      invitationInfoList.push({
        group_id: groupId,
        user_id: item.user_id,
        nickname: item.username,
      });
    }
  }
  if (invitationInfoList.length === 0) {
    return RespError(res, RespGroupInsertError);
  }
  // 插入成员
  sql = "insert into group_members set ?";
  let resp = await Query(sql, invitationInfoList);
  err = resp.err;
  // 查询数据失败
  if (err) return RespError(res, RespServerErr);
  return RespSuccess(res);
}
/**
 * 加入新的群聊
 * 1.获取邀请名单和group_id
 * 2.根据group_id查询group_numbers表去筛选邀请名单,过滤掉已经存在群里的用户
 * 3.在group_members表插入新的数据（包含group_id、user_id、nickname三个字段，其中nickname直接为name即可）
 */
async function JoinGroupChat(req, res) {
  const group_id = req.body.group_id;
  const { id, name } = req.user;
  let sql = "select id from group_members where group_id=? and user_id=?";
  let { err, results } = await Query(sql, [group_id, id]);
  // 查询数据失败
  if (err) return RespError(res, RespServerErr);
  if (results.length != 0) {
    return RespError(res, RespExitGroupErr);
  }
  const info = {
    group_id: group_id,
    user_id: id,
    nickname: name,
  };
  //插入成员
  sql = "insert into group_members set ?";
  let resp = await Query(sql, info);
  err = resp.err;
  // 查询数据失败
  if (err) return RespError(res, RespServerErr);
  sql = "select name,room from group_chat where id=?";
  resp = await Query(sql, [group_id]);
  const options = {
    room: resp.results[0].room,
    name: resp.results[0].name,
    group_id: group_id,
  };
  return RespData(res, options);
}
