module.exports = {
  singleRTCConnect,
};

let rooms = {};

/**
 * 建立音视频聊天
 * 1. 获取房间号和当前用户名
 * 2. createRoom 邀请人会发送创建房间指令,广播给当前房间的所有人,如果被邀请者在线的话,会接受到请求,自动打开语音/视频通话界面
 * 3. peer 被邀请人收到邀请后,前端点击同意后,会携带自己的音视频流数据发送peer指令给后端,后端在发送offer指令(携带了相对于的数据)给邀请人
 * 4. answer 邀请人接受到数据后将数据进行处理后发送answer指令给被邀请人并携带自己的音视频流
 * 5. ice_candidate 双方建立音视频通道后发送ice_candidate数据
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
