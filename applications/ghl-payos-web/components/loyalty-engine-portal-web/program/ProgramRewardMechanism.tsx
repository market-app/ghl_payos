import { Col, Form, FormInstance, Radio, Row, Select, Tooltip } from 'antd';
import {
  ENUM_PROGRAM_REWARD_MECHANISM_DURATION_TYPE,
  ENUM_PROGRAM_REWARD_MECHANISM_TIME_TO_TOPUP,
  ENUM_PROGRAM_REWARD_MECHANISM_TYPE,
} from 'constants/loyalty-engine-portal-web';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DateSelect from './DateSelect';
import DayPicker from './DayPicker';
import { InfoCircleFilled } from '@ant-design/icons';

interface IProps {
  form: FormInstance<any>;
  isEdit: boolean;
  name: number;
  disabled: boolean;
}
const ProgramRewardMechanism = ({ form, isEdit = false, name, ...props }: IProps) => {
  const { t } = useTranslation();
  const TIME_TO_TOPUP: any = {
    [ENUM_PROGRAM_REWARD_MECHANISM_TIME_TO_TOPUP.AFTER_REQUEST_TIER]: 'Ngay khi được nâng hạng',
    [ENUM_PROGRAM_REWARD_MECHANISM_TIME_TO_TOPUP.FIXED_ON_SELECTED_DATE]: 'Cố định dựa trên ngày được chọn',
  };

  const mechanismType = Form.useWatch(['reward', name, 'mechanism', 'type']);
  const durationType = Form.useWatch(['reward', name, 'mechanism', 'durationType']);

  useEffect(() => {
    if (isEdit) return;
    form.setFieldsValue({
      reward: {
        [name]: { mechanism: { day: undefined } },
      },
    });
  }, [durationType]);
  return (
    <>
      <Form.Item
        label='Cơ chế cấp'
        name={[name, 'mechanism', 'type']}
        rules={[{ required: true, message: 'Trường bắt buộc' }]}
      >
        <Radio.Group disabled={isEdit && props.disabled}>
          <Radio value={ENUM_PROGRAM_REWARD_MECHANISM_TYPE.ONCE}>Cấp 1 lần trong toàn bộ chương trình</Radio>
          <Radio value={ENUM_PROGRAM_REWARD_MECHANISM_TYPE.PERIODIC}>Cấp theo định kì</Radio>
        </Radio.Group>
      </Form.Item>

      {mechanismType === ENUM_PROGRAM_REWARD_MECHANISM_TYPE.PERIODIC && (
        <Row gutter={[0, 16]} style={{ paddingLeft: 16 }}>
          <Col span={24}>
            <Form.Item
              label='Thời gian'
              name={[name, 'mechanism', 'durationType']}
              rules={[{ required: true, message: 'Trường bắt buộc' }]}
            >
              <Radio.Group disabled={isEdit && props.disabled}>
                <Radio value={ENUM_PROGRAM_REWARD_MECHANISM_DURATION_TYPE.DAILY}>Hàng ngày</Radio>
                <Radio value={ENUM_PROGRAM_REWARD_MECHANISM_DURATION_TYPE.WEEKLY}>Hàng tuần</Radio>
                <Radio value={ENUM_PROGRAM_REWARD_MECHANISM_DURATION_TYPE.MONTHLY}>Hàng tháng</Radio>
              </Radio.Group>
            </Form.Item>

            {durationType === ENUM_PROGRAM_REWARD_MECHANISM_DURATION_TYPE.WEEKLY && (
              <DayPicker
                disabled={isEdit && props.disabled}
                name={[name, 'mechanism', 'day']}
                rules={[{ required: true, message: t('RequiredField') }]}
              />
            )}
            {durationType === ENUM_PROGRAM_REWARD_MECHANISM_DURATION_TYPE.MONTHLY && (
              <DateSelect
                disabled={isEdit && props.disabled}
                name={[name, 'mechanism', 'day']}
                rules={[{ required: true, message: t('RequiredField') }]}
              />
            )}
          </Col>
          <Col span={24}>
            <Form.Item
              label={
                <>
                  Thời điểm phát đặc quyền
                  <Tooltip
                    overlayStyle={{ minWidth: '400px' }}
                    title={
                      <>
                        <p>Thời điểm thực hiện phát đặc quyền cho user. Gồm 2 lựa chọn:</p>
                        <p>1. Ngay sau khi được nâng hạng: Đặc quyền được cấp ngay khi người dùng được nâng hạng</p>
                        <p>2. Cố định dựa trên ngày được chọn: Đặc quyền được cấp vào ngày cố định được chọn</p>
                      </>
                    }
                  >
                    <InfoCircleFilled style={{ marginLeft: '5px' }} />
                  </Tooltip>
                </>
              }
              name={[name, 'mechanism', 'timeToTopUp']}
              rules={[{ required: true, message: 'Trường bắt buộc' }]}
            >
              <Select
                disabled={isEdit && props.disabled}
                options={Object.keys(TIME_TO_TOPUP).map((item) => ({
                  label: TIME_TO_TOPUP[item],
                  value: item,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>
      )}
    </>
  );
};
export default ProgramRewardMechanism;
