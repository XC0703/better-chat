import { ConfigProvider } from 'antd';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from '@/App';
import '@/assets/styles/global.less';

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
