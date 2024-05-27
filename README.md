<p align="center">
   <img src="https://p0.meituan.net/travelcube/67b20d25afd586d62a79a0d8e592d55319478.png" alt="better-chat">
</p>

<p align="center">
   <a href="https://cn.vitejs.dev">
      <img src="https://badgen.net/static/vite/4.2.0/green" alt="vite">
   </a>
   <a href="https://zh-hans.react.dev">
      <img src="https://badgen.net/static/react/18.2.0/red" alt="react">
   </a>
   <a href="https://typescript.bootcss.com">
      <img src="https://badgen.net/static/typescript/4.9.3/blue"alt="typescript">
   </a>
   <a href="https://express.nodejs.cn">
      <img src="https://badgen.net/static/express/4.18.2/yellow"alt="express">
   </a>
   <a href="https://www.mysql.com/cn/">
      <img src="https://badgen.net/static/mysql/8.0.29/pink" alt="mysql">
   </a>
</p>
<p align="center">
   <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket">
      <img src="https://badgen.net/static/websocket/OK/green" alt="websocket">
   </a>
   <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API">
      <img src="https://badgen.net/static/webrtc/OK/purple" alt="webrtc">
   </a>
</p>

# 1、项目介绍

## 1.1 项目概括

本项目是一个前端基于`vite`、`react`、`ts`，后端基于`express`、`mysql`，并依赖`websocket`、`webrtc`实现的局域网实时聊天全栈项目，且`持续开源和维护`。

先放在开头：

👉 项目演示视频地址：https://www.bilibili.com/video/BV1mi421C7Ym

🔨 项目说明文档掘金地址：https://juejin.cn/post/7370963861645017097

（希望各位看官给新人 up 主**一键三连** + 给本菜鸡的项目**点个 star**⭐，不胜感激。）

## 1.2 为什么要开发这个项目？

