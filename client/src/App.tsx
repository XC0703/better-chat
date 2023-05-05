import { Routes, BrowserRouter, Route } from 'react-router-dom';
import Register from '@/pages/register';
import Login from '@/pages/login';
import Chat from '@/pages/chat';
import { withPrivateRoute } from '@/components/PrivateRoute';

// 用于给需要登录才能访问的页面添加路由守卫
const ChatWithPrivateRoute = withPrivateRoute(Chat);
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatWithPrivateRoute />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
