import { Typography } from 'antd';

const MessageConfigReward = () => {
  return (
    <div style={{ backgroundColor: '#E6F4FF', borderRadius: '10px', padding: '10px', marginBottom: '20px' }}>
      <b>Cơ chế tặng quà</b>
      <Typography>
        1. Cấp lại định kì: đặc quyền sẽ được cấp lại vào 1 thời điểm cố định theo chu kỳ được chọn
      </Typography>
      <Typography>
        2. Cấp 1 lần trong toàn bộ chương trình: đặc quyền chỉ được cấp 1 lần cho khách hàng vào ngày chương trình khởi
        chạy{' '}
      </Typography>
      <p>
        <b>Thời gian phát quà cho người nhận: </b>
        0h - 1h sáng mỗi ngày - ngay sau khi người nhận được nâng hạng
      </p>
    </div>
  );
};
export default MessageConfigReward;
