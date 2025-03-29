export const ERROR_MESSAGE_DEFAULT = 'Có lỗi xảy ra, vui lòng liên hệ hieunt0303@gmail để được hỗ trợ';

export enum ENUM_PLAN_DURATION_TYPE {
  'DAY' = 'day',
  'MONTH' = 'month',
}

export const DURATION_TYPE_TITLE = {
  [ENUM_PLAN_DURATION_TYPE.DAY]: 'ngày',
  [ENUM_PLAN_DURATION_TYPE.MONTH]: 'tháng',
};
