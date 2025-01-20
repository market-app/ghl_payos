import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Flex, Typography } from 'antd';
import { getPlans } from 'apis';
import LoadingPage from 'components/LoadingPage';
import PlanItem from 'components/PlanItem';
import { usePayload } from 'hooks/usePayload';
import { get } from 'lodash';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const Plan = () => {
  const payload = usePayload();
  const router = useRouter();
  const {
    data: plans,
    error,
    mutate,
  } = useSWR(`get-plans`, () => getPlans(payload), {
    revalidateOnFocus: true,
  });
  // console.log(data);

  if (!payload || error) {
    return <LoadingPage />;
  }
  return (
    <div style={{ padding: '20px' }}>
      <Flex align={'center'} gap={10}>
        <Button icon={<ArrowLeftOutlined />} size={'small'} onClick={() => router.back()} />
        <Typography.Text style={{ fontSize: '15px' }}>Quay lại</Typography.Text>
      </Flex>
      <div style={{ marginTop: '20px' }}>
        <Typography.Title level={4}>Danh sách gói:</Typography.Title>
        <br />
        {Array.isArray(plans) &&
          plans.length > 0 &&
          plans.map((plan, index) => (
            <PlanItem
              id={get(plan, 'id')}
              amount={plan.amount}
              title={get(plan, 'name')}
              durationType={get(plan, 'durationType')}
              key={index}
            />
          ))}
      </div>
    </div>
  );
};
export default Plan;
