import { Button, Divider, Form, Input, notification, Typography } from 'antd';
import { updatePaymentGatewayKeys } from 'apis';
import { get } from 'lodash';
import { useEffect, useState } from 'react';
import { IPayOSPaymentGatewayKey } from 'types';

const PayOSConfig = () => {
  const [form] = Form.useForm<IPayOSPaymentGatewayKey>();
  const [payload, setPayload] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = () => {
    setLoading(true);
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
            setLoading(false);
          });
      })
      .catch(() => {
        setLoading(false);
      });
  };
  const getInfoAppKey = async (locationId: string, companyId: string) => {
    try {
      const data = await fetch(`api/provider-config?locationId=${locationId}&companyId=${companyId}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async (response) => {
        const jsonData = await response.json();
        if (response.ok) return jsonData;

        return Promise.reject(jsonData);
      });
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Lấy payload để decrypt ra các thông tin của client
   */
  const handleMessage = async ({ data }: MessageEvent) => {
    if (data.message === 'REQUEST_USER_DATA_RESPONSE') {
      window.removeEventListener('message', handleMessage);

      console.log(data);
      setPayload(get(data, 'payload'));
    }
  };
  useEffect(() => {
    window.parent.postMessage({ message: 'REQUEST_USER_DATA' }, '*');

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div>
      <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} style={{ padding: '30px' }}>
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
        <Divider />
        <br />
        <div className='flex justify-end'>
          <Button type='primary' onClick={onSubmit} loading={loading}>
            Tiến hành liên kết với payOS
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PayOSConfig;
