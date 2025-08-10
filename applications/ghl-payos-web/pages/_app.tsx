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
// import Script from 'next/script';
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
        {/* <Script id='ms-clarity' strategy='afterInteractive'>{`
        (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "qa9r2ro61q");
      `}</Script> */}
        <Component {...pageProps} />
      </SWRConfig>
    </>
  );
}

export default App;
