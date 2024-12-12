import { Avatar, Dropdown, Image, Layout, Menu, Space } from 'antd';
import { AuthUserContext, logOut } from 'auth/urloyalty-portal-web/authContext';
import { routers } from 'layouts/loyalty-engine-portal-web/main';
import { get, isNil } from 'lodash';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Fragment, useContext } from 'react';

const { Header } = Layout;
const HeaderLayout = () => {
  const router = useRouter();
  const { authUser } = useContext(AuthUserContext);
  return (
    <Fragment>
      <Head>
        <title> | Loyalty Engine Dashboard</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <Header
        style={{
          padding: 0,
          backgroundColor: 'white',
          boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.12)',
          zIndex: 999,
          lineHeight: 'inherit',
        }}
      >
        <Space align='center'>
          <div className='logo' style={{ padding: '10px 50px 10px 16px' }}>
            <Image
              onClick={() => router.push(`${routers[0].link}`)}
              src='/images/urloyalty-portal-web/Logo.png'
              alt='Vercel Logo'
              width={140}
              height={40}
              preview={false}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <Space align='center'>
            <Dropdown
              overlay={
                <Menu className='border-bottom'>
                  <Menu.Item key='logout'>
                    <a onClick={() => logOut()}>Đăng xuất</a>
                  </Menu.Item>
                </Menu>
              }
              placement='bottomRight'
              trigger={['click']}
              arrow
            >
              <div style={{ cursor: 'pointer' }}>
                <Avatar
                  style={{
                    backgroundColor: '#720D5D',
                    textTransform: 'uppercase',
                    verticalAlign: 'middle',
                  }}
                >
                  {!isNil(authUser) ? get(authUser, 'email', '').charAt(0) : ''}
                </Avatar>
              </div>
            </Dropdown>
          </Space>
        </Space>
      </Header>
    </Fragment>
  );
};
export default HeaderLayout;
