import { Typography } from 'antd';
import dayjs from 'dayjs';
import { get } from 'lodash';

interface IProps {
  subscriptions: {
    startDate: Date;
    endDate: Date;
    plan: Record<string, any>;
  }[];
}
const SubscriptionDetail = ({ subscriptions }: IProps) => {
  return (
    <>
      {Array.isArray(subscriptions) &&
        subscriptions.length > 0 &&
        subscriptions.map((sub, index) => (
          <div key={index}>
            <Typography>Gói {get(sub.plan, 'name')} sẽ hết hạn vào {dayjs(sub.endDate).format('DD/MM/YYYY HH:mm:ss')}</Typography>
          </div>
        ))}
    </>
  );
};
export default SubscriptionDetail;
