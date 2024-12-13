import { Button, Divider, Form, Input, Typography } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';

interface PayOSGatewayKey {
  clientId: string;
  apiKey: string;
  checksumKey: string;
}

const PayOSConfig = () => {
  const [testMode, setTestMode] = useState<PayOSGatewayKey>({
    clientId: '',
    apiKey: '',
    checksumKey: '',
  });
  const [liveMode, setLiveMode] = useState<PayOSGatewayKey>({
    clientId: '',
    apiKey: '',
    checksumKey: '',
  });
  const [userInfo, setUserInfo] = useState({
    companyId: '',
    locationId: '',
  });

  const disabled = useMemo(() => {
    return Object.values({ ...testMode, ...liveMode, ...userInfo }).some((value) => !value.length);
  }, [testMode, liveMode]);

  const onSubmit = async () => {
    try {
      await fetch(`/api/provider-config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userInfo,
          testMode,
          liveMode,
        }),
      }).then(async (response) => {
        const jsonData = await response.json();
        if (response.ok) return jsonData;

        return Promise.reject(jsonData);
      });
      window.alert('Lưu thành công');
    } catch (error) {
      window.alert(`Lưu thất bại vui lòng liên hệ quản trị viên để được hỗ trợ`);
      console.error(error);
    }
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
      setTestMode(data.test);
      setLiveMode(data.live);
    } catch (error) {
      console.error(error);
    }
  };
  const decryptInfoAppKey = async (payload: string) => {
    const response = await fetch(`/api/auth/sso`, {
      method: 'get',
      headers: {
        'x-sso-session': payload,
      },
    });
    const data = await response.json();
    setUserInfo({
      locationId: data.activeLocation,
      companyId: data.companyId,
    });
    await getInfoAppKey(data.activeLocation, data.companyId);
  };
  const handleMessage = async ({ data }: MessageEvent) => {
    if (data.message === 'REQUEST_USER_DATA_RESPONSE') {
      window.removeEventListener('message', handleMessage);

      console.log(data);
      const payload = data.payload;
      if (!payload) return;

      await decryptInfoAppKey(payload);
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
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} style={{ padding: '30px' }}>
        <div>
          <Typography.Title level={4}>Môi trường test:</Typography.Title>
          <Form.Item name={['test', 'clientId']} label='Client Id'>
            <Input.Password />
          </Form.Item>
          <Form.Item name={['test', 'apiKey']} label='Api Key'>
            <Input.Password />
          </Form.Item>
          <Form.Item name={['test', 'checksumKey']} label='Checksum Key'>
            <Input.Password />
          </Form.Item>
        </div>
        <Divider />
        <div>
          <Typography.Title level={4}>Môi trường live:</Typography.Title>
          <Form.Item name={['live', 'clientId']} label='Client Id'>
            <Input.Password />
          </Form.Item>
          <Form.Item name={['live', 'apiKey']} label='Api Key'>
            <Input.Password />
          </Form.Item>
          <Form.Item name={['live', 'checksumKey']} label='Checksum Key'>
            <Input.Password />
          </Form.Item>
        </div>
        <br />
        <div className='flex justify-end'>
          <Button disabled={disabled} onClick={onSubmit}>
            Tiến hành liên kết với payOS
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PayOSConfig;
