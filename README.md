# better-chat

![](https://p0.meituan.net/travelcube/67b20d25afd586d62a79a0d8e592d55319478.png)
![](https://badgen.net/static/vite/4.2.0/green) ![](https://badgen.net/static/react/18.2.0/red) ![](https://badgen.net/static/typescript/4.9.3/blue) ![](https://badgen.net/static/express/4.18.2/yellow) ![](https://badgen.net/static/express-ws/5.0.2/orange) ![](https://badgen.net/static/mysql/2.18.1/pink) ![](https://badgen.net/static/websocket/OK/green) ![](https://badgen.net/static/webrtc/OK/purple)

## 1、项目介绍

### 1.1 项目概括

本项目是一个前端基于 `vite`、`react`、`ts`，后端基于 `express`、`express-ws`、`mysql`，并依赖 `websocket 协议`、`webrtc 协议`实现的局域网实时聊天全栈项目，且`持续开源和维护`。

### 1.2 为什么要开发这个项目？

**先写在前面**：本项目是个人学习过程中开发的项目，功能简单、界面简洁，适合正在练习上述技术栈的小白进行学习和巩固，代码量极少且逻辑清晰。(`大佬勿喷`)
`注意：本项目配备了极为详细的开发教程文档（多达两万字，目录如下所示），同时教程文档中也整理了需要好的文章以便读者进行学习，即使是对上述技术栈几乎陌生的小白，跟着教程也完全可以从0到1实现项目。（教程在本项目Github Star个数达100个时将会开源）`

![](https://p0.meituan.net/travelcube/52127e8052d53649aac36574adc58cfc38255.png)
![](https://p1.meituan.net/travelcube/a505cf7f22fd566b0c752d4db2625eec33634.png)
![](https://p1.meituan.net/travelcube/b334ce890093ccc716c9509015ccb1d910587.png)

### 1.3 项目亮点？

- 使用 prettier+eslint+stylelint+lint-staged+husky+commitlint 统一代码和 git 提交规范，较为完备的前端工程化设置
- 项目目录结构合理、清晰，组件和方法抽象程度高，代码耦合度低，且配备较为完备的文档说明
- 前端基于 vite、react、ts，后端基于 express、express-ws、mysql 的全栈开发，锻炼全栈能力
- 基于 websocket 协议、webrtc 协议实现了局域网通信和音视频通话功能
- 针对大文件传输场景，作出分片上传、断点续传处理
- 依赖高阶组件实现路由守卫，基于 token 和 jwt 实现鉴权

### 1.4 目前已经完成的功能

- 个人模块（包括登录注册、记住密码、忘记密码、退出登录、防止重复登录、修改密码、修改个人信息等功能）
- 好友模块（包括查询好友、添加好友、获取好友列表、查询好友信息、修改好友信息等功能）
- 聊天模块（包括文本、表情包、图片、视频、其它各类文件的传输以及音视频通话等功能）

### 1.5 后续待完成的功能

- 增加群聊与群音视频功能
- 引入 MobX 状态管理
- 借助 electron 打包成桌面应用
- 利用 docker 进行部署
- 实现外网通信

### 1.6 项目运行截图

#### 1.6.1 个人模块

登录界面：
![](https://p1.meituan.net/travelcube/4fa7b5c1743273b20666259d9507ee753460255.png)
注册界面：
![](https://p0.meituan.net/travelcube/dd878800800485f7ad8f02071aae12053425511.png)
修改个人信息：
![](https://p0.meituan.net/travelcube/df4f2f972ceee4c4dacddb56ef7b93b7169361.png)
修改密码：
![](https://p0.meituan.net/travelcube/df4f2f972ceee4c4dacddb56ef7b93b7169361.png)

#### 1.6.2 好友模块

好友列表展示、好友信息展示及修改：
![](https://p0.meituan.net/travelcube/df4f2f972ceee4c4dacddb56ef7b93b7169361.png)
查询并添加好友：
![](https://p0.meituan.net/travelcube/3b29e4529347f23838edda4c7d90581a173482.png)

#### 1.6.3 聊天模块

聊天列表展示：
![](https://p0.meituan.net/travelcube/178b968aba56fb2ccda1c94f5ec756bc145151.png)
聊天框展示：
![](https://p0.meituan.net/travelcube/05dc84dd06f257cff30970e2502c2ac8158907.png)
图片预览：
![](https://p0.meituan.net/travelcube/23b291d5301b100fa85c526698c9bb33219991.png)
视频预览：
![](https://p0.meituan.net/travelcube/8d89a737e7ad8798f878347549353e93382274.png)
发起语音通话：
![](https://p0.meituan.net/travelcube/881c1d9f07f2d1038899a48aa1521796338737.png)
收到语音通话：
![](https://p0.meituan.net/travelcube/5cfbe283ef34b157ef46525aeb42e1a8330738.png)
语音通话中：
![](https://p0.meituan.net/travelcube/5cfbe283ef34b157ef46525aeb42e1a8330738.png)
发起视频通话：
![](https://p0.meituan.net/travelcube/164d8d7f21ced7a00481960cf9fb7af6338274.png)
收到视频通话：
![](https://p0.meituan.net/travelcube/44297f55c2961832c4cd5844e94e5782331408.png)

## 2、项目开发教程

### 2.1 项目如何启动

1. 先拉取本项目到本地：

   ```
      git clone git@github.com:XC0703/better-chat.git
   ```

2. 用 VScode 等编辑器打开本项目，再依次：

   ```
      cd server
      pnpm install
      pnpm start
   ```

   ```
      cd client
      pnpm install
      pnpm start
   ```

3. 此时浏览器会自动打开项目页面

**注意：**

1. 项目启动前，先确定本地电脑已经配备好相关环境（`node`，`mysql`，`redis`，`pnpm` 等），推荐用 `navicat` 作为数据库管理软件（在里面新建本项目的数据库），用 `redis desktop manager` 作为 redis 管理软件，。

   > 需要先全局安装 pnpm，安装命令为：
   >
   > > `npm install -g pnpm`
   >
   > 其中关于为什么用 pnpm 不用 npm 或者 yarn 命令，参考博客：
   > 【关于现代包管理器的深度思考——为什么现在我更推荐 pnpm 而不是 npm/yarn?】：
   > https://juejin.cn/post/6932046455733485575

   > 数据库安装相关：
   >
   > > 1、MySQL8.0.26 安装配置教程(windows 64 位)：https://blog.csdn.net/weixin_52270997/article/details/120066948
   > > 2、Navicat Premium v12.1.9 破解版\_x86_x64：https://blog.csdn.net/juanjuan_01/article/details/84102349
   > > 3、Navicat Premium 基本使用：https://blog.csdn.net/Yangchenju/article/details/80633055
   >
   > Redis 安装相关：
   >
   > > 1、Redis 下载和安装（Windows 系统）参考链接：
   > > http://c.biancheng.net/redis/windows-installer.html
   > > （注意：在执行 redis-server.exe --service-start 前要把客户端启动关掉，否则端口会被占用）
   > > 2、windows 免费安装 redis desktop manager（上 github 找到免费版最新的是 2018 年的，可以直接下载 exe 执行程序）：
   > > https://github.com/uglide/RedisDesktopManager/releases/tag/0.9.3

2. 本项目的数据库配置如下：（见 server\config.json 目录）

   ```
   {
   "host": "127.0.0.1",
   "port": 3306,
   "user": "root",
   "password": "XC20020703",
   "database": "better-chat"
   }
   ```

3. 作者本人的环境配置：

   ```
   node：16.14.2
   mysql：8.0.29
   redis：5.0.14
   ```

### 2.2 具体教程

上面 1.2 中讲到我为什么要开发这个项目时提到本项目配备了极为详细的开发教程文档（`多达两万字`），同时教程文档中也整理了需要好的文章以便读者进行学习，即使是对上述技术栈几乎陌生的小白，跟着教程也完全可以从 0 到 1 实现该项目。该教程将在本项目 Github Star 个数达 100 个时会开源，因此手把手带大家开发的教程不再在这里赘述，希望各位看官动动手中的小手帮忙点下 star 助力。

### 2.3 如何参与本项目？

1.  Fork 本仓库
2.  新建 feat/xxx_feature 分支
3.  提交代码(commit 规范可参照这里：https://juejin.cn/post/7264599940537532474#heading-6)
4.  新建 Pull Request

## 3、写在最后

本项目到目前为止都靠作者一人独立开发，但上面提到还有许多可扩展的功能点，本人心有余而力不足，因此希望更多的人参与进来，继续完善这个项目，实现更好的开源。

本人掘金博客地址：http://www.xucong.zone
github 主页地址：https://github.com/XC0703