**先写在前面**：本项目是个人学习过程中开发的项目，功能简单、界面简洁，各方面的考虑较为粗糙，适合正在练习上述技术栈的小白进行学习和巩固，代码量极少且逻辑清晰。(**`大佬勿喷`**)<br/>
**注意：本人后面计划整理出项目核心功能的开发教程，发表在本人的[掘金博客](https://juejin.cn/user/2370998127573751/posts)上，确保对上述技术栈几乎陌生的小白，跟着教程也完全可以从 0 到 1 实现项目。因此希望各位同学点点关注。**

## 1.3 谁需要这个项目？

本项目适合以下同学：

- 学习了`vite`、`react`、`ts`等技术栈而没有找到一个好的项目进行实践。
- 想不局限于前端，希望了解后端一些基本知识应用的同学。（如果有写`Java`、`Go`等语言的后端同学需要找项目进行实践，也可对该项目的后端用`Java`进行重构升级，目前的项目后端部分只是为前端提供了简单服务而已，很多东西没有考虑到。）
- 想扩展自己的技术视野，了解 `websocket`、`webrtc` 等知识的基本应用的同学。
- 想提高自己的代码能力、工程能力的同学：

  - 该系统主要可以分为三个模块共`40`个功能点，系统结构如下图所示:<br/>![系统结构图.png](./md_images/系统结构图.png)

  - 工作量展示如下（已排除引用的第三方代码，只统计前后端项目下的 `src` 目录代码）:<br/>
    | | 前端 |后端 |其它 | 总 |
    | :----: | :----: | :----: | :----: | :----: |
    | 代码行数 | 7269 | 2207 | 336 | 9812 |

  - 同时，本项目的开发严格进行了[工程化配置](https://juejin.cn/post/7308536984029102106)，前后进行了**十次代码治理**，降低系统“屎山代码”发生的可能性：<br/>![代码治理六到十期.png](./md_images/代码治理六到十期.png)![代码治理一到五期.png](./md_images/代码治理一到五期.png)

- 找实习、正式的校招前端同学，正在为简历上没有好的项目而苦恼（B 站大学的很多免费项目都是些烂大街的后台管理系统、仿 XX 商城等，面试官都看腻了）。**本项目是本人校招时简历上的个人项目之一，伴随着本人校招拿到了阿里、美团、华为、OPPO 等七个中大厂 offer。本人亲测，该项目的存在会让面试官与你的可聊点变多，让你在千篇一律的简历海中脱颖而出，增加面试通过率。**

## 1.4 项目亮点？

- 使用 `ESLint`+`Prettier`+`Husky`+`Commitlint`+`Lint-staged` 等工具统一代码和 `Git` 提交规范，较为完备的前端工程化配置。
- 项目目录结构合理、清晰，组件和方法抽象程度高，代码耦合度低，且配备较为完善的文档说明。
- 依赖`React Router`和高阶组件实现了前端路由系统，包含路由配置、路由守卫、路由重定向等功能，且结合`JWT`实现鉴权。
- 借助 `MySQL`、`Express` 完成了 `7` 张表、`25` 个接口的设计与开发，锻炼全栈能力。
- 基于 `WebSocket` 协议、`WebRTC` 协议实现了局域网通信和音视频通话功能，且支持群聊和群音视频。
- 实现了本地文件系统，针对大文件传输场景，作出分片上传处理。

## 1.5 一定要从 0 到 1 实现一次本项目吗？

先说回答：**不是**。上面提到本项目的功能点众多，工作量不少，如果**从 0 到 1**实现一次本项目固然收获不少，但对于部分基础好的同学来说太耗时了，也没有必要这样做。本人认为，**了解本项目的架构以及核心功能的实现逻辑即可**，然后对项目进行**二次开发**，即完成下面所提到的待完成功能会收获更大。<br/>

### 1.5.1 本项目的核心功能

- 前端路由系统（`React Router`的实践）
- 登录鉴权（`jwt`鉴权的实践）
- 建立聊天（`websocket`的实践）
- 音视频通话（借助`websocket`完成`webrtc`连接建立需要的一些信令交互）
- 文件上传（本地文件系统的实现）

### 1.5.2 本项目后续待完成的功能

- 增加其它功能模块或者为现有的功能模块增加其它`CRUD`操作，如删除好友、删除分组、退出群聊、群成员管理、好友分组管理等。
- 完善本地文件系统，优化文件分片上传，增加断点续传、秒传、重试机制：
  - 目前项目的文件上传主要用于两处：1、个人/群聊头像上传；2、图片/视频/文件等类型消息的发送。
  - 目前的本地文件系统这块实现较为草率，只实现了最基本的大文件分片上传，且存在很多问题（大图片/视频信息发送会失败、较大较复杂文件会丢失信息乱码等）。
  - 代码里对于文件上传这块涉及的部分书写了**TODO**，可直接上手完善相关代码，完成后将是一个比较大的亮点：<br/>![TODO.png](./md_images/TODO.png)
- 完善项目的`websocket`心跳重连机制，保证持续连接。
- 前端引入`MobX`等库进行状态管理，后端进一步利用`Redis`等缓存进行性能优化。
- 借助`electron`打包成桌面应用。
- 租借云服务器，利用`docker`进行部署、实现外网通信。

## 1.6 项目运行截图

### 1.6.1 用户模块

登录界面：<br/>![登录界面.png](./md_images/登录界面.png)

注册界面：<br/>![注册界面.png](./md_images/注册界面.png)

修改个人信息：<br/>![修改个人信息.png](./md_images/修改个人信息.png)

修改密码：<br/>![修改密码.png](./md_images/修改密码.png)

### 1.6.2 好友模块

好友列表展示、好友信息展示及修改：<br/>![好友列表展示、好友信息展示及修改.png](./md_images/好友列表展示、好友信息展示及修改.png)

查询并添加好友：<br/>![查询并添加好友.png](./md_images/查询并添加好友.png)

### 1.6.3 聊天模块

群聊列表展示、群聊信息展示及修改：<br/>![群聊列表展示、群聊信息展示及修改.png](./md_images/群聊列表展示、群聊信息展示及修改.png)

创建群聊：<br/>![创建群聊第一步.png](./md_images/创建群聊第一步.png)<br/>![创建群聊第二步.png](./md_images/创建群聊第二步.png)

聊天界面：<br/>![聊天界面.png](./md_images/聊天界面.png)

图片消息预览：<br/>![图片消息预览.png](./md_images/图片消息预览.png)

视频消息预览：<br/>![视频消息预览.png](./md_images/视频消息预览.png)

对好友发起语音通话：<br/>![对好友发起语音通话.png](./md_images/对好友发起语音通话.png)

对群友发起语音通话：<br/>![对群友发起语音通话.png](./md_images/对群友发起语音通话.png)

好友收到语音通话：<br/>![好友收到语音通话.png](./md_images/好友收到语音通话.png)

群友收到语音通话：<br/>![群友收到语音通话.png](./md_images/群友收到语音通话.png)

与好友语音通话中：<br/>![与好友语音通话中.png](./md_images/与好友语音通话中.png)

与群友语音通话中：<br/>![与群友语音通话中.png](./md_images/与群友语音通话中.png)

对好友发起视频通话：<br/>![对好友发起视频通话.png](./md_images/对好友发起视频通话.png)

对群友发起视频通话：<br/>![对群友发起视频通话.png](./md_images/对群友发起视频通话.png)

好友收到视频通话：<br/>![好友收到视频通话.png](./md_images/好友收到视频通话.png)

群友收到视频通话：<br/>![群友收到视频通话.png](./md_images/群友收到视频通话.png)

与好友视频通话中：<br/>![与好友视频通话中.png](./md_images/与好友视频通话中.png)

与群友视频通话中：<br/>![与群友视频通话中1.png](./md_images/与群友视频通话中1.png)<br/>![与群友视频通话中2.png](./md_images/与群友视频通话中2.png)

# 2、项目开发教程

## 2.1 项目如何启动？

1. 先拉取本项目到本地：

   ```bash
   git clone git@github.com:XC0703/better-chat.git
   ```

2. 用`VScode`等编辑器打开本项目（无论是用`VSCode`还是`WebStorm`进行开发，请提前安装好并配置启用两个插件：`ESLint`和`Prettier`，用于代码检查与代码格式化。）

3. 下载根目录下的依赖：

   ```bash
   pnpm install
   ```

4. 启动服务端：

   ```bash
   cd server
   ```

   ```bash
   pnpm install
   ```

   ```bash
   pnpm start
   ```

5. 启动客户端：

   ```bash
   cd client
   ```

   ```bash
   pnpm install
   ```

   ```bash
   pnpm start
   ```

6. 此时浏览器会自动打开项目页面

**注意：**

1. 项目启动前，先确定本地电脑已经配备好相关环境（`node`，`mysql`，`redis`，`pnpm`等），推荐用`navicat`作为数据库管理软件（在里面新建本项目的数据库），用`redis desktop manager`作为`redis`管理软件。

   > 需要先全局安装`pnpm`，安装命令为：
   >
   > > `npm install -g pnpm`
   >
   > 其中关于为什么用`pnpm`不用`npm`或者`yarn`命令，参考博客：[关于现代包管理器的深度思考——为什么现在我更推荐 pnpm 而不是 npm/yarn?](https://juejin.cn/post/6932046455733485575)

   > 数据库安装相关：
   >
   > > 1、MySQL8.0.26 安装配置教程 (windows 64 位)：https://blog.csdn.net/weixin_52270997/article/details/120066948<br/>2、Navicat Premium v12.1.9 破解版 \_x86_x64：https://blog.csdn.net/juanjuan_01/article/details/84102349<br/>3、Navicat Premium 基本使用：https://blog.csdn.net/Yangchenju/article/details/80633055

   > Redis 安装相关：
   >
   > > 1、Redis 下载和安装（Windows 系统）参考链接：http://c.biancheng.net/redis/windows-installer.html （注意：在执行`redis-server.exe --service-start`前要把客户端启动关掉，否则端口会被占用）<br/>2、windows 免费安装 redis desktop manager（上 github 找到免费版最新的是 2018 年的，可以直接下载 exe 执行程序）：https://github.com/uglide/RedisDesktopManager/releases/tag/0.9.3

2. 本项目的数据库配置如下：（见`server\src\model\config.json`文件，根据自己的实际情况作出更改）

   ```json
   {
   	"host": "127.0.0.1",
   	"port": 3306,
   	"user": "root",
   	"password": "123456",
   	"database": "better-chat"
   }
   ```

   1. 首先用下面的命令或者`Navicat Premium`等工具建好数据库： （注意：在 MySQL 中，通常使用**反引号**来包围数据库、表或列名，特别是当它们包含特殊字符或关键字时。）

      ```bash
      mysql -u root -p
      ```

      ```bash
      CREATE DATABASE `better-chat`;
      ```

   2. 然后可以用`source`命令或者`Navicat Premium`等工具运行项目下的`better-chat.sql`文件，方便可以在本地数据库增加一些模拟数据，同时由于静态资源存储在本地没有上传到仓库，所以需要显示的文件会呈现兜底样式，不会报错。（注意：此步可不进行，保持数据库原始空白状态。）

3. 作者本人的环境配置：

   > node：v18.20.2
   >
   > npm：v10.5.0
   >
   > pnpm：v8.14.3
   >
   > mysql：v8.0.29
   >
   > redis：v5.0.14

**注意：如果项目运行过程中有任何问题，欢迎给项目提交`issue`，本人尽量第一时间解决。**

## 2.2 具体教程

上面提到本项目的亮点有较为完备的前端工程化配置，项目目录结构合理、清晰，组件和方法抽象程度高、代码耦合度低、文档完善。因此大部分有一点前端基础的同学直接运行并阅读项目源码即可了解整体的架构和具体的功能逻辑，可以很快对项目进行**从 0 到 1 复现**或者**二次开发**。

### 2.2.1 项目整体架构

系统的状态变化如图所示：<br/>![系统界面状态图.png](./md_images/系统界面状态图.png)

项目的前端架构如图所示：<br/>![前端架构图.png](./md_images/前端架构图.png)

项目的后端架构如图所示：<br/>![后端架构图.png](./md_images/后端架构图.png)

### 2.2.2 源码目录介绍

**前端项目目录介绍**：<br/>![client.png](./md_images/client.png)

前端项目主要看 `client\src` 这里面即可：

- `assets` 文件夹主要存放一些静态资源文件，如图片、图标、表情包、全局样式等。
- `components` 文件夹主要存放公共组件，如各种弹窗组件、聊天框组件等。
- `config` 文件夹主要存放服务器相关配置，如服务端接口的 `baseURL`、`websocket` 的 `baseURL` 等。
- `hooks` 文件夹主要存放一些自定义 `hook`，如全局提示弹窗 `hook`。
- `pages` 文件夹主要存放页面组件，如登录页面、注册页面、首页等。
- `router` 文件夹主要存放路由相关配置，即用于实现路由守卫的高阶组件。
- `utils` 文件夹主要存放一些全局通用的工具方法，如封装的 `axios` 和 `storage`、加密解密函数、时间或文件的格式化方法等。

**后端项目目录介绍**：<br/>![server.png](./md_images/server.png)

后端项目主要看 `server\src` 这里面即可：

- `controller` 文件夹主要负责处理 API 相关，将接口路由与 `service` 目录中导出的操作函数关联起来。
- `model` 文件夹负责数据库的配置和表的创建。
- `service` 文件夹负责各种操作的逻辑实现，并配备了极为清晰的注释。
- `utils` 文件夹主要存放一些全局通用的工具方法，如创建文件的方法、文件格式化方法等。
- `index.js` 是后端项目的启动文件，用于构建 `express` 服务。

对于大部分人来说，直接看源码和注释即可。因为上面提到，本项目的亮点之一便是做了较为完备的前端工程化设置，且项目目录结构合理、清晰，组件和方法抽象程度高，代码耦合度低，且配备了注释说明。下面附上几张源码图片进行证明：

**client\src\components\VideoModal\index.tsx：（音视频通话的前端处理）**<br/>音视频通话-前端主要代码逻辑：<br/>![音视频通话-前端1.png](./md_images/音视频通话-前端1.png)
音视频通话-前端建立 WebSocket 连接：<br/>![音视频通话-前端2.png](./md_images/音视频通话-前端2.png)
音视频通话-前端建立 WebRTC 连接：<br/>![音视频通话-前端3.png](./md_images/音视频通话-前端3.png)

**server\src\service\rtc\index.js：（音视频通话的服务端处理）**
![音视频通话-后端.png](./md_images/音视频通话-后端.png)

**client\src\utils\file.ts：（前端处理文件的函数集合）**
![前端处理文件相关.png](./md_images/前端处理文件相关.png)

## 2.3 如何参与本项目？

1.  Fork 本仓库
2.  新建 feat/xxx_feature 分支
3.  提交代码 (commit 规范可参照这里：https://juejin.cn/post/7264599940537532474#heading-6)
4.  新建 Pull Request

# 3、写在最后

本项目到目前为止都靠作者一人独立开发，但上面提到还有许多可扩展的功能点，也有很多缺陷待修复，因此希望更多的人参与进来，继续完善这个项目，实现更好的开源，**开源拯救世界**。

本人最近忙于学习`React`源码，当学完便会将相关资料和笔记整理出来开源，类似于本人的另一个项目：[VueSouceCodeStudy](https://github.com/XC0703/VueSouceCodeStudy)，欢迎各位大佬给本菜鸡的项目**点个 star**⭐。

🔨 本人掘金博客地址：https://juejin.cn/user/2370998127573751/posts

🎨 本人`Github`主页地址：https://github.com/XC0703

🏰 本人`Gitee`主页地址：https://gitee.com/XC0703

👉 项目`Github`地址：https://github.com/XC0703/better-chat

✨ 项目`Gitee`地址：https://gitee.com/XC0703/better-chat

上面是一些关于此项目和本人技术社区主页的地址，欢迎各位看官给小弟点个赞，与诸君共勉。同时也欢迎各位大佬扫码加入我的前端卷卷卷群，一起学习交流。<br/>![前端卷卷卷.png](./md_images/前端卷卷卷.png)
