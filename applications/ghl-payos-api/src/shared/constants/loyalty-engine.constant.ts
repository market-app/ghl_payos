export enum ENUM_LOYALTY_TIER_STATUS {
  ACTIVATED = 'activated',
  DEACTIVATED = 'deactivated',
}

export enum ENUM_REWARD_STATUS {
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
  EARN_AND_BURN = 'earn_and_burn',
  EARNING = 'earning',
}

export enum ENUM_PROGRAM_SEGMENT_LOGIC {
  EQUALS = 'equals',
}

export enum ENUM_PROGRAM_SEGMENT_ATTR {
  CLIENT_SOURCE = 'client_source',
  USER_TIER = 'user_tier',
  TYPE_OF_EVENT = 'type_of_event',
  EVENT_DETAIL = 'event_detail',
}

export enum ENUM_PROGRAM_SEGMENT_TYPE_CONDITION_NODE {
  AND = 'AND',
  OR = 'OR',
  LEAF = 'LEAF',
}

export enum ENUM_REWARD_TYPE {
  GIFT_SET = 'gift_set',
  BRAND_VOUCHER = 'brand_voucher',
  UP_POINT = 'up_point',
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
/**
 * Các tags để phân biệt reward cho silver và gold
 * @silver: mass (promote)
 * @gold: mass + blind_box
 */
export enum ENUM_REWARD_GIFT_DETAIL_TYPE {
  MASS_PROMOTION = 'mass_promotion',
  PROMOTION = 'promotion',
  BLIND_BOX = 'blind_box',
}

export enum ENUM_LOYALTY_REQUEST_TIER_STATUS {
  WAITING_FOR_APPROVAL = 'waiting_for_approval',
  APPROVED = 'approved',
}

export type ISegment = {
  [key in ENUM_LOYALTY_PROGRAM_TYPE]: {
    attr: ENUM_PROGRAM_SEGMENT_ATTR;
    required: boolean;
  }[];
};

export const LIST_SEGMENT_FOR_PROGRAM_TYPE: ISegment = {
  [ENUM_LOYALTY_PROGRAM_TYPE.PERK]: [
    {
      attr: ENUM_PROGRAM_SEGMENT_ATTR.CLIENT_SOURCE,
      required: true,
    },
    {
      attr: ENUM_PROGRAM_SEGMENT_ATTR.USER_TIER,
      required: true,
    },
  ],
  [ENUM_LOYALTY_PROGRAM_TYPE.EARNING]: [
    {
      attr: ENUM_PROGRAM_SEGMENT_ATTR.TYPE_OF_EVENT,
      required: true,
    },
    {
      attr: ENUM_PROGRAM_SEGMENT_ATTR.EVENT_DETAIL,
      required: false,
    },
    {
      attr: ENUM_PROGRAM_SEGMENT_ATTR.CLIENT_SOURCE,
      required: false,
    },
    {
      attr: ENUM_PROGRAM_SEGMENT_ATTR.USER_TIER,
      required: false,
    },
  ],
  [ENUM_LOYALTY_PROGRAM_TYPE.EARN_AND_BURN]: [],
};

/**
 * Những trường được phép edit theo từng reward type
 */
export const REWARD_VALUE_ALLOW_TO_EDIT_FOR_PROGRAM_TYPE = {
  [ENUM_REWARD_TYPE.BRAND_VOUCHER]: ['status', 'quantity'],
  [ENUM_REWARD_TYPE.GIFT_SET]: ['status', 'quantity'],
  [ENUM_REWARD_TYPE.UP_POINT]: ['status'],
};
