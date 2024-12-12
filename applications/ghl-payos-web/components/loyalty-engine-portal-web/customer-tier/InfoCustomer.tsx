import { CalendarOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Flex, Typography } from 'antd';
import { BASE_STATUS_TITLE, BASE_TAG_STATUS_COLOR, componentTag } from 'components/common/componentTag';
import dayjs from 'dayjs';
import { IInfoCustomer } from 'types/customer-tier';

interface IProps {
  data: IInfoCustomer;
}
const InfoCustomer = ({ data }: IProps) => {
  return (
    <Card style={{ height: '100%' }}>
      <Flex vertical justify={'center'} align={'center'}>
        <div style={{ border: '1px solid #000000', borderRadius: '100%', padding: '10px' }}>
          <UserOutlined style={{ fontSize: 80 }} />
        </div>
        <Typography.Title level={5}>{data.name}</Typography.Title>
        <Typography>{data.phone}</Typography>
      </Flex>
      <div style={{ marginTop: '30px' }}>
        <Flex gap={5}>
          <CalendarOutlined />
          <Typography>{dayjs(data.dayOfBirth).format('YYYY-MM-DD')}</Typography>
        </Flex>
        <Flex gap={5}>
          <MailOutlined />
          <Typography>{data.companyEmail}</Typography>
        </Flex>
        <Flex gap={5}>
          <UserOutlined />
          {componentTag(BASE_STATUS_TITLE[data.status], BASE_TAG_STATUS_COLOR[data.status])()}
        </Flex>
      </div>
    </Card>
  );
};

export default InfoCustomer;
