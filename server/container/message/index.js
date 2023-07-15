module.exports = {
    List,
};
const path = require('path');

let { RespParamErr, RespServerErr, RespExitFriendErr, RespUpdateErr, RespCreateErr } = require('../../model/error');
const { RespError, RespSuccess, RespData } = require('../../model/resp');
const { Query } = require('../../db/query');
const fs = require('fs');
const { generateRandomString, notExitCreate } = require('../../utils/utils')
const { formatBytes } = require('../../utils/format')
let rooms = {}
/**
 * 获取消息列表
 * 1.先获取好友聊天列表
 * 2.先根据好友分组表中获取当前用户的所有好友分组id,然后根据分组id获取指定房间的用户的所有聊天记录,在根据消息统计表获取最后一次发送消息的时间
 * 3.如何根据对方id和房间号获取未读消息的数量
 * 4.根据房间号和创建时间获取最后一次消息内容
 * 5.根据房间号获取群聊历史记录
 * 
 * 群聊历史记录获取
 * 需要获取的字段 avatar,lastMessage(最后一条消息),name,room,type,unreadCount(当前用户未读的消息数量),updated_at,group_id(分组id)
 * 2.根据group_chat获取头像,name,room,group_id
 * 
 */
async function List(req, res) {
    let data = []
    let id = req.user.id
    //获取所有好友聊天列表
    let sql = `SELECT user_id,remark as name,username as receiver_username,f.room,msg_sta.updated_at from friend as f,(SELECT id FROM friend_group WHERE user_id=?) as fp,message_statistics as msg_sta WHERE fp.id=f.group_id and f.room=msg_sta.room  ORDER BY msg_sta.updated_at DESC;`
    let { err, results } = await Query(sql, [id])
    for (const index in results) {
        let item = results[index]
        sql = `SELECT count(*) as unreadCount FROM message WHERE room=? and receiver_id=? and status=0`
        let r = await Query(sql, [item.room, id])
        results[index].unreadCount = r.results[0].unreadCount
        sql = `SELECT  content as lastMessage,media_type as type FROM message WHERE room=? ORDER BY created_at DESC LIMIT 1`
        r = await Query(sql, [item.room, id])
        results[index].lastMessage = r.results[0].lastMessage
        results[index].type = r.results[0].type
        sql = `SELECT  avatar from user where id=?`
        r = await Query(sql, [item.user_id])
        results[index].avatar = r.results[0].avatar
    }
    // 处理 一开始查询结果可能为空 results的值undefined导致报错
    if (results) {
        data.push(...results)
    }
    // 查询数据失败
    if (err) return RespError(res, RespServerErr)
    //获取所有群聊聊天列表 获取头像,姓名,房间号和最后一次更新时间
    sql = 'SELECT gc.id as group_id,avatar,name,gc.room,msg_sta.updated_at FROM group_chat as gc,(SELECT * FROM group_members WHERE user_id=?) as gm,message_statistics as msg_sta  WHERE gc.id=gm.group_id and gc.room=msg_sta.room  ORDER BY msg_sta.updated_at DESC;'
    let resObj = await Query(sql, [id])
    // 查询数据失败
    if (resObj.err) return RespError(res, RespServerErr)
    let results2 = resObj.results
    //获取最后一条信息
    for (const index in results2) {
        let item = results2[index]
        // sql = `SELECT count(*) as unreadCount FROM message WHERE room=? and receiver_id=? and status=0`
        // let r = await Query(sql, [item.room, id])
        results2[index].unreadCount = 0
        sql = `SELECT  content as lastMessage,media_type as type FROM message WHERE room=? ORDER BY created_at DESC LIMIT 1`
        r = await Query(sql, [item.room, id])
        results2[index].lastMessage = r.results[0]?.lastMessage
        results2[index].type = r.results[0]?.type
    }
    if (results2.length > 0) {
        data.push(...results2)
    }
    data.sort((a, b) => {
        let t1 = new Date(a.updated_at).getTime()
        let t2 = new Date(b.updated_at).getTime()

        if (t1 < t2) {
            return 1; // a 应该排在 b 前面
        } else if (t1 > t2) {
            return -1; // a 应该排在 b 后面
        } else {
            return 0; // a 和 b 相等，位置不变
        }
    })
    return RespData(res, data)
}