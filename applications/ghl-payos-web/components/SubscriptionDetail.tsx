import { Button, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import { get } from 'lodash';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface IProps {
  subscriptions: {
    startDate: Date;
    endDate: Date;
    plan: Record<string, any>;
  }[];
  payload: string;
}
const SubscriptionDetail = ({ subscriptions, payload }: IProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const buyPlan = () => {
    setLoading(true);
    router.push(`/buy-plan?payload=${encodeURIComponent(payload)}`);
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
