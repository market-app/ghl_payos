import Image from 'next/image';
import { Row, Col, Space } from 'antd';
import { ReactNode, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { urStaffPathNames } from 'constants/urstaff-portal-web/pathName';
import WebVersion from 'components/urstaff-portal-web/WebVersion';

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const isSelectPublisher = router.pathname.includes(urStaffPathNames.SELECT_PUBLISHER);

  const [showChild, setShowChild] = useState<boolean>(false);

  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    // You can show some kind of placeholder UI here
    return null;
  }

  return (
    <div
      style={{
        backgroundImage: 'url(/images/urstaff-portal-web/LoginBg.png)',
        backgroundSize: 'cover',
        height: '100vh',
        minHeight: 600,
        minWidth: 768,
      }}
    >
     
      <div
        style={{
          backgroundColor: 'rgb(240, 242, 245, 0.9)',
          flex: '0 0 50%',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minWidth: '450px',
          width: 'fit-content',
          height: '100vh',
        }}
      >
        <Space
          style={{
            width: isSelectPublisher ? 800 : 300,
            padding: isSelectPublisher ? 24 : 0,
          }}
          direction='vertical'
        >
          <Image src='/images/urstaff-portal-web/DigitalLogo.png' alt='Vercel Logo' width={170} height={48} />
          {children}
        </Space>
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '0',
            right: '0',
          }}
        >
          <Row>
            <Col span={12}>
              <p
                style={{
                  textAlign: 'right',
                  paddingRight: '10px',
                  borderRight: '1px solid',
                  marginBottom: 0,
                }}
              >
                Hotline:{' '}
                <a href='tel:1900299232' className='purple-text'>
                  {' '}
                  1900 299 232
                </a>
              </p>
            </Col>
            
          </Row>
          <div style={{ margin: 'auto', width: 'fit-content' }}>
            <WebVersion
              style={{
                fontSize: 10,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
