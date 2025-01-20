import { Button, notification, Tooltip, Typography } from 'antd';
import { buyPlanByLocation } from 'apis';
import { ERROR_MESSAGE_DEFAULT } from '../constants';
import dayjs from 'dayjs';
import { get } from 'lodash';
import { useState } from 'react';
import { useRouter } from 'next/router';

interface IProps {
  subscriptions: {
    startDate: Date;
    endDate: Date;
    plan: Record<string, any>;
  }[];
  payload: string;
}
const SubscriptionDetail = ({ subscriptions, payload }: IProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const buyPlan = () => {
    setLoading(true);
    router.push('/plan');
    // buyPlanByLocation(payload)
    //   .then((res) => {
    //     window.open(get(res, 'checkoutUrl', ''), '_blank');
    //   })
    //   .catch((err) => {
    //     notification.error({
    //       message: get(err, 'response.data.message', ERROR_MESSAGE_DEFAULT),
    //     });
    //     console.log(err);
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
  };

  return (
    <>
      {Array.isArray(subscriptions) &&
        subscriptions.length > 0 &&
        subscriptions.map((sub, index) => (
          <div key={index}>
            <Typography.Text type='warning'>
              Gói {get(sub.plan, 'name')} sẽ hết hạn vào {dayjs(sub.endDate).format('DD/MM/YYYY HH:mm:ss')}
            </Typography.Text>
          </div>
        ))}
      <Button type='primary' style={{ marginTop: '10px' }} onClick={buyPlan} loading={loading}>
        <Tooltip title='Bạn có thể mua nhiều gói cùng lúc để tránh gián đoạn giao dịch'>Mua thêm gói</Tooltip>
      </Button>
    </>
  );
};
export default SubscriptionDetail;
