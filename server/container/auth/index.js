module.exports = {
    Login,
    Logout,
    Register,
    ForgetPassword,
};
const jwt = require('jsonwebtoken');
const secretKey = 'xWbiNA3FqnK77MnVCj5CAcfA-VlXj7xoQLd1QaAme6l_t0Yp1TdHbSw';
let { RespUserOrPassErr, RespUserAlreadyLoggedIn, RespParamErr, RespServerErr, RespUserExitErr, RespUpdateErr, RespUserNotExitErr } = require('../../model/error');
const { RespData, RespSuccess ,RespError} = require('../../model/resp');
const { Query } = require('../../db/query');
const crypto = require('crypto'); 
const Redis = require('ioredis');
const better_chat = new Redis();
/**
 * 登录基本逻辑
 * 1.获取到前端传来的username和password
 * 2.查询数据库,判断用户名和密码是否正确
 * 3.正确后生成jwt,判断redis中是否有该用户的token，没有则返回想要token给前端去保存
 */
async function Login(req, res) {
    const { username, password } = req.body
    if (!(username && password)) {
        return RespError(res, RespParamErr)
    }
    //const salt = crypto.randomBytes(3).toString('hex')
    const sql = 'select * from user where username=?'
    let { err, results } = await Query(sql, [username])
    // 查询数据失败
    if (err) return RespError(res, RespServerErr)
    // 查询数据成功
    // 注意：如果执行的是 select 查询语句，则执行的结果是数组
    if (results.length != 0) {
        const payload = {
            id: results[0].id,
            avatar: results[0].avatar,
            username: results[0].username,
            password: results[0].password,
            name: results[0].name,
            phone: results[0].phone,
            salt: results[0].salt
        }
        //加盐
        let M = payload.salt.slice(0, 3) + password + payload.salt.slice(3);
        // 将M进行MD5哈希，得到哈希值
        let hash = crypto.createHash('md5').update(M).digest('hex');
        if (hash != payload.password) {
            return RespError(res, RespUserOrPassErr)
        }
        const token = jwt.sign(payload, secretKey, {expiresIn: '2w' });
        let data = {
            token: token,
            info: {
                id: results[0].id,
                avatar: results[0].avatar,
                username: results[0].username,
                name: results[0].name,
                phone: results[0].phone,
                created_at: new Date(results[0].created_at).toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
                signature: results[0].signature,
            }
        }
        //检查Redis缓存中的Token
        let redisToken = await better_chat.get(`token:${payload.username}`)
        if (redisToken) {
            return RespError(res, RespUserAlreadyLoggedIn)
        }
        // 保存Token到Redis缓存中
        better_chat.set(`token:${payload.username}`, token, 'EX', 60 * 60 * 24 * 14) // 有效期为14天
        return RespData(res, data)
    }
    return RespError(res, RespUserOrPassErr)
}
/**
 * 退出登录基本逻辑
 * 1.获取到前端传来的username
 * 2.删除redis中的token
 * 3.返回成功
 */
async function Logout(req, res) {
    const { username } = req.body
    if (!username) {
        return RespError(res, RespParamErr)
    }
    //删除redis中的token
    better_chat.del(`token:${username}`)
    return RespSuccess(res)
}
/**
 * 注册的基本逻辑
 * 1.获取到前端传来的username和password
 * 2.先判断用户名是否已经注册
 * 3.未注册则插入user表中
 * 4.给新用户添加一个好友分组
 * 5.生成jwt,把token返回给前端要前端进行保存 
 */
async function Register(req, res) {
    const { username, password, phone,avatar } = req.body
    if (!(username && password && phone)) {
        return RespError(res, RespParamErr)
    }
    //3个字节的字节码转化成16进制字符串，生成一个6位的salt
    const salt = crypto.randomBytes(3).toString('hex')
    const sql1 = 'select username,password,phone from user where username=?'
    const sql2 = 'select username,password,phone from user where phone=?'
    //判断用户名是否已注册
    let { err: err1, results: results1 } = await Query(sql1, [username])
    // 查询数据失败
    if (err1) return RespError(res, RespServerErr)
    // 查询数据成功
    // 注意：如果执行的是 select 查询语句，则执行的结果是数组
    if (results1.length != 0) {
        return RespError(res, RespUserExitErr)
    }
    // 判断手机号是否已注册
    let { err: err2, results: results2} = await Query(sql2, [phone])
    // 查询数据失败
    if (err2) return RespError(res, RespServerErr)
    // 查询数据成功
    // 注意：如果执行的是 select 查询语句，则执行的结果是数组
    if (results2.length != 0) {
        return RespError(res, RespUserExitErr)
    }
    //加盐
    let M = salt.slice(0, 3) + password + salt.slice(3);
    // 将M进行MD5哈希，得到哈希值
    let hash = crypto.createHash('md5').update(M).digest('hex');
    let user = {
        avatar,
        username: username,
        password: hash,
        name: username,
        phone: phone,
        signature: "",
        salt: salt
    }
    const sqlStr = 'insert into user set ?'
    let res2 = await Query(sqlStr, user)
    err = res2.err
    let result2 = res2.results
    // 执行 SQL 语句失败了
    if (err) return RespError(res, RespServerErr)
    // 注册成功后将相关信息返回给前端
    if (result2.affectedRows === 1) {
        getUserInfo(username, (info) => {
            const payload = {
                id: info.id,
                avatar: info.avatar,
                username: info.username,
                name: info.name,
                phone: info.phone,
            }
            const token = jwt.sign(payload, secretKey, { expiresIn: '30m' });
            let data = {
                token: token,
                info: info
            }
            return RespData(res, data)
        })
    }
}
/**
 * 忘记密码基本逻辑
 * 1.判断用户手机号和用户名是否存在
 * 2.如果数据符合则修改user表的数据
 */
async function ForgetPassword(req, res) {
    const { username, phone, password } = req.body
    if (!(username && phone && password)) {
        return RespError(res, RespParamErr)
    }
    const sql = 'select username,phone,salt from user where username=? and phone=?'
    //判断用户手机号和用户名是否存在
    let { err, results } = await Query(sql, [username, phone])
    // 查询数据失败
    if (err) return RespError(res, RespServerErr)
    // 查询数据成功
    // 注意：如果执行的是 select 查询语句，则执行的结果是数组
    if (results.length == 0) {
        return RespError(res, RespUserNotExitErr)
    }
    const salt = results[0].salt
    const M = salt.slice(0, 3) + password + salt.slice(3);
    // 将M进行MD5哈希，得到哈希值
    const hash = crypto.createHash('md5').update(M).digest('hex');
    const sqlStr = 'update user set password=? where username=?'
    db.query(sqlStr, [hash, username], (err, results) => {
        // 执行 SQL 语句失败了
        if (err) return RespError(res, RespServerErr)
        if (results.affectedRows === 1) {
            return RespSuccess(res)
        }
        return RespError(res, RespUpdateErr)

    })
}
/**
 * 获取用户信息
 * @param {*} username
 * @param {*} callback
 * @returns
 * @description 通过用户名获取用户信息
 */
function getUserInfo(username, callback) {
    const sql = 'select * from user where username=?'
    db.query(sql, [username], (err, results) => {
        // 注意：如果执行的是 select 查询语句，则执行的结果是数组
        if (results.length != 0) {
            const data = {
                id: results[0].id,
                avatar: results[0].avatar,
                username: results[0].username,
                name: results[0].name,
                phone: results[0].phone,
                created_at: new Date(results[0].created_at).toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
                signature: results[0].signature,
            }
            return callback(data)
        }
    })
}