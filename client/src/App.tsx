import { useEffect, useState } from 'react';
import { Routes, BrowserRouter, Route } from 'react-router-dom';
import Register from '@/pages/register';
import Login from '@/pages/login';
import Chat from '@/pages/chat';
import { withPrivateRoute } from '@/components/PrivateRoute';
import { tokenStorage } from '@/common/storage';
import { handleVerifyToken } from '@/utils/handleVerifyToken';

// 用于给需要登录才能访问的页面添加路由守卫
const ChatWithPrivateRoute = withPrivateRoute(Chat);
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authToken = tokenStorage.getItem();
    if (authToken) {
      // 向服务端验证authToken的有效性
      handleVerifyToken(authToken).then((res) => {
        if (res.data.code === 200 && res.data.data === 1) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      });
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatWithPrivateRoute isAuthenticated={isAuthenticated} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
