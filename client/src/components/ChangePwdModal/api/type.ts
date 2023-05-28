// 注册接口参数类型
export interface IChangeParams {
  username: string;
  phone: string;
  password: string;
  confirmPassword: string;
}
// 本地存储的用户信息类型
export interface IUserInfo {
  id: number;
  avatar: string;
  username: string;
  name: string;
  phone: string;
  created_at: string;
  signature: string;
}

