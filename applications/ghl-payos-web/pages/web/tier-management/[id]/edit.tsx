import { Breadcrumb, Card, Divider, Form, notification, Typography } from 'antd';
import { patch } from 'apis/loyalty-engine-portal-web/tiers';
import LoadingPage from 'components/common/LoadingPage';
import TierForm from 'components/loyalty-engine-portal-web/tier/TierForm';
import { ENUM_LOYALTY_TIER_STATUS } from 'constants/loyalty-engine-portal-web';
import { useTierDetail } from 'hooks/loyalty-engine-portal-web/useTiers';
import { routers } from 'layouts/loyalty-engine-portal-web/main';
import { get } from 'lodash';
import { useRouter } from 'next/router';
import nProgress from 'nprogress';
import { useEffect } from 'react';
import { ITier } from 'types/loyalty-engine-portal-web/tier';

const TierEdit = () => {
  const router = useRouter();
  const { id } = router.query;
  const [form] = Form.useForm<ITier>();
  const { data, error, loading, mutate } = useTierDetail(id);

  const onFinish = () => {
    form.validateFields().then((values) => {
      const { description, status } = values;
      patch(id, {
        description,
        status: status ? ENUM_LOYALTY_TIER_STATUS.ACTIVATED : ENUM_LOYALTY_TIER_STATUS.DEACTIVATED,
      })
        .then(() => {
          notification.success({
            message: 'Cập nhập chương trình thành công',
          });
          router.back();
        })
        .catch((err: any) => {
          notification.error({
            message: get(err, 'message', ''),
          });
        });
    });
  };

  useEffect(() => {
    if (loading) nProgress.start();
    else nProgress.done();
    if (error) {
      notification.error({
        message: 'Không thể tải thông tin chương trình',
        description: error.message,
        placement: 'topRight',
      });
    }
  }, [loading, error]);

  if (loading || typeof window === 'undefined') {
    return <LoadingPage />;
  }

  return (
    <>
      <Typography.Title level={3}>Chỉnh sửa phân hạng</Typography.Title>
      <Breadcrumb
        items={[
          {
            title: <a href={routers[1].link}>Quản lí phân hạng</a>,
          },
          {
            title: 'Chỉnh sửa  phân hạng',
          },
        ]}
      />
      <Divider />
      <Card title='Chỉnh sửa phân hạng' style={{ marginTop: '10px' }}>
        <TierForm form={form} onFinish={onFinish} isEdit={true} initialValues={data} />
      </Card>
    </>
  );
};
export default TierEdit;
