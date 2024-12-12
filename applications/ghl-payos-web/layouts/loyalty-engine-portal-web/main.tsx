import {
  LaptopOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  DeploymentUnitOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import HeaderLayout from 'components/loyalty-engine-portal-web/HeaderLayout';
import { pathNames } from 'constants/pathNames';
import { useRouter } from 'next/router';
import { createElement, ReactNode, useEffect, useState } from 'react';
import { IRoutes, renderMenuByRoutes } from './routes';

export const routers: Array<IRoutes> = [
  {
    key: '/customer-management',
    link: '/customer-management',
    icon: <UserOutlined />,
    title: 'Quản lý khách hàng',
    children: [],
  },
  {
    key: '/tier-management',
    link: '/tier-management',
    icon: <DeploymentUnitOutlined />,
    title: 'Quản lý phân hạng',
    children: [],
  },
  {
    key: '/program-management',
    link: '/program-management',
    icon: <LaptopOutlined />,
    title: 'Quản lý chương trình',
    children: [],
  },
];

function LoyaltyEngineLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [path, setPath] = useState(String);
  const [showChild, setShowChild] = useState(false);
  const [collapsed, setCollapsed] = useState(window.localStorage.getItem('collapsed') === 'true' ? true : false);
  const onCollapse = () => {
    setCollapsed(!collapsed);
    window.localStorage.setItem('collapsed', `${!collapsed}`);
  };
  useEffect(() => {
    // xử lý active cho sub menu
    const paths = router.pathname.split(pathNames.LOYALTY_ENGINE_PORTAL_WEB);
    const path = paths.length > 0 ? paths[paths.length - 1] : '';
    setPath(path);
    if (router.isReady) {
      setShowChild(true);
    }
  }, [router]);
  if (!showChild) {
    // You can show some kind of placeholder UI here
    return null;
  }
  return (
    <Layout
      style={{
        backgroundColor: '#EFF0F9',
        height: '100vh',
        minHeight: 700,
        minWidth: 1200,
      }}
    >
      <HeaderLayout />
      <Layout.Content>
        <Layout className='site-layout-background' style={{ height: '100%' }}>
          <Layout.Sider
            width={250}
            collapsedWidth={60}
            className='site-layout-background'
            trigger={createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: onCollapse,
              style: { color: 'black' },
            })}
            style={{ backgroundColor: '#F5F7FB' }}
            // collapsible
            collapsed={collapsed}
            onCollapse={onCollapse}
          >
            <Menu
              theme='light'
              mode='inline'
              style={{ backgroundColor: '#F5F7FB', paddingTop: 10 }}
              selectedKeys={[path]}
              // auto extend menu tổng, do có 1 menu à
              defaultOpenKeys={[routers[0].key]}
            >
              {renderMenuByRoutes(routers)}
            </Menu>
          </Layout.Sider>
          <Layout.Content
            className='site-layout-background'
            style={{
              padding: 24,
              height: '100%',
              overflow: 'auto',
            }}
          >
            {children}
          </Layout.Content>
        </Layout>
      </Layout.Content>
    </Layout>
  );
}
export default LoyaltyEngineLayout;
