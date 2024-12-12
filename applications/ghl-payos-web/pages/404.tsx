import { Button, Result, Row } from 'antd';
import { useRouter } from 'next/router';

export default function NotFound() {
  const router = useRouter();

  return (
    <Row justify='center' align='middle' style={{ height: '100vh' }}>
      <Result
        status='404'
        title='404'
        subTitle='Không tìm thấy trang bạn yêu cầu'
        extra={
          <Button type='primary' onClick={() => router.back()}>
            Trở về
          </Button>
        }
      />
    </Row>
  );
}
