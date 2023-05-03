// 1. 导入 mysql和fs 模块
const mysql = require('mysql')
const fs = require('fs')
/**
 * 初始化参数
 */
let host = '127.0.0.1'
let port = 3306
let user = 'root'
let password = '123456'
let database = 'better-chat'
/**
 * 如果配置文件存在,则读取配置文件,不存在则默认
 */

if (fs.existsSync("config.json")) {
    var res = JSON.parse(fs.readFileSync(`config.json`))
    host = res.host
    port = res.port
    user = res.user
    password = res.password
    database = res.database
}
// 2. 建立与 MySQL 数据库的连接关系
const db = mysql.createPool({
    host, // 数据库的 IP 地址
    port, //端口
    user, // 登录数据库的账号
    password, // 登录数据库的密码
    database, // 指定要操作哪个数据库
    multipleStatements: true,
    charset: 'utf8mb4'
})
// 3. 测试 mysql 模块能否正常工作
db.query('select 1', (err, results) => {
    // mysql 模块工作期间报错了，就进入这个if判断语句，打印这个错误信息
    if (err) {
        console.log("MySQL连接失败", err.message)
        process.exit(1);
    }
    console.log("MySQL连接成功")
})
// 4. 将连接好的数据库对象向外导出,供外界使用
module.exports = db