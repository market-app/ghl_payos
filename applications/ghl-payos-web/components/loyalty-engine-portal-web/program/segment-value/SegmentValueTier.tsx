import { Form, Select } from 'antd';
import { ENUM_LOYALTY_TIER_STATUS } from 'constants/loyalty-engine-portal-web';
import { useGetTiers } from 'hooks/loyalty-engine-portal-web/useTiers';
import { get } from 'lodash';

interface IProps {
  name: any;
  isEdit: boolean;
}
const SegmentValueTier = ({ name, isEdit }: IProps) => {
  const { data: tiers, loading } = useGetTiers();
  return (
    <>
      <Form.Item
        label='Value'
        name={[name, 'value']}
        labelCol={{ span: 24 }}
        required
        rules={[{ required: true, message: 'Bạn chưa chọn phân hạng' }]}
      >
        <Select
          disabled={isEdit}
          options={
            tiers &&
            tiers
              .filter((tier) => get(tier, 'status') === ENUM_LOYALTY_TIER_STATUS.ACTIVATED)
              .map((tier: any) => ({ value: tier.alias, label: tier.alias }))
          }
        />
      </Form.Item>
    </>
  );
};
export default SegmentValueTier;
