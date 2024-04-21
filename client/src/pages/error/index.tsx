import { Empty } from 'antd';

// 一个简单的兜底页面，用于展示 404 等错误页面
const BottomPage = () => (
	<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
		<Empty description={false} />
	</div>
);

export default BottomPage;
