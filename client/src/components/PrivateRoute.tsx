import React, { useEffect, useState } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { tokenStorage } from '@/common/storage';
// import { handleVerifyToken } from '@/utils/handleVerifyToken';

interface Props {
  path: string;
  element: React.ReactNode;
}

const PrivateRoute = ({ path, element }: Props) => {
  const [PrivateComponent, setPrivateComponent] = useState(<Navigate to="/login" replace />);
  useEffect(() => {
    const authToken = tokenStorage.getItem();
    if (authToken) {
      setPrivateComponent(<Route path={path} element={element} />);
      // 向服务端验证authToken的有效性
      // handleVerifyToken(authToken).then((res) => {
      //   if (res.data.code === 200 && res.data.data === 1) {
      //     setIsAuthenticated(true);
      //   } else {
      //     setIsAuthenticated(false);
      //   }
      // });
      console.log('PrivateComponent', PrivateComponent);
    } else {
      setPrivateComponent(<Navigate to="/login" replace />);
    }
  }, []);
  return <>{PrivateComponent}</>;
};
// 高阶组件，用于给需要登录才能访问的页面添加路由守卫
export const withPrivateRoute = (Component: React.ElementType) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const WrappedComponent = (props: any) => {
    return <PrivateRoute path="/" element={<Component {...props} />} />;
  };
  return WrappedComponent;
};
