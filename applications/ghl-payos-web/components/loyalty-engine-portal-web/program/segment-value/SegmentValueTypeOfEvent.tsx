import { Form, Select } from 'antd';
import { ENUM_PROGRAM_SEGMENT_TYPE_OF_EVENT_VALUE } from 'constants/loyalty-engine-portal-web/program';

interface IProps {
  name: any;
  isEdit: boolean;
}
const SegmentValueTypeOfEvent = ({ name, isEdit }: IProps) => {
  return (
    <>
      <Form.Item
        label='Value'
        name={[name, 'value']}
        labelCol={{ span: 24 }}
        initialValue={ENUM_PROGRAM_SEGMENT_TYPE_OF_EVENT_VALUE.NON_TRANSACTION}
        required
        rules={[{ required: true, message: 'Không được để trống' }]}
      >
        <Select
          disabled={isEdit}
          options={Object.values(ENUM_PROGRAM_SEGMENT_TYPE_OF_EVENT_VALUE).map((item) => ({
            value: item,
            key: item,
          }))}
        />
      </Form.Item>
    </>
  );
};
export default SegmentValueTypeOfEvent;
