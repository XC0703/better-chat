import React from 'react';

import Login from '@/pages/login';
import { tokenStorage } from '@/utils/storage';

interface Props {
  element: React.ReactNode;
}

const PrivateRoute = ({ element }: Props) => {
  const authToken = tokenStorage.getItem();
  if (authToken) {
    return <>{element}</>;
  }
  return (
    <>
      <Login />
    </>
  );
};
// 高阶组件，用于给需要登录才能访问的页面添加路由守卫(没有似乎也可以，但是刷新页面偶尔会出现问题)
export const withPrivateRoute = (Component: React.ElementType) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const WrappedComponent = (props: any) => {
    return <PrivateRoute element={<Component {...props} />} />;
  };
  return WrappedComponent;
};
