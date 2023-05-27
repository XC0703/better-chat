import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/assets/global.less';
import { ConfigProvider } from 'antd';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#28a770',
        },
      }}
    >
      <App />
    </ConfigProvider>
  </BrowserRouter>,
);
