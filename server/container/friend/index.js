module.exports = {
    getFriendList,
    getFriendGroupList,
    createFriendGroup,
    searchUser,
    addFriend,
};
let { RespParamErr, RespServerErr, RespExitFriendErr, RespUpdateErr, RespCreateErr } = require('../../model/error');
const { RespError, RespSuccess, RespData } = require('../../model/resp');
const { Query } = require('../../db/query');

//查询好友信息
async function getFriendByGroup(group_id) {
    const sql = 'select * from friend where group_id=?'
    let { results } = await Query(sql, [group_id])
    return results
}
//添加好友
async function addFriendRecord(friendInfo) {
    const sqlStr = 'insert into friend set ?'
    let { err, results } = await Query(sqlStr, friendInfo)
    // 执行 SQL 语句失败了
    if (err) return err
    if (results.affectedRows === 1) {
        if (err) return RespError(res, RespServerErr)
        if (results.affectedRows === 1) {
            return ""
        }
        return "创建失败"
    }
}
/**
 * 查询用户
 * 1.查询用户表,模糊查询
 * 2.判断查询出来的数据中,判断是否存在已经好友的现象
 * 3.筛选出已经是好友的和不是好友的，非好友的才能添加
 */
async function searchUser(req, res) {
    // 获取当前登录的用户信息、模糊查询关键字
    let { sender, username } = req.body
    let sql = 'select * from user where username like ?'
    let { err, results } = await Query(sql, [`%${username}%`])
    // 查询数据失败
    if (err) return RespError(res, RespServerErr)
    let searchList = []
    if (results.length != 0) {
        sql = 'select id from friend_group  where user_id=?'
        for (const userInfo of results) {
            let flag = false
            // 如果是自己，跳过
            if (userInfo.username == sender.username) {
                continue
            }
            let res = await Query(sql, [sender.id])
            let err2 = res.err, results2 = res.results
            // 查询数据失败
            if (err2) return RespError(res, RespServerErr)
            for (const item of results2) {
                let friends = await getFriendByGroup(item.id)
                for (const item2 of friends) {
                    if (item2.username == userInfo.username) {
                        flag = true
                        //已经是朋友了
                        break
                    }
                }
                if (flag == true) {
                    break
                }
            }
            // 返回的信息：昵称、用户名、用户id、用户头像、是否是好友
            searchList.push({ name: userInfo.name, username: userInfo.username, id: userInfo.id, avatar:userInfo.avatar, status: flag })
        }
    }
    RespData(res, searchList)
}
/**
 * 添加好友
 * 1.首先将好友添加到自己的好友列表中
 * 2.然后将自己也插入到别人的好友列表中
 */
async function addFriend(req, res) {
    // 获取发送方信息、好友id、好友用户名、好友头像（注意：好友备注及好友分组是默认值）
    let {sender, id, username, avatar} = req.body
    // 获取发送方所有的，以便将好友添加到默认分组中
    let sql = 'select id from friend_group  where user_id=?'
    let { results:results1 } = await Query(sql, [sender.id])

    // 将好友添加到自己的好友列表中
    let friendInfo1 = {
        user_id: id,
        username: username,
        avatar: avatar,
        remark: username,
        group_id: results1[0].id,
    }
    let {err:err1} = await addFriendRecord(friendInfo1)
    if (err1) {
        return RespError(res, RespCreateErr)
    }

    //将自己添加到对方好友列表里
    sql = 'select id,user_id,name from friend_group where user_id=?'
    let { results:results2 } = await Query(sql, [id])
    let friendInfo2 = {
        user_id: sender.id,
        username: sender.username,
        avatar: sender.avatar,
        remark: sender.username,
        group_id: results2[0].id,
    }
    let {err:err2} = await addFriendRecord(friendInfo2)
    if (err2) {
        return RespError(res, RespCreateErr)
    }
    return RespSuccess(res)
}
/**
 * 获取好友列表
 * 1.根据当前用户的id获取其所有好友分组的id和name
 * 2.然后再根据getFriendList传入好友分组的id获得相应的好友,最后插入到friendList中
 */
function getFriendList(req, res) {
    //根据id获取所有分组下的所有好友
    let id = req.user.id
    const sql = 'select id,name from friend_group where user_id=?'
    db.query(sql, [id], async (err, results) => {
        // 查询数据失败
        if (err) return RespError(res, RespServerErr)
        // 查询数据成功
        // 注意：如果执行的是 select 查询语句，则执行的结果是数组
        let friendList = []
        if (results.length != 0) {
            for (const item of results) {
                let friend = { name: item.name, friend: [] }
                let friends = await getFriendByGroup(item.id)
                for (const item2 of friends) {
                    friend.friend.push(item2)
                }
                friendList.push(friend)
            }
        }
        return RespData(res, friendList)
    })
}
/**
 * 获取当前用户的分组列表
 */
async function getFriendGroupList(req, res) {
    let user_id = req.user.id
    const sql = 'select * from friend_group where user_id=?'
    let { err, results } = await Query(sql, [user_id])
    // 查询数据失败
    if (err) return RespError(res, RespServerErr)
    RespData(res, results)
}
/**
 * 添加好友分组
 */
async function createFriendGroup(req, res) {
    const friend_group = req.body
    let sql = 'insert into friend_group set ?'
    let { err, results } = await Query(sql, friend_group)
    // 查询数据失败
    if (err) return RespError(res, RespServerErr)
    if (results.affectedRows === 1) {
        return RespSuccess(res)
    }
}