import Request from '@/utils/request';

/** 验证token是否有效 */
export const handleVerifyToken = async (authToken: string) => {
  const res = await Request.post('/auth/verifyToken', {authToken});
  return res.data;
}
