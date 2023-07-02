import { ConfigProvider, App } from 'antd';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import '@/assets/styles/global.less';
import RouterConfig from '@/router';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#28a770',
        },
      }}
    >
      <App>
        <RouterConfig />
      </App>
    </ConfigProvider>
  </BrowserRouter>,
);
