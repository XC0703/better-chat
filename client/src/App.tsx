import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Register from '@/pages/register';
import Login from '@/pages/login';
import Chat from '@/pages/chat';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
