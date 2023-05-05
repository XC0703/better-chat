// 登录接口参数类型
export interface LoginParams {
  username: string;
  password: string;
}
// 登录接口返回的data类型
export interface LoginResponseData {
  token: string;
  info: {
    id: number;
    avatar: string;
    username: string;
    name: string;
    phone: string;
    created_at: string;
    signature: string;
  };
}
