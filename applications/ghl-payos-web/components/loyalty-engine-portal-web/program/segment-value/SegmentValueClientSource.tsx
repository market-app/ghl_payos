import { Form, FormInstance, Input } from 'antd';
import { useGetClient } from 'hooks/loyalty-engine-portal-web/useClients';
import { get } from 'lodash';
import { useEffect } from 'react';

interface IProps {
  name: any;
  form: FormInstance<any>;
}
const SegmentValueClientSource = ({ name, form }: IProps) => {
  const { data: client, loading: loadingClient } = useGetClient();

  useEffect(() => {
    form.setFieldValue(['segment', name, 'value'], get(client, 'code', 'urstaff'));
  }, [client]);
  return (
    <>
      <Form.Item
        label='Value'
        name={[name, 'value']}
        required
        labelCol={{ span: 24 }}
        rules={[{ required: true, message: 'Không được để trống' }]}
      >
        <Input readOnly style={{ cursor: 'not-allowed' }} />
      </Form.Item>
    </>
  );
};
export default SegmentValueClientSource;
