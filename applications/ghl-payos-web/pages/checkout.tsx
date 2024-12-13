import { usePayOS } from "payos-checkout";
import { useEffect } from "react";

const Checkout = () => {
  const PAYOS_IFRAME_ELEMENT_ID = "payos_checkout_url";

  const openIframePayOS = (checkoutUrl: string) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { open } = usePayOS({
      RETURN_URL: window.location.href,
      ELEMENT_ID: PAYOS_IFRAME_ELEMENT_ID,
      CHECKOUT_URL: checkoutUrl,
      onSuccess: (event) => {
        console.info("Thanh toán thành công.");

        const { id } = event;
        window.parent.postMessage(
          JSON.stringify({ type: "custom_element_success_response", chargeId: id }),
          "*"
        );
      },
      onExit: () => {
        window.parent.postMessage(JSON.stringify({ type: "custom_element_close_response" }), "*");
      },
      onCancel: () => {
        window.parent.postMessage(JSON.stringify({ type: "custom_element_close_response" }), "*");
      },
    });
    open();
  };
  const createPaymentLink = async (locationId: string, amount: number, transactionId: string) => {
    try {
      const data = await fetch(`/api/create-order?locationId=${locationId}`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          transactionId,
          redirect_uri: window.location.href,
        }),
      }).then(async (response) => {
        const jsonData = await response.json();
        if (response.ok) return jsonData;

        return Promise.reject(jsonData);
      });

      if (!data?.checkoutUrl) return;

      openIframePayOS(data.checkoutUrl);
    } catch (error) {
      console.error(error);

      // postMessage to parent when fail
      window.parent.postMessage(
        JSON.stringify({ type: "custom_element_error_response", error }),
        "*"
      );
    }
  };
  const handleMessage = async ({ data }: MessageEvent) => {
    const paymentInfo = JSON.parse(data);
    window.removeEventListener("message", handleMessage);

    
    const { locationId, amount, transactionId } = paymentInfo;
    await createPaymentLink(locationId, amount, transactionId);
  };

  useEffect(() => {
    // ready to receive payment data
    window.parent.postMessage(JSON.stringify({ type: "custom_provider_ready", loaded: true }), "*");

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div className="bg-transparent">
      <div id={PAYOS_IFRAME_ELEMENT_ID}></div>
    </div>
  );
};

export default Checkout;
