import { Button, Divider, Form, Input, notification, Typography } from 'antd';
import { getActiveSubscription, getPaymentGatewayKeys, updatePaymentGatewayKeys } from 'apis';
import CustomerInfo from 'components/CustomerInfo';
import LoadingPage from 'components/LoadingPage';
import SubscriptionDetail from 'components/SubscriptionDetail';
import { get, isEmpty } from 'lodash';
import { Router, useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IPayOSPaymentGatewayKey } from 'types';

const PayOSConfig = () => {
  const router = useRouter();
  const [form] = Form.useForm<IPayOSPaymentGatewayKey>();
  const [payload, setPayload] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);

  const onSubmit = () => {
    setLoadingSubmit(true);
    form
      .validateFields()
      .then((values) => {
        const { checksumKey, clientId, apiKey } = values;
        updatePaymentGatewayKeys({ checksumKey, clientId, apiKey }, payload)
          .then((res) => {
            notification.success({ message: 'Cập nhập thông tin thành công' });
          })
          .catch((err) => {
            console.log(err);
            notification.error({
              message: get(err, 'response.data.message', 'Có lỗi trong quá trình cập nhập thông tin'),
            });
          })
          .finally(() => {
            setLoadingSubmit(false);
          });
      })
      .catch(() => {
        setLoadingSubmit(false);
      });
  };

  /**
   * Lấy payload để decrypt ra các thông tin của client
   */
  const handleMessage = async ({ data }: MessageEvent) => {
    if (data.message !== 'REQUEST_USER_DATA_RESPONSE') {
      setLoading(false);
      return;
    }

    window.removeEventListener('message', handleMessage);
    const encryptKey = get(data, 'payload');
    setPayload(encryptKey);

    try {
      const infoSub = await getActiveSubscription(encryptKey);
      setSubscriptions(infoSub as any);

      if (isEmpty(infoSub)) return;
      const infoGateway = await getPaymentGatewayKeys(encryptKey);

      form.setFieldsValue(infoGateway as any);
    } catch (error) {
      notification.error({
        message: get(error, 'response.data.message', `${error}`),
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    window.parent.postMessage({ message: 'REQUEST_USER_DATA' }, '*');

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    if (isEmpty(subscriptions) && payload && !loading) {
      router.push(`/buy-plan?payload=${encodeURIComponent(payload)}`);
    }
  }, [payload, loading, subscriptions]);

  if (loading || isEmpty(subscriptions)) {
    return <LoadingPage />;
  }

  return (
    <div>
      <SubscriptionDetail subscriptions={subscriptions} payload={payload} />
      <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} style={{ marginTop: '30px' }}>
        <div>
          <Typography.Title level={4}>Thông tin cổng thanh toán</Typography.Title>
          <Form.Item name={['clientId']} label='Client Id' rules={[{ required: true, message: 'Bạn chưa điền key' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name={['apiKey']} label='Api Key' rules={[{ required: true, message: 'Bạn chưa điền key' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            name={['checksumKey']}
            label='Checksum Key'
            rules={[{ required: true, message: 'Bạn chưa điền key' }]}
          >
            <Input.Password />
          </Form.Item>
        </div>
        <br />
        <div className='flex justify-end'>
          <Button type='primary' onClick={onSubmit} loading={loadingSubmit}>
            Tiến hành liên kết với payOS
          </Button>
        </div>
      </Form>
      <Divider />
      <CustomerInfo payload={payload} />
    </div>
  );
};

export default PayOSConfig;
