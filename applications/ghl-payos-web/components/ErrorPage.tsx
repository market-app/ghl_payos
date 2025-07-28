import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { memo } from 'react';

const ErrorPage = () => {
  return (
    <div className=''>
      <Spin
        tip='Loading...'
        indicator={<LoadingOutlined style={{ fontSize: 40 }} />}
      />
    </div>
  );
};

export default memo(ErrorPage);
