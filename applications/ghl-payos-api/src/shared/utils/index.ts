import dayjs from 'dayjs';
import { TIMEZONE } from '../constants/payos.constant';

export const isTokenExpired = (createdAt: Date, expireIn: number): boolean => {
  const expireTime = dayjs(createdAt) // Convert `createdAt` từ giây sang đối tượng dayjs
    .tz(TIMEZONE) // Set timezone
    .add(expireIn, 'second') // Cộng thêm expireIn giây
    .subtract(1, 'hour'); // Trừ đi 1 giờ

  // Lấy thời gian hiện tại theo cùng timezone
  const now = dayjs().tz(TIMEZONE);

  // So sánh
  return now.isAfter(expireTime);
};
