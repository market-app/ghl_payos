import { createPaymentLink } from 'apis';
import { get } from 'lodash';
import { usePayOS } from 'payos-checkout';
import { useEffect, useState } from 'react';

const Checkout = () => {
  const PAYOS_IFRAME_ELEMENT_ID = 'payos_checkout_url';
  const [error, setError] = useState(null);
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
    const paymentInfo = JSON.parse(data);
    window.removeEventListener('message', handleMessage);

    const { locationId, amount, transactionId } = paymentInfo;
    createPaymentLink({
      locationId,
      amount,
      transactionId,
      redirectUri: window.location.href,
    })
      .then((res) => {
        openIframePayOS(res as any);
      })
      .catch((err) => {
        setError(get(err, 'response.data.message', 'Có lỗi xảy ra khi tạo link thanh toán'));
      });
  };

  useEffect(() => {
    // ready to receive payment data
    window.parent.postMessage(JSON.stringify({ type: 'custom_provider_ready', loaded: true }), '*');

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div className='bg-transparent'>
      <div id={PAYOS_IFRAME_ELEMENT_ID}></div>
      {error && <div className='loading-page'>{error}</div>}
    </div>
  );
};

export default Checkout;
