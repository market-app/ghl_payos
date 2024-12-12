import { Breadcrumb, Card, Divider, Form, notification, Typography } from 'antd';
import { createTier } from 'apis/loyalty-engine-portal-web/tiers';
import TierForm from 'components/loyalty-engine-portal-web/tier/TierForm';
import { ENUM_LOYALTY_TIER_STATUS } from 'constants/loyalty-engine-portal-web';
import { routers } from 'layouts/loyalty-engine-portal-web/main';
import { get } from 'lodash';
import { useRouter } from 'next/router';
import { ITier } from 'types/loyalty-engine-portal-web/tier';

const CreateTier = () => {
  const router = useRouter();
  const [form] = Form.useForm<ITier>();

  const onFinish = async (values: any) => {
    await createTier({
      ...values,
      status: values.status ? ENUM_LOYALTY_TIER_STATUS.ACTIVATED : ENUM_LOYALTY_TIER_STATUS.DEACTIVATED,
    })
      .then(() => {
        notification.success({
          message: 'Tạo phân hạng thành công',
        });
        router.back();
      })
      .catch((err: any) => {
        notification.error({
          message: `${get(err, 'response.data.message', err)}`,
        });
      });
  };
  return (
    <>
      <Typography.Title level={3}>Tạo phân hạng</Typography.Title>
      <Breadcrumb
        items={[
          {
            title: <a href={routers[1].link}>Quản lí phân hạng</a>,
          },
          {
            title: 'Tạo  phân hạng',
          },
        ]}
      />
      <Divider />
      <Card title=' Tạo phân hạng' style={{ marginTop: '10px' }}>
        <TierForm form={form} onFinish={onFinish} isEdit={false} />
      </Card>
    </>
  );
};
export default CreateTier;
