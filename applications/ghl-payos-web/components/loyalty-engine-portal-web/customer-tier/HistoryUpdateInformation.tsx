import { Card, Divider, Timeline, Typography } from 'antd';
import LoadingPage from 'components/common/LoadingPage';
import { ENUM_LOYALTY_REQUEST_TIER_STATUS } from 'constants/loyalty-engine-portal-web';
import { REQUEST_CREATE_TIER_STATUS_TITLE } from 'constants/loyalty-engine-portal-web/request-create-tier';
import dayjs from 'dayjs';
import { useCustomerTierHistoryUpdate } from 'hooks/loyalty-engine-portal-web/useCustomerTiers';
import { get, isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { IHistoryTierCustomer } from 'types/customer-tier';

interface IProps {
  id: string;
}
const HistoryUpdateInformation = ({ id }: IProps) => {
  const [listHistoryTier, setListHistoryTier] = useState<IHistoryTierCustomer[]>([]);
  const { data, error, loading, mutate } = useCustomerTierHistoryUpdate(id);

  useEffect(() => {
    setListHistoryTier(data as any);
  }, [data]);

  if (isEmpty(listHistoryTier)) {
    return <LoadingPage />;
  }
  const messageEvent = (status: string) => {
    if (!Object.values(ENUM_LOYALTY_REQUEST_TIER_STATUS).includes(status as any)) {
      return 'đã nâng';
    }
    return String(REQUEST_CREATE_TIER_STATUS_TITLE[status]).toLowerCase();
  };

  return (
    <Card style={{ height: '100%' }}>
      <Typography.Title level={5}>Lịch sử cập nhập thông tin</Typography.Title>
      <Divider />
      <div>
        <Timeline
          items={listHistoryTier.map((item) => {
            return {
              children: (
                <>
                  <p>
                    <b>{item.createdBy}</b> {messageEvent(get(item, 'status', ''))} hạng {get(item, 'tierName', '')} cho
                    khách hàng
                  </p>
                  <p>{dayjs(item.createdAt).format('DD/MM/YYYY HH:mm:ss')}</p>
                </>
              ),
            };
          })}
        />
      </div>
    </Card>
  );
};
export default HistoryUpdateInformation;
