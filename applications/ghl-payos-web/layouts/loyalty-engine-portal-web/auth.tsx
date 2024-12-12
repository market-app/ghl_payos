import { Card, Col, Image, Row } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';

function LoyaltyEngineAuthLayout({ children }: { children: ReactNode }) {
  const [, setLocale] = useState<string | undefined>('VI');
  const [showChild, setShowChild] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setLocale(router.locale ?? 'VI');
  }, [router]);
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
        display: 'flex',
        height: '100vh',
        minHeight: 600,
        minWidth: 768,
      }}
    >
      <Head>
        <title>Loyalty Engine Dashboard</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <div
        style={{
          backgroundColor: 'white',
          flex: '0 0 536px',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card style={{ width: 300 }} bordered={false}>
          <Image
            src='/images/urloyalty-portal-web/Logo.png'
            alt='Vercel Logo'
            width={170}
            height={48}
            preview={false}
          />
          {children}
        </Card>
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
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: '1 1 auto',
          padding: '30px',
        }}
      >
        <Image
          src='/images/urloyalty-portal-web/login-background.png'
          alt='login background'
          width={818}
          height={577}
          preview={false}
        />
      </div>
    </div>
  );
}
export default LoyaltyEngineAuthLayout;
