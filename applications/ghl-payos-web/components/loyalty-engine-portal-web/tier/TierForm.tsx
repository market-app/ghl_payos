import { Button, Form, FormInstance, Input, Select, Switch } from 'antd';
import { ENUM_LOYALTY_TIER_RECALCULATION_CONFIG } from 'constants/loyalty-engine-portal-web';
import { useRouter } from 'next/router';

interface IProps {
  form: FormInstance<any>;
  onFinish: any;
  isEdit: boolean;
  initialValues?: any;
  id?: number;
}
const TierForm = ({ form, onFinish, isEdit = false, initialValues = {} }: IProps) => {
  const router = useRouter();

  return (
    <>
      <Form form={form} onFinish={onFinish} labelCol={{ span: 6 }} initialValues={initialValues}>
        <Form.Item label='Tên phân hạng' name={'name'} rules={[{ required: true, message: 'Bạn chưa điền tên' }]}>
          <Input disabled={isEdit} />
        </Form.Item>
        <Form.Item
          label='Mô tả'
          name={'description'}
          rules={[
            { required: true, message: 'Bạn chưa điền mô tả' },
            { type: 'string', min: 10 },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item label='Trạng thái' name={'status'} initialValue={true} required>
          <Switch />
        </Form.Item>
        <Form.Item
          label='Tính toán trạng thái hết hạn'
          name={'recalculationConfig'}
          rules={[{ required: true, message: 'Bạn chưa chọn trạng thái hết hạn' }]}
        >
          <Select
            disabled={isEdit}
            style={{ width: '30%' }}
            options={Object.values(ENUM_LOYALTY_TIER_RECALCULATION_CONFIG).map((item) => ({
              value: item,
              label: item,
            }))}
          />
        </Form.Item>
        {/* button */}
        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button type='text' onClick={() => router.back()}>
              Huỷ
            </Button>
            <Button type='primary' htmlType='submit'>
              Lưu
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
};
export default TierForm;
