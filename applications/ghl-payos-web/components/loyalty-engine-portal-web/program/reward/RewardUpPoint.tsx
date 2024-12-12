import { Col, Form, FormInstance, InputNumber, notification, Row } from 'antd';
import { DebounceSelect } from 'components/common/DebounceSelect';
import { numberWithCommas, numberWithoutCommas } from 'functions/urstaff-portal-web/helpers';
import { useSearchSubPoForBirthday } from 'hooks/loyalty-engine-portal-web/usePrograms';
import { get, isNil } from 'lodash';
import { useEffect } from 'react';

interface IProps {
  form: FormInstance<any>;
  restField: {
    fieldKey?: number | undefined;
  };
  name: number;
  disabledInitialValues: boolean;
  validateUniqueVoucher: (_rule: any, value: any, callback: any) => void;
}
const RewardUpPoint = ({ form, restField, name, ...props }: IProps) => {
  /**
   * không đưa subPOs vào DebounceSelect do nó không trigger nếu setField bên trong
   */
  const { data: subPOs, error } = useSearchSubPoForBirthday();

  const rewardName = Form.useWatch(['reward', name, 'rewardName'], form);
  useEffect(() => {
    //khá dễ có error phần subPO nên cần show message err
    if (error) {
      notification.error({
        message: get(error, 'response.data.message'),
      });
      return;
    }
    // trigger change subPo -> update amount
    const subPoId = get(rewardName, 'value');

    if (!subPoId || !Array.isArray(subPOs)) return;
    const infoSubPO = subPOs.find((item: any) => item.subPOId == subPoId);

    if (!infoSubPO) return;

    form.setFieldValue(['reward', name, 'amount'], get(infoSubPO, 'amount', 0));
    form.setFieldValue(['reward', name, 'availableAmount'], get(infoSubPO, 'availableAmount', 0));
  }, [subPOs, rewardName, error]);
  return (
    <div
      style={{
        display: form.getFieldValue(['reward', name, 'type']) ? '' : 'none',
        width: '100%',
      }}
    >
      <Form.Item
        label='Giá trị cấp phát cho mỗi khách hàng'
        name={[name, 'quantity']}
        rules={[
          {
            required: true,
            message: 'Giá trị không được để trống',
          },
          {
            min: 10,
            transform: (value) => +value,
            message: 'Tối thiểu là 10 UP',
          },
          {
            validator: (rule, value, callback) => {
              // chỉ validate khi nó create hoặc thêm mới khi edit
              if (props.disabledInitialValues) {
                callback();
                return;
              }
              // check số tiền nhập vào phải < số tiền còn lại
              const availableAmount = form.getFieldValue(['reward', name, 'availableAmount']);
              if (!isNil(availableAmount) && Number(value) >= Number(availableAmount)) {
                callback('Giá trị cấp phát phải nhỏ hơn số tiền còn lại của subPO');
                return;
              }
              callback();
            },
          },
        ]}
      >
        <InputNumber
          disabled={props.disabledInitialValues}
          placeholder='Nhập giá trị cấp phát cho mỗi khách hàng'
          style={{ width: '100%' }}
          formatter={(value) => numberWithCommas(value)}
          parser={(value: any) => numberWithoutCommas(value)}
        />
      </Form.Item>

      {/* Chọn nguồn tiền */}
      <Form.Item
        {...restField}
        name={[name, 'rewardName']}
        label='Chọn nguồn tiền'
        rules={[
          {
            required: true,
            message: 'Nguồn tiền không được để trống',
          },
          {
            validator: (rule, value, callback) => props.validateUniqueVoucher(rule, value, callback),
          },
        ]}
      >
        <DebounceSelect
          disabled={props.disabledInitialValues}
          showSearch
          placeholder='Chọn nguồn tiền'
          fetchOptions={async (...options) => {
            return Array.isArray(subPOs)
              ? subPOs.map((item) => {
                  const subPOId = get(item, 'subPOId');
                  return {
                    label: `${subPOId} - ${get(item, 'subPoCode')}`,
                    value: subPOId,
                    data: item,
                  };
                })
              : (null as any);
          }}
          allowClear
        />
      </Form.Item>

      {/* thông tin tiền trong subPO */}
      <Row style={{ paddingLeft: '30px' }}>
        <Col span={8}>
          <Form.Item {...restField} name={[name, 'amount']} label='Số tiền ban đầu'>
            <InputNumber
              readOnly
              style={{ width: '100%', border: 'none' }}
              formatter={(value) => numberWithCommas(value)}
              parser={(value: any) => numberWithoutCommas(value)}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ paddingLeft: '10px' }}>
          <Form.Item {...restField} name={[name, 'availableAmount']} label='Số tiền còn lại'>
            <InputNumber
              readOnly
              style={{ width: '100%', border: 'none' }}
              formatter={(value) => numberWithCommas(value)}
              parser={(value: any) => numberWithoutCommas(value)}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};
export default RewardUpPoint;
