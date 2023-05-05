// 注册接口参数类型
export interface RegisterParams {
  username: string;
  password: string;
  confirmPassword: string;
}
// 注册接口返回的data类型
export interface RegisterResponseData {
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

