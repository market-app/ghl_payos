import { Col, Layout, Menu, Row, Tour, TourProps } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { ReactNode, Ref, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { filterMenu, getUserPermissions, LOCAL_STORAGE_KEY } from 'auth/urstaff-portal-web/authorization';
import { GET_MENU, IMenuCustom } from 'constants/urstaff-portal-web/menu';
import { urStaffPathNames } from 'constants/urstaff-portal-web/pathName';
import swipe from 'public/images/urstaff-portal-web/swipe.svg';

import WebVersion from 'components/urstaff-portal-web/WebVersion';

const { Content, Sider } = Layout;

interface MenuBarProps {
  sideBarRef: Ref<any>;
  contentRef: Ref<any>;
  children: ReactNode;
  steps: TourProps['steps'];
  isPerk?: boolean;
  campaignVerifyType?: string;
  perkEntry: boolean;
}

const MenuBar: React.FC<MenuBarProps> = ({
  sideBarRef,
  contentRef,
  children,
  steps,
  isPerk,
  campaignVerifyType,
  perkEntry,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [defaultOpenKeys, setDefaultOpenKeys] = useState<string[] | undefined>(undefined);
  const [menu, setMenu] = useState<IMenuCustom[]>([]);
  const [openTour, setOpenTour] = useState<boolean>(false);

  const { t } = useTranslation();
  const router = useRouter();

  const onCollapse = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    const userPermissions = getUserPermissions();
    const MENU = filterMenu(
      map(userPermissions, 'rsname'),
      GET_MENU(() => setOpenTour(true), isPerk || false, campaignVerifyType || 'email', perkEntry),
    );

    setMenu(MENU);
  }, [setOpenTour, isPerk]);

  useEffect(() => {
    const path = router.asPath.split('?')[0];
    setSelectedKeys([path]);

    const subMenu = find(menu, (item: IMenuCustom) => {
      const children: IMenuCustom[] = get(item, 'children', []);

      return children.length > 0 && find(children, (child) => child.key === path);
    }) as ItemType | null;

    setDefaultOpenKeys([get(subMenu, 'key', '').toString()]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath, menu]);

  const renderTrigger = (
    <Row
      style={{
        background: '#F5F7FB',
        color: 'black',
        paddingLeft: 16,
        paddingRight: 16,
        cursor: openTour ? 'not-allowed' : 'pointer',
      }}
      justify='space-between'
      align='middle'
    >
      {!collapsed && (
        <Col>
          <div style={{ position: 'relative' }}>{t('Layout.Compact')}</div>
          <WebVersion
            style={{
              position: 'absolute',
              bottom: 2,
              left: -4,
              fontSize: 10,
              width: 40,
            }}
          />
        </Col>
      )}
      <Col
        style={{
          margin: collapsed ? 'auto' : '',
        }}
      >
        {collapsed ? (
          <Image
            src={swipe}
            alt='swipe-icon'
            style={{
              transform: 'rotate(180deg)',
              height: '48px',
            }}
          />
        ) : (
          <Image
            src={swipe}
            alt='swipe-icon'
            style={{
              height: '48px',
            }}
          />
        )}
      </Col>
    </Row>
  );

  useEffect(() => {
    const tour =
      localStorage.getItem(LOCAL_STORAGE_KEY.TOUR) === 'true' || localStorage.getItem(LOCAL_STORAGE_KEY.TOUR) === null;

    let timeout: ReturnType<typeof setTimeout>;

    if (tour) {
      timeout = setTimeout(() => {
        setOpenTour(tour);
        localStorage.setItem(LOCAL_STORAGE_KEY.TOUR, 'false');
      }, 1000);
    }

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Content>
      <Layout style={{ height: '100%' }}>
        <Sider
          style={{ boxShadow: '0px 4px 16px 0px rgba(0, 0, 0, 0.05)' }}
          ref={sideBarRef}
          width={240}
          collapsedWidth={60}
          className='side-bar-custom'
          collapsible
          collapsed={collapsed}
          onCollapse={openTour ? undefined : onCollapse}
          trigger={renderTrigger}
        >
          <Menu
            theme='light'
            mode='inline'
            style={{ marginTop: 64 }}
            items={menu}
            selectedKeys={selectedKeys}
            defaultOpenKeys={defaultOpenKeys}
            disabled={router.asPath === urStaffPathNames.SELECT_PUBLISHER}
            inlineCollapsed={false}
          />
        </Sider>

        <Content
          ref={contentRef}
          style={{
            padding: 24,
            overflow: 'auto',
            backgroundColor: '#F5F7FB',
            minWidth: 1200,
            marginTop: 64,
            marginLeft: collapsed ? 60 : 240,
          }}
        >
          {children}
          <Tour open={openTour} onClose={() => setOpenTour(false)} steps={steps} />
        </Content>
      </Layout>
    </Content>
  );
};

export default MenuBar;
