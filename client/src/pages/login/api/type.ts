// 登录接口参数类型
export interface LoginParams {
  username: string;
  password: string;
}
// 登录接口返回的data类型
export interface LoginResponseData {
  username: string;
  avatar: string;
  phone: string;
  name: string;
  signature: string;
  created_at: string;
}
