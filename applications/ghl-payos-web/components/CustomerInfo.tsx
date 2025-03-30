import { Button, Form, Input, notification, Typography } from 'antd';
import { getInfoApp, updateInfoApp } from 'apis';
import { get } from 'lodash';
import { useEffect, useState } from 'react';

interface IProps {
  payload: string;
}
const CustomerInfo = (props: IProps) => {
  const [form] = Form.useForm<{ email: string }>();
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const onSubmit = async () => {
    setLoadingSubmit(true);
    form.validateFields().then((values) => {
      console.log(values);
      const { email } = values;
      updateInfoApp(props.payload, email)
        .then((res) => {
          notification.success({ message: 'Cập nhập thông tin app thành công' });
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
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      getInfoApp(props.payload)
        .then((res) => {
          form.setFieldsValue({
            email: get(res, 'email', ''),
          });
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchData();
  }, []);

  return (
    <div style={{ marginTop: '30px' }}>
      <Typography.Title level={4}>Thông tin khách hàng</Typography.Title>
      <div style={{ fontStyle: 'italic', fontSize: '13px' }}>
        <p>Ghi chú: Email này sẽ dùng để thông báo đến bạn các thông tin sau:</p>
        <ul>
          <li>Email hết hạn gói (đính kèm link thanh toán, mặc định sẽ là gia hạn với gói gần nhất của bạn)</li>
          <li>Email về các thay đổi, tính năng mới của app</li>
        </ul>
      </div>

      <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
        <Form.Item name={'email'} label='Email' rules={[{ required: true, message: 'Bạn chưa điền mail' }]}>
          <Input />
        </Form.Item>

        <div className='flex justify-end'>
          <Button type='primary' onClick={onSubmit} loading={loadingSubmit}>
            Cập nhập Email
          </Button>
        </div>
      </Form>
    </div>
  );
};
export default CustomerInfo;
