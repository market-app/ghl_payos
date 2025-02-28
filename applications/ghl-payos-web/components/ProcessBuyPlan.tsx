import { Button, Card, Divider, Typography } from 'antd';
import { buyPlanByLocation } from 'apis';
import { get } from 'lodash';
import { useState } from 'react';

interface IProps {
  payload: string;
}
const ProcessBuyPlan = ({ payload }: IProps) => {
  const [loading, setLoading] = useState(false);
  const buyPlan = () => {
    setLoading(true);
    buyPlanByLocation(payload)
      .then((res) => {
        window.open(get(res, 'checkoutUrl', ''), '_blank');
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Typography.Text type='danger'>
        Chúng tôi không tìm thấy lịch sử mua gói của bạn, <i>nếu bạn đã mua gói rồi hoặc vấn đề về kích hoạt gói hãy liên hệ zalo: 0867600311</i> để
        được hỗ trợ, nếu chưa mua gói vui lòng mua gói để có thể sử dụng được app.
      </Typography.Text>
      <br />
      <br />
      <Typography.Text type='warning'>
        Lưu ý: Hiện tại chúng tôi đã cho dùng thử 7 ngày đối với các tài khoản mới và chưa từng mua gói, nếu bạn thuộc
        trường hợp trên và chưa nhận được gói miễn phí, hãy thẻ xoá và cài đặt lại app. Các gói bên dưới có thể mua cộng
        dồn, nếu bạn đã có gói sẵn thì gói tiếp theo sẽ được tính từ ngày gói hiện tại của bạn kết thúc.
      </Typography.Text>
      <div style={{ marginTop: '40px' }}>
        <Typography.Title level={5}>Thông tin gói:</Typography.Title>
        <Divider />
        <div>
          <Card title='Sub-acc' style={{ width: '200px', marginBottom: '30px' }}>
            <p>120,000 VND/tháng</p>
          </Card>

          <Button type='primary' onClick={buyPlan} loading={loading}>
            Tiến hành mua gói
          </Button>
        </div>
      </div>
    </>
  );
};
export default ProcessBuyPlan;
