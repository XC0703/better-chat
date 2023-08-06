// 服务端接口的baseURL
export const apiBaseURL = 'http://127.0.0.1:3000/api/chat/v1'

// 建立websocket的baseURL
export const wsBaseURL = 'ws://127.0.0.1:3000/api/chat/v1';

// 服务器的地址URL
export const serverURL = 'http://127.0.0.1:3000'

//ice服务器地址
export const iceServer = {
  iceServers: [
      {
          urls: "turn:42.192.40.58:3478?transport=udp",
          username: "ddssingsong",
          credential: "123456",
      },
      {
          urls: "turn:42.192.40.58:3478?transport=tcp",
          username: "ddssingsong",
          credential: "123456",
      },
  ],
};
