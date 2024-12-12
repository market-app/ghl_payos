import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Flex, Form, FormInstance, Row, Select, Switch, Typography } from 'antd';
import { ENUM_LOYALTY_PROGRAM_TYPE, ENUM_REWARD_TYPE } from 'constants/loyalty-engine-portal-web';
import { get } from 'lodash';
import React from 'react';
import ProgramRewardMechanism from './ProgramRewardMechanism';
import RewardBrandVoucher from './reward/RewardBrandVoucher';
import RewardGiftSet from './reward/RewardGiftSet';
import RewardUpPoint from './reward/RewardUpPoint';

interface IProgramReward {
  form: FormInstance<any>;
  isEdit?: boolean;
}
const ProgramReward = ({ form, isEdit = false }: IProgramReward) => {
  const programType = Form.useWatch(['type'], form) as ENUM_LOYALTY_PROGRAM_TYPE;
  const initialValuesLength = (form.getFieldValue('reward') || []).length;
  const disabledInitialValues = (index: number): boolean => {
    const condition = isEdit && index <= initialValuesLength - 1;
    return condition;
  };

  const validateUniqueVoucher = (_rule: any, value: any, callback: any) => {
    const currentValues = form.getFieldValue(['reward']) || [];
    // check theo label vì còn có trường hợp khác type trùng id
    const duplicates = currentValues.filter(
      (item: any) => get(item, 'rewardName.label') === value?.label && get(item, 'type') !== ENUM_REWARD_TYPE.UP_POINT,
    );

    if (duplicates.length > 1) {
      callback('Voucher bị trùng với voucher đã chọn trước đó.');
    } else {
      callback();
    }
  };
  const LABEL_REWARD_TYPE = {
    [ENUM_REWARD_TYPE.BRAND_VOUCHER]: 'Voucher thương hiệu',
    [ENUM_REWARD_TYPE.GIFT_SET]: ' Thẻ lượt',
    [ENUM_REWARD_TYPE.UP_POINT]: 'Điểm UP',
  };

  const REWARD_OPTION_FOR_PROGRAM_TYPE = {
    [ENUM_LOYALTY_PROGRAM_TYPE.PERK]: [
      ENUM_REWARD_TYPE.BRAND_VOUCHER,
      ENUM_REWARD_TYPE.GIFT_SET,
      ENUM_REWARD_TYPE.UP_POINT,
    ],
    [ENUM_LOYALTY_PROGRAM_TYPE.EARNING]: [
      ENUM_REWARD_TYPE.BRAND_VOUCHER,
      ENUM_REWARD_TYPE.GIFT_SET,
      ENUM_REWARD_TYPE.UP_POINT,
    ],
  };

  const LAYOUT_REWARD_TYPE = (
    rewardType: ENUM_REWARD_TYPE,
    restField: any,
    key: number,
    name: number,
  ): React.JSX.Element => {
    const layout = {
      [ENUM_REWARD_TYPE.BRAND_VOUCHER]: (
        <RewardBrandVoucher
          form={form}
          disabledInitialValues={disabledInitialValues(key)}
          validateUniqueVoucher={validateUniqueVoucher}
          restField={restField}
          key={key}
          name={name}
        />
      ),
      [ENUM_REWARD_TYPE.GIFT_SET]: (
        <RewardGiftSet
          form={form}
          disabledInitialValues={disabledInitialValues(key)}
          validateUniqueVoucher={validateUniqueVoucher}
          restField={restField}
          key={key}
          name={name}
        />
      ),
      [ENUM_REWARD_TYPE.UP_POINT]: (
        <RewardUpPoint
          form={form}
          disabledInitialValues={disabledInitialValues(key)}
          validateUniqueVoucher={validateUniqueVoucher}
          restField={restField}
          key={key}
          name={name}
        />
      ),
    };
    return layout[rewardType];
  };

  return (
    <div>
      <Form form={form} initialValues={{ reward: [] }} labelCol={{ span: 8 }}>
        <Form.Item>
          <Form.List name={['reward']}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <div key={key} style={{ width: '100%' }}>
                    <Flex align={'center'} justify={'space-between'} style={{ marginBottom: '20px' }} gap={20}>
                      <Typography>Đặc quyền {index + 1}</Typography>

                      <Button type='primary' danger onClick={() => remove(name)} disabled={disabledInitialValues(key)}>
                        <DeleteOutlined />
                      </Button>
                    </Flex>

                    <Row>
                      <Col span={14}>
                        <Form.Item
                          name={[name, 'type']}
                          label='Chọn quà áp dụng'
                          rules={[
                            {
                              required: true,
                              message: 'Loại quà không được để trống',
                            },
                          ]}
                        >
                          <Select
                            disabled={disabledInitialValues(key)}
                            onChange={(value) => {
                              form.setFieldsValue({
                                reward: {
                                  [name]: { type: value, rewardName: undefined },
                                },
                              });
                            }}
                            options={
                              programType &&
                              REWARD_OPTION_FOR_PROGRAM_TYPE[programType].map((item) => ({
                                label: LABEL_REWARD_TYPE[item],
                                value: item,
                              }))
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={10} style={{ paddingLeft: '10px' }}>
                        <Form.Item label='Trạng thái' name={[name, 'status']} initialValue={true}>
                          <Switch />
                        </Form.Item>
                      </Col>
                    </Row>
                    <div
                      style={{
                        display: form.getFieldValue(['reward', name, 'type']) ? '' : 'none',
                        width: '100%',
                      }}
                    >
                      {/* 
                      component reward option
                       */}
                      {LAYOUT_REWARD_TYPE(form.getFieldValue(['reward', name, 'type']), restField, key, name)}

                      <ProgramRewardMechanism
                        form={form}
                        isEdit={isEdit}
                        name={name}
                        key={key}
                        disabled={disabledInitialValues(key)}
                      />
                    </div>

                    <Divider />
                  </div>
                ))}

                <div style={{ float: 'right' }}>
                  <Button type='primary' onClick={() => add()}>
                    Thêm đặc quyền
                  </Button>
                </div>
              </>
            )}
          </Form.List>
        </Form.Item>
      </Form>
    </div>
  );
};
export default ProgramReward;
