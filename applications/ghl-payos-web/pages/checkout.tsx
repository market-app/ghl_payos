import { notification } from 'antd';
import { createPaymentLink } from 'apis';
import LoadingPage from 'components/LoadingPage';
import { get } from 'lodash';
import { usePayOS } from 'payos-checkout';
import { useEffect, useLayoutEffect, useState } from 'react';

const Checkout = () => {
  const PAYOS_IFRAME_ELEMENT_ID = 'payos_checkout_url';
  const [loading, setLoading] = useState(true);

  const openIframePayOS = (checkoutUrl: string) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { open } = usePayOS({
      RETURN_URL: window.location.href,
      ELEMENT_ID: PAYOS_IFRAME_ELEMENT_ID,
      CHECKOUT_URL: checkoutUrl,
      onSuccess: (event) => {
        console.info('Thanh toán thành công.');

        const { id } = event;
        window.parent.postMessage(JSON.stringify({ type: 'custom_element_success_response', chargeId: id }), '*');
      },
      onExit: () => {
        window.parent.postMessage(JSON.stringify({ type: 'custom_element_close_response' }), '*');
      },
      onCancel: () => {
        window.parent.postMessage(JSON.stringify({ type: 'custom_element_close_response' }), '*');
      },
    });
    open();
  };

  const handleMessage = async ({ data }: MessageEvent) => {
    try {
      const paymentInfo = JSON.parse(data);

      const { locationId, amount, transactionId, orderId } = paymentInfo;
      console.log(paymentInfo)
      // check có data của GHL mới remove  listen message
      if (locationId && amount && orderId) {
        window.removeEventListener('message', handleMessage);
      }
      const res = await createPaymentLink({
        locationId,
        amount,
        transactionId,
        orderId,
        redirectUri: window.location.href,
        params: {
          data,
        },
      });

      if (amount == 0) {
        window.parent.postMessage(
          JSON.stringify({ type: 'custom_element_success_response', chargeId: transactionId }),
          '*',
        );
        return;
      }
      openIframePayOS(get(res, 'checkoutUrl', ''));
    } catch (error) {
      notification.error({
        message: 'Có lỗi xảy ra khi tạo link thanh toán',
        description: get(error, 'response.data.message'),
      });
      setTimeout(() => {
        window.parent.postMessage(JSON.stringify({ type: 'custom_element_close_response' }), '*');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    // ready to receive payment data
    window.parent.postMessage(JSON.stringify({ type: 'custom_provider_ready', loaded: true }), '*');

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div className='bg-transparent'>
      {loading && <LoadingPage />}
      <div id={PAYOS_IFRAME_ELEMENT_ID}></div>
    </div>
  );
};

export default Checkout;
