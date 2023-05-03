/**
 * 初始化所有的全局变量和全局方法
 */
const initGlobal = require('./global');
initGlobal();

/**
 * 引入app并启动服务
 */
const app = require('./app/app');
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
