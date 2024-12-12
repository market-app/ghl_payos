import React, { createElement, ReactNode, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Layout, Menu } from 'antd';
import HeaderLayout from 'components/urloyalty-portal-web/HeaderLayout';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LaptopOutlined,
  AreaChartOutlined,
  TransactionOutlined,
} from '@ant-design/icons';
import routes, { IRoutes } from './routes';
import { useRouter } from 'next/router';

const routers: Array<IRoutes> = [
  {
    key: 'merchant-devices',
    link: '/merchant-devices',
    icon: <LaptopOutlined />,
    title: 'Quản lý thiết bị',
    child: [],
  },
  {
    key: 'merchant-programs',
    link: '/merchant-programs',
    icon: <AreaChartOutlined />,
    title: 'Quản lý chương trình',
    child: [],
  },
  {
    key: 'event-activities',
    link: '/event-activities',
    icon: <TransactionOutlined />,
    title: 'Quản lý giao dịch',
    child: [],
  },
];

function UrLoyaltyLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [locale, setLocale] = useState('VI');
  const [path, setPath] = useState(String);
  const [showChild, setShowChild] = useState(false);
  const [collapsed, setCollapsed] = useState(window.localStorage.getItem('collapsed') === 'true' ? true : false);
  const onCollapse = () => {
    setCollapsed(!collapsed);
    window.localStorage.setItem('collapsed', `${!collapsed}`);
  };
  useEffect(() => {
    const paths = router.pathname.split('/');
    const path = paths.length > 0 ? paths[2] : '';
    setPath(path);
    setLocale(router.locale ?? 'VI');
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
            >
              {routes({
                routes: routers,
                campaignId: router.query.campaign_id,
              })}
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
export default UrLoyaltyLayout;
