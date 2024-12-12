import { Col, Form, FormInstance, InputNumber, Row } from 'antd';
import { searchGifts } from 'apis/loyalty-engine-portal-web/programs';
import { DebounceSelect } from 'components/common/DebounceSelect';
import { numberWithCommas, numberWithoutCommas } from 'functions/urstaff-portal-web/helpers';

interface IProps {
  form: FormInstance<any>;
  restField: {
    fieldKey?: number | undefined;
  };
  name: number;
  disabledInitialValues: boolean;
  validateUniqueVoucher: (_rule: any, value: any, callback: any) => void;
}
const RewardBrandVoucher = ({ form, restField, name, ...props }: IProps) => {
  return (
    <>
      <Row>
        <Col span={14}>
          <Form.Item
            {...restField}
            name={[name, 'rewardName']}
            label='Tên quà'
            rules={[
              {
                required: true,
                message: 'Tên quà không được để trống',
              },
              {
                validator: (rule, value, callback) => props.validateUniqueVoucher(rule, value, callback),
              },
            ]}
          >
            <DebounceSelect
              disabled={props.disabledInitialValues}
              showSearch
              placeholder='Chọn voucher'
              fetchOptions={(...options) => {
                return searchGifts(...options);
              }}
              allowClear
            />
          </Form.Item>
        </Col>
        <Col span={10} style={{ paddingLeft: '10px' }}>
          <Form.Item
            label='Số lượt áp dụng'
            name={[name, 'quantity']}
            rules={[
              {
                required: true,
                message: 'Số lượt không được để trống',
              },
              {
                min: 1,
                transform: (value) => +value,
                message: 'Số lượng tối thiểu là 1',
              },
            ]}
          >
            <InputNumber
              placeholder='Nhấp chọn số lượt'
              style={{ width: '100%' }}
              formatter={(value) => numberWithCommas(value)}
              parser={(value: any) => numberWithoutCommas(value)}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};
export default RewardBrandVoucher;
