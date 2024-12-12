import { routers } from 'layouts/loyalty-engine-portal-web/main';

export const REDIRECT_ROUTER = routers[0].link;
export const LOYALTY_ENGINE = 'loyalty_engine';
export const STRATEGY = 'keycloak';

export const LOYALTY_ENGINE_PORTAL_API_ENDPOINT = '/api/loyalty-engine';

export const CLIENT_AUTH = {
  LOGIN: `authentication/login`,
  VERIFY_TOKEN: `authentication/verify-token`,
};

export enum ENUM_LOYALTY_TIER_NAME {
  SILVER = 'silver',
  GOLD = 'gold',
}

export enum ENUM_LOYALTY_TIER_STATUS {
  ACTIVATED = 'activated',
  DEACTIVATED = 'deactivated',
}

export enum ENUM_LOYALTY_PROGRAM_STATUS {
  ACTIVATED = 'activated',
  DEACTIVATED = 'deactivated',
}

export enum ENUM_LOYALTY_TIER_RECALCULATION_CONFIG {
  RESET = 'reset',
  AUTOMATIC = 'automatic',
}

export enum ENUM_LOYALTY_PROGRAM_TYPE {
  PERK = 'perk',
  EARNING = 'earning',
}

export enum ENUM_LOYALTY_LOGIC_NAME {
  EQUALS = 'equals',
}

export enum ENUM_REWARD_TYPE {
  GIFT_SET = 'gift_set',
  BRAND_VOUCHER = 'brand_voucher',
  UP_POINT = 'up_point',
}

export enum ENUM_REWARD_STATUS {
  ACTIVATED = 'activated',
  DEACTIVATED = 'deactivated',
}

export enum ENUM_PROGRAM_REWARD_MECHANISM_TYPE {
  ONCE = 'once',
  PERIODIC = 'periodic',
}

export enum ENUM_PROGRAM_REWARD_MECHANISM_DURATION_TYPE {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export enum ENUM_PROGRAM_REWARD_MECHANISM_TIME_TO_TOPUP {
  AFTER_REQUEST_TIER = 'after_request_tier',
  FIXED_ON_SELECTED_DATE = 'fixed_on_selected_date',
}

export const LOYALTY_ENGINE_PRIMARY_COLOR = '#6D47C5';

export enum ENUM_LOYALTY_REQUEST_TIER_STATUS {
  WAITING_FOR_APPROVAL = 'waiting_for_approval',
  APPROVED = 'approved',
}
