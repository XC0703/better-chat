import { App } from 'antd';

// 全局提示弹窗封装
const useShowMessage = () => {
	const { message } = App.useApp();
	return (type: 'success' | 'error' | 'warning' | 'info', text: string, duration?: number) => {
		message[type](text, duration || 1.5);
	};
};
export default useShowMessage;
