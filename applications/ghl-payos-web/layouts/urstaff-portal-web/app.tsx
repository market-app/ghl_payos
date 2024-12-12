import 'nprogress/nprogress.css';
import NProgress from 'nprogress';
import Router, { useRouter } from 'next/router';
import { ReactNode } from 'react';
import axios from 'axios';
import { SWRConfig } from 'swr';
import { ConfigProvider } from 'antd';
import locale from 'antd/lib/locale/vi_VN';
import { App } from 'antd';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import { publicAndPublisherPageList } from 'constants/urstaff-portal-web/auth';
import { useMounted } from 'hooks/common/useMounted';
import useAuthStore from 'store/useAuthStore';

import MainLayout from 'layouts/urstaff-portal-web/MainLayout';
import AuthLayout from 'layouts/urstaff-portal-web/auth';
import { urStaffPathNames } from 'constants/urstaff-portal-web/pathName';
import { handleRedirectUrl } from 'utils/common';

ChartJS.register(ArcElement, Tooltip, Legend);

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());
NProgress.configure({ showSpinner: false });

axios.defaults.timeout = 10000;

function UrstaffLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const mounted = useMounted();

  const { authUser } = useAuthStore();
  const pathname = router.asPath?.split('?')?.[0];

  if (typeof window !== 'undefined' && router.isReady) {
    const publisherId = authUser?.publisher?.id;
    const campaignId = authUser?.campaign?.id;
    if (
      (!publisherId || !campaignId) &&
      !publicAndPublisherPageList.includes(pathname as any) &&
      !router?.query?.authToken
    ) {
      localStorage.clear();
      const loginPath = handleRedirectUrl({
        router,
        redirectPath: urStaffPathNames.LOGIN,
      });
      router.push(loginPath);
    }
  }

  const colorPrimary = '#6E2775';

  const configProps = {
    theme: {
      token: {
        colorPrimary,
      },
      components: {
        Radio: {
          colorPrimary,
        },
        Spin: {
          colorPrimary,
        },
      },
    },
    locale: locale,
  };

  if (!mounted) return null;

  if (publicAndPublisherPageList.includes(pathname as any))
    return (
      <ConfigProvider {...configProps}>
        <AuthLayout>{children}</AuthLayout>;
      </ConfigProvider>
    );

  return (
    <ConfigProvider {...configProps}>
      <App>
        <SWRConfig
          value={{
            errorRetryInterval: 2000,
            errorRetryCount: 3,
            revalidateOnFocus: false,
          }}
        >
          <MainLayout>{children}</MainLayout>
        </SWRConfig>
      </App>
    </ConfigProvider>
  );
}

export default UrstaffLayout;
