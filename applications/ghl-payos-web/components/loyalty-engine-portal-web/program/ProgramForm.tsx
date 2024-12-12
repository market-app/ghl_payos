import { QuestionCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Collapse,
  DatePicker,
  Flex,
  Form,
  FormInstance,
  Input,
  Popconfirm,
  Radio,
  Switch,
  Typography,
} from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker';
import ProgramReward from 'components/loyalty-engine-portal-web/program/ProgramReward';
import { ENUM_LOYALTY_PROGRAM_TYPE, LOYALTY_ENGINE_PRIMARY_COLOR } from 'constants/loyalty-engine-portal-web';
import { SEGMENT_CONDITION } from 'constants/loyalty-engine-portal-web/program';
import dayjs from 'dayjs';
import { omit } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import MessageConfigReward from './MessageConfigReward';
import ProgramSegment from './ProgramSegment';

interface IProps {
  form: FormInstance<any>;
  onFinish: any;
  isEdit: boolean;
  initialValues?: any;
  id?: number;
}
const ProgramForm = ({ form, onFinish, isEdit, initialValues = {} }: IProps) => {
  const programType = Form.useWatch(['type'], form) as ENUM_LOYALTY_PROGRAM_TYPE;

  const router = useRouter();

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    if (!current) return false;

    if (isEdit) {
      const startDate = form.getFieldValue('timeline')[0] || new Date();
      // Bỏ qua việc check startDate khi edit, do hàm này khi chạy nó check cả hai
      if (dayjs(current).isSame(startDate, 'day')) return false;

      return !(dayjs(current).isAfter(startDate, 'day') && dayjs(current).isAfter(dayjs(), 'day'));
    }

    // luôn luôn chọn ngày tomorrow
    return current.isSameOrBefore(dayjs(), 'day');
  };
  const RADIO_GROUP_PROGRAM_TYPE = [
    {
      value: ENUM_LOYALTY_PROGRAM_TYPE.PERK,
      title: 'Perks',
      description: 'Loyalty Programs',
      footer: 'PERK PROGRAM',
    },
    {
      value: ENUM_LOYALTY_PROGRAM_TYPE.EARNING,
      title: 'Earning',
      description: 'Loyalty Programs',
      footer: 'Tích điểm',
    },
  ];

  useEffect(() => {
    if (isEdit || !programType) return;
    const segmentDefault = (SEGMENT_CONDITION[programType] || []).filter(
      (item) => typeof item.required === 'boolean' && !!item.required,
    );

    form.setFieldsValue({
      segment: segmentDefault.map((item) => omit({ ...item, value: undefined }, 'required')),
    });
  }, [programType]);
  return (
    <>
      <Form form={form} onFinish={onFinish} initialValues={initialValues}>
        <Flex vertical gap={20}>
          <Collapse className='program-collapse' expandIconPosition={'end'} defaultActiveKey={['1']}>
            <Collapse.Panel
              header={
                <Typography.Title level={5} style={{ color: LOYALTY_ENGINE_PRIMARY_COLOR, padding: 0, margin: 0 }}>
                  1. Chọn loại chương trình
                </Typography.Title>
              }
              key='1'
            >
              <Form.Item name={'type'} required rules={[{ required: true, message: 'Please select an option!' }]}>
                <Radio.Group className='radio-custom' disabled={isEdit}>
                  {Object.values(RADIO_GROUP_PROGRAM_TYPE).map((programType, index) => (
                    <Radio
                      key={index}
                      style={{
                        width: 'fit-content',
                        height: 'fit-content',
                        padding: 0,
                        marginRight: '40px',
                        boxShadow: ' 0px 2px 10px 0px rgba(0, 0, 0, 0.20)',
                      }}
                      value={programType.value}
                    >
                      <div style={{ border: 'none', width: '230px' }}>
                        <div
                          style={{
                            width: '100%',
                            backgroundColor: LOYALTY_ENGINE_PRIMARY_COLOR,
                            padding: '10px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignContent: 'center',
                            flexDirection: 'column',
                            alignItems: 'center',
                            color: '#ffffff',
                          }}
                        >
                          <div>{programType.title}</div>
                          <div>{programType.description}</div>
                        </div>
                        <div
                          style={{
                            padding: '10px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignContent: 'center',
                          }}
                        >
                          <div>{programType.footer}</div>
                        </div>
                      </div>
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
            </Collapse.Panel>
          </Collapse>

          <Collapse className='program-collapse' expandIconPosition={'end'} defaultActiveKey={['2']}>
            <Collapse.Panel
              header={
                <Typography.Title level={5} style={{ color: LOYALTY_ENGINE_PRIMARY_COLOR, padding: 0, margin: 0 }}>
                  2. Thông tin chương trình
                </Typography.Title>
              }
              key='2'
            >
              <Form form={form} labelCol={{ span: 4 }}>
                <Form.Item
                  label='Tên chương trình'
                  name={'name'}
                  rules={[{ required: true, message: 'Bạn chưa điền tên' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label='Trạng thái' name={'status'} required initialValue={true}>
                  <Switch />
                </Form.Item>

                <Form.Item
                  label='Thời gian'
                  name={'timeline'}
                  rules={[{ required: true, message: 'Bạn chưa chọn thời gian' }]}
                  required
                >
                  {/* Chỉ cho phép chỉnh sửa ngày kết thúc */}
                  <DatePicker.RangePicker
                    format='DD-MM-YYYY'
                    disabled={isEdit ? [true, false] : [false, false]}
                    disabledDate={disabledDate}
                  />
                </Form.Item>
                <Form.Item
                  label='Mô tả chương trình'
                  name={'description'}
                  rules={[{ required: true, message: 'Bạn chưa điền mô tả' }]}
                >
                  <Input.TextArea />
                </Form.Item>
              </Form>
            </Collapse.Panel>
          </Collapse>

          <Collapse className='program-collapse' expandIconPosition={'end'} defaultActiveKey={['3']}>
            <Collapse.Panel
              header={
                <Typography.Title level={5} style={{ color: LOYALTY_ENGINE_PRIMARY_COLOR, padding: 0, margin: 0 }}>
                  3. Điều kiện áp dụng
                </Typography.Title>
              }
              key='3'
            >
              <ProgramSegment form={form} programType={programType} isEdit={isEdit} />
            </Collapse.Panel>
          </Collapse>

          <Collapse className='program-collapse' expandIconPosition={'end'} defaultActiveKey={['4']}>
            <Collapse.Panel
              header={
                <Typography.Title level={5} style={{ color: LOYALTY_ENGINE_PRIMARY_COLOR, padding: 0, margin: 0 }}>
                  4. Tạo đặc quyền
                </Typography.Title>
              }
              key='4'
            >
              <MessageConfigReward />
              <ProgramReward form={form} isEdit={isEdit} />
            </Collapse.Panel>
          </Collapse>
        </Flex>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', width: '100%', marginTop: '20px' }}>
          <Button size='large' onClick={() => router.back()}>
            Huỷ
          </Button>
          <Popconfirm
            title='Xác nhận lưu?'
            okText='Xác nhận'
            cancelText='Hủy'
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={onFinish}
          >
            <Button type='primary' size='large' block style={{ width: '200px' }}>
              Lưu
            </Button>
          </Popconfirm>
        </div>
      </Form>
    </>
  );
};
export default ProgramForm;
