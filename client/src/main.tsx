import { App, ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import '@/assets/styles/global.less';
import RouteRender from '@/router';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<BrowserRouter>
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: '#28a770'
				}
			}}
			locale={zhCN}
		>
			<App>
				<RouteRender />
			</App>
		</ConfigProvider>
	</BrowserRouter>
);
