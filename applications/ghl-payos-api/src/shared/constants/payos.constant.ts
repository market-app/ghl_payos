export enum ENUM_PAYOS_APP_STATE {
  INSTALLED = 'installed',
  UNINSTALLED = 'uninstalled',
}

export enum ENUM_GHL_GRANT_TYPE {
  AUTHORIZATION_CODE = 'authorization_code',
  REFRESH_TOKEN = 'refresh_token',
}

export const TIMEZONE = 'Asia/Ho_Chi_Minh';

export enum ENUM_WEBHOOK_TYPE {
  UNINSTALL = 'UNINSTALL',
}

export const ERROR_MESSAGE_DEFAULT =
  'Có lỗi xảy ra, vui lòng liên hệ hieunt0303@gmail để được hỗ trợ';

export enum ENUM_PROVIDER_CONFIG_KEY {
  API_KEY = 'apiKey',
  PUBLISHABLE_KEY = 'publishableKey',
}

export enum ENUM_VERIFY_PAYMENT_TYPE {
  VERIFY = 'verify',
}

export enum ENUM_PAYOS_PAYMENT_STATUS {
  PAID = 'PAID',
}

export enum ENUM_CREATED_BY_DEFAULT {
  SYSTEM = 'system',
  GHL_SYSTEM = 'ghl_system',
  PAYOS_SYSTEM = 'payos_system',
}

export enum ENUM_ORDER_STATUS {
  NEW = 'new',
  PAID = 'paid',
  FAILED = 'failed',
}
