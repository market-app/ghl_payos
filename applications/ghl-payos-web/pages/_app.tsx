import 'antd/dist/reset.css';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import localeData from 'dayjs/plugin/localeData';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import weekday from 'dayjs/plugin/weekday';
import type { AppProps } from 'next/app';
import 'styles/globals.css';
import { SWRConfig } from 'swr';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(LocalizedFormat);
dayjs.locale('vi');
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(isSameOrBefore);

function App({ Component, pageProps }: AppProps) {
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
