import { Layout } from 'antd';
import React, { useState, ReactNode, useEffect } from 'react';
import isNil from 'lodash/isNil';
import Head from 'next/head';

import useTour from 'hooks/urstaff-portal-web/useTour';
import useAuthStore from 'store/useAuthStore';

import MainHeader from './MainHeader';
import MenuBar from './MenuBar';

const Layouts = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(true);

  const { authUser, setAuthUser } = useAuthStore();
  const { steps, sideBarRef, headerRef, contentRef } = useTour();
  useEffect(() => {
    if (loading) setLoading(false);
  }, [loading]);
  if (isNil(authUser) || loading) {
    return null;
  }

  return (
    <Layout
      style={{
        backgroundColor: '#F5F7FB',
        height: '100vh',
        minHeight: 700,
        minWidth: 1200,
      }}
    >
   

      <MainHeader headerRef={headerRef} authUser={authUser} setAuthUser={setAuthUser} />
      <MenuBar
        sideBarRef={sideBarRef}
        contentRef={contentRef}
        steps={steps}
        isPerk={!!authUser?.extraData?.perkAtWork}
        campaignVerifyType={authUser?.extraData?.verify}
        perkEntry={authUser?.extraData?.perkEntry}
      >
        {children}
      </MenuBar>
    </Layout>
  );
};

export default Layouts;
