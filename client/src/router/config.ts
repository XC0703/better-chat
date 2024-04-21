import { lazy } from 'react';

import { withPrivateRoute } from './private';

import Login from '@/pages/login';
import Register from '@/pages/register';

export interface IRouter {
	name?: string;
	redirect?: string;
	path: string;
	children?: Array<IRouter>;
	component: React.ComponentType;
}

export const router: Array<IRouter> = [
	{
		path: '/',
		component: withPrivateRoute(lazy(() => import('@/pages/home'))), // 需要登录才能访问的页面
		children: [
			{
				path: 'chat',
				component: withPrivateRoute(lazy(() => import('@/pages/home')))
			},
			{
				path: 'address-book',
				component: withPrivateRoute(lazy(() => import('@/pages/home')))
			}
		]
	},
	{
		path: '/login',
		component: Login
	},
	{
		path: '/register',
		component: Register
	},
	{
		path: '*',
		component: lazy(() => import('@/pages/error')),
		redirect: '/'
	}
];
