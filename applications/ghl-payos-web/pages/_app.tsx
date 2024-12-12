import 'antd/dist/reset.css';
import React, { useEffect } from 'react';
import i18n from 'i18n';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useRouter } from 'next/router';
import { SWRConfig } from 'swr';
import type { AppProps } from 'next/app';
import 'styles/globals.css';
import { pathNames } from 'constants/pathNames';

import UrstaffLayout from 'layouts/urstaff-portal-web/app';
import { publicPageList } from 'constants/urloyalty-portal-web';
import { UrLoyaltyAuthUserProvider } from 'auth/urloyalty-portal-web/authContext';
import { ConfigProvider } from 'antd';
import UrLoyaltyLayout from 'layouts/urloyalty-portal-web/main';
import UrLoyaltyAuthLayout from 'layouts/urloyalty-portal-web/auth';
import { publicPageLoyaltyEngineList } from 'constants/loyalty-engine-portal-web';
import { LoyaltyEngineAuthUserProvider } from 'auth/loyalty-engine-portal-web/authContext';
import LoyaltyEngineAuthLayout from 'layouts/loyalty-engine-portal-web/auth';
import LoyaltyEngineLayout from 'layouts/loyalty-engine-portal-web/main';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(LocalizedFormat);
dayjs.locale('vi');
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(isSameOrBefore);

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    i18n;
  }, []);

  if (router.pathname.includes(pathNames.LOYALTY_ENGINE_PORTAL_WEB)) {
    if (publicPageLoyaltyEngineList.indexOf(router.pathname) !== -1) {
      return (
        <LoyaltyEngineAuthUserProvider>
          <LoyaltyEngineAuthLayout>
            <Component {...pageProps} />
          </LoyaltyEngineAuthLayout>
        </LoyaltyEngineAuthUserProvider>
      );
    }

    return (
      <LoyaltyEngineAuthUserProvider>
        <SWRConfig
          value={{
            errorRetryInterval: 2000,
            errorRetryCount: 3,
            revalidateOnFocus: false,
          }}
        >
          <ConfigProvider>
            <LoyaltyEngineLayout>
              <Component {...pageProps} />
            </LoyaltyEngineLayout>
          </ConfigProvider>
        </SWRConfig>
      </LoyaltyEngineAuthUserProvider>
    );
  }

  if (router.pathname.includes(pathNames.URSTAFF_PORTAL_WEB)) {
    return (
      <UrstaffLayout>
        <Component {...pageProps} />
      </UrstaffLayout>
    );
  } else if (router.pathname.includes(pathNames.URLOYALTY_PORTAL_WEB)) {
    if (publicPageList.indexOf(router.pathname) !== -1) {
      return (
        <UrLoyaltyAuthUserProvider>
          <UrLoyaltyAuthLayout>
            <Component {...pageProps} />
          </UrLoyaltyAuthLayout>
        </UrLoyaltyAuthUserProvider>
      );
    } else {
      return (
        <UrLoyaltyAuthUserProvider>
          <SWRConfig
            value={{
              errorRetryInterval: 2000,
              errorRetryCount: 3,
              revalidateOnFocus: false,
            }}
          >
            <ConfigProvider>
              <UrLoyaltyLayout>
                <Component {...pageProps} />
              </UrLoyaltyLayout>
            </ConfigProvider>
          </SWRConfig>
        </UrLoyaltyAuthUserProvider>
      );
    }
  }

  return (
    <>
      <SWRConfig
        value={{
          errorRetryInterval: 2000,
          errorRetryCount: 3,
          revalidateOnFocus: false,
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </>
  );
}

export default App;
