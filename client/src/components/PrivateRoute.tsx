import React from 'react';
import { Route, Navigate } from 'react-router-dom';

interface Props {
  path: string;
  element: React.ReactNode;
  isAuthenticated: boolean;
}

const PrivateRoute = ({ path, element, isAuthenticated }: Props) => {
  if (isAuthenticated) {
    return <Route path={path} element={element} />;
  } else {
    return <Navigate to="/login" replace />;
  }
};
// 高阶组件，用于给需要登录才能访问的页面添加路由守卫
export const withPrivateRoute = (Component: React.ElementType) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const WrappedComponent = (props: any) => {
    const { isAuthenticated } = props;
    return <PrivateRoute path="/" element={<Component {...props} />} isAuthenticated={isAuthenticated} />;
  };
  return WrappedComponent;
};
