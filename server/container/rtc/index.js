module.exports = {
  singleRTCConnect,
};

let rooms = {};

/**
 * 建立音视频聊天逻辑
 * 1. 邀请方点击相关按钮后，建立websocket连接，发送createRoom通知，判断能否进行通话，能则通知好友打开音视频通话界面，不能则返回notConnect及原因
 * 2. 被邀请方发送ice_candidate通知给邀请方，并且携带ICE 候选者（ICE Candidate）的信息给对方
 * 2. 被邀请方如果在线，也建立websocket连接，打开音视频通话界面（注意：这里是利用LoginRooms的websocket连接收到createRoom通知的），并收到ICE 候选者（ICE Candidate）的信息
 * 3. 被邀请方点击接受后，发送new_peer通知，通知邀请方，邀请人接收到有新人进入房间,则发送视频流和offer指令给新人
 * 4. 被邀请方收到offer通知后，发送answer指令(携带自己的音视频)告诉对方要存储我方的音视频
 */
async function singleRTCConnect(ws, req) {
  //获取name
  let url = req.url.split("?")[1];
  let params = new URLSearchParams(url);
  let room = params.get("room");
  let username = params.get("username");
  if (!rooms[room]) {
    rooms[room] = {};
  }
  rooms[room][username] = ws;
  ws.on("message", async (Resp_data) => {
    let message = JSON.parse(Resp_data);
    let msg;
    let receiverWs;
    const { receiver_username } = message;
    switch (message.name) {
      // 创建房间，判断能不能进行通话，能则通知好友打开音视频通话界面，不能则返回notConnect及原因
      case "createRoom":
        if (!LoginRooms[receiver_username]) {
          ws.send(
            JSON.stringify({ name: "notConnect", result: "对方当前不在线!!!" })
          );
          return;
        }
        if (LoginRooms[receiver_username].status) {
          ws.send(
            JSON.stringify({ name: "notConnect", result: "对方正在通话中!!!" })
          );
          return;
        }
        if (LoginRooms[username].status) {
          ws.send(
            JSON.stringify({
              name: "notConnect",
              result: "你正在通话中,请勿发送其他通话请求....",
            })
          );
          return;
        }
        //设置当前用户通话状态
        LoginRooms[username].status = true;
        //发送邀请
        msg = {
          name: "createRoom",
          sender_username: username,
          mode: message.mode,
        };
        LoginRooms[receiver_username].ws.send(JSON.stringify(msg));
        break;
      //新用户加入
      case "new_peer":
        msg = {
          name: "new_peer",
          sender_username: username,
        };
        broadcastSocket(username, room, msg);
        break;
      //被邀请方接收
      case "offer":
        //发送offer
        msg = {
          name: "offer",
          sender_username: username,
          data: message.data,
        };
        receiverWs = rooms[room][message.receiver];
        receiverWs.send(JSON.stringify(msg));
        break;
      //接收answer
      case "answer":
        //接收answer
        msg = {
          name: "answer",
          sender_username: username,
          data: message.data,
        };
        receiverWs = rooms[room][message.receiver];
        receiverWs.send(JSON.stringify(msg));
        break;
      case "ice_candidate":
        //接收answer
        msg = {
          name: "ice_candidate",
          sender_username: username,
          data: message.data,
        };
        receiverWs = rooms[room][message.receiver];
        receiverWs.send(JSON.stringify(msg));
        break;
      //被邀请方拒绝--两方都会收到
      case "reject":
        msg = {
          name: "reject",
          sender_username: username,
        };
        broadcastSocket(username, room, msg);
        LoginRooms[username].status = false;
        break;
    }
  });
  ws.on("close", () => {
    rooms[room][username] = "";
  });
}
//发送给其他人
const broadcastSocket = (username, room, data) => {
  for (const key in rooms[room]) {
    if (key == username) {
      continue;
    }
    if (rooms[room][key]) {
      let ws = rooms[room][key];
      ws.send(JSON.stringify(data));
    }
  }
};
