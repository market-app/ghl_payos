import { UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, notification } from 'antd';
import { logIn } from 'auth/loyalty-engine-portal-web/loyaltyEngineAuth';
import { REDIRECT_ROUTER } from 'constants';
import get from 'lodash/get';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Login: NextPage = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  const onFinish = async (values: any) => {
    setLoading(true);
    await logIn(values.username, values.password)
      .then(() => {
        router.replace(REDIRECT_ROUTER);
      })
      .catch((err) => {
        if (get(err, 'response.data.statusCode') == '400') {
          notification.error({
            message: 'Thông báo',
            description: (
              <>
                <p>{get(err, 'response.data.message')}</p>
              </>
            ),
            placement: 'topRight',
          });
        } else {
          form.setFields([
            {
              name: 'password',
              errors: ['Tài khoản hoặc mật khẩu không chính xác.'],
            },
          ]);
        }
      });
    setLoading(false);
  };

  return (
    <>
      <h2 style={{ fontWeight: 'bold', marginTop: '20px' }}>Đăng nhập</h2>
      <Form form={form} name='login' className='login-form' initialValues={{ remember: true }} onFinish={onFinish}>
        <Form.Item
          name='username'
          rules={[
            {
              required: true,
              message: 'Bạn phải nhập Tên đăng nhập!',
            },
          ]}
        >
          <Input suffix={<UserOutlined className='site-form-item-icon' />} placeholder='Tên đăng nhập' />
        </Form.Item>
        <Form.Item
          name='password'
          rules={[
            {
              required: true,
              message: 'Sai mật khẩu, kiểm tra lại!',
            },
          ]}
        >
          <Input.Password type='password' placeholder='Mật khẩu' />
        </Form.Item>
        <Form.Item>
          <Form.Item name='remember' valuePropName='checked' noStyle>
            <Checkbox className='purple-checkbox'>Lưu mật khẩu</Checkbox>
          </Form.Item>
        </Form.Item>

        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            className='purple-button'
            style={{ width: '100%' }}
            size='large'
            loading={loading}
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default Login;
