import { Button, Card, Divider, Flex, notification, Typography } from 'antd';
import { buyPlanByLocation, getPlans } from 'apis';
import { DURATION_TYPE_TITLE } from '../constants';
import { get } from 'lodash';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const ProcessBuyPlan = () => {
  const router = useRouter();
  const query = router.query;

  const [payload, setPayload]= useState('')
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [planSelected, setPlanSelected] = useState(0);

  const buyPlan = () => {
    setLoading(true);
    buyPlanByLocation(payload, planSelected)
      .then((res) => {
        window.open(get(res, 'checkoutUrl', ''), '_blank');
      })
      .catch((err) => {
        notification.warning({
          message: get(err, 'response.data.message'),
        });
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const payloadData = get(query, 'payload') as string;
    const decodePayload = decodeURIComponent(payloadData)
    if(!payloadData) return;
    setPayload(decodePayload)

    const fetchData = async () => {
      getPlans(decodePayload)
        .then((res) => {
          if (!Array.isArray(res) || !res.length) return;
          setPlans(res.filter((plan) => get(plan, 'amount', 0) > 0) as any);
        })
        .catch((err) => {
          console.log(err);
          notification.error({
            message: get(err, 'response.data.message', err),
          });
        });
    };
    fetchData();
  }, []);

  return (
    <>
      <Typography.Text type='danger'>
        Chúng tôi không tìm thấy lịch sử mua gói của bạn,{' '}
        <i>nếu bạn đã mua gói rồi hoặc vấn đề về kích hoạt gói hãy liên hệ zalo: 0867600311</i> để được hỗ trợ, nếu chưa
        mua gói vui lòng mua gói để có thể sử dụng được app.
      </Typography.Text>
      <br />
      <br />
      <Typography.Text type='warning'>
        Lưu ý: Hiện tại chúng tôi đã cho dùng thử 7 ngày đối với các tài khoản mới và chưa từng mua gói, nếu bạn thuộc
        trường hợp trên và chưa nhận được gói miễn phí, hãy thử xoá và cài đặt lại app. Các gói bên dưới có thể mua cộng
        dồn, nếu bạn đã có gói sẵn thì gói tiếp theo sẽ được tính từ ngày gói gần nhất của bạn kết thúc.
      </Typography.Text>
      <div style={{ marginTop: '40px' }}>
        <Typography.Title level={5}>Thông tin gói:</Typography.Title>
        <Divider />
        <Flex gap={20}>
          {Array.isArray(plans) &&
            plans.map((plan, key) => (
              <Card
                key={key}
                title={get(plan, 'name')}
                style={{
                  cursor: 'pointer',
                  width: '200px',
                  marginBottom: '30px',
                  border: planSelected === get(plan, 'id') ? '1px solid #6655ff' : '',
                }}
                onClick={() => setPlanSelected(get(plan, 'id'))}
              >
                <p>
                  {get(plan, 'amount')} VND/{get(plan, 'duration')} {DURATION_TYPE_TITLE[get(plan, 'durationType')]}
                </p>
              </Card>
            ))}
        </Flex>
        <div>
          <Button type='primary' onClick={buyPlan} loading={loading}>
            Tiến hành mua gói
          </Button>
        </div>
      </div>
    </>
  );
};
export default ProcessBuyPlan;
