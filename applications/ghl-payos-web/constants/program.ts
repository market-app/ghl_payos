import { FormInstance } from 'antd';
import { BASE_STATUS_TITLE, BASE_TAG_STATUS_COLOR } from 'components/common/componentTag';
import { ENUM_LOYALTY_PROGRAM_TYPE } from '.';

export const PROGRAM_STATUS_TITLE = {
  ...BASE_STATUS_TITLE,
};

export const PROGRAM_TAG_STATUS_COLOR = {
  ...BASE_TAG_STATUS_COLOR,
};

export const PROGRAM_TYPE_TITLE: Record<string, string> = {
  [ENUM_LOYALTY_PROGRAM_TYPE.PERK]: 'Perk',
  [ENUM_LOYALTY_PROGRAM_TYPE.EARNING]: 'Earning',
};

export const PROGRAM_TAG_TYPE_COLOR: Record<string, string> = {
  [ENUM_LOYALTY_PROGRAM_TYPE.PERK]: 'blue',
  [ENUM_LOYALTY_PROGRAM_TYPE.EARNING]: 'orange',
};

export enum ENUM_PROGRAM_SEGMENT_ATTR {
  CLIENT_SOURCE = 'client_source',
  USER_TIER = 'user_tier',
  TYPE_OF_EVENT = 'type_of_event',
  EVENT_DETAIL = 'event_detail',
}

export enum ENUM_PROGRAM_SEGMENT_TYPE_OF_EVENT_VALUE {
  TRANSACTION = 'transaction',
  NON_TRANSACTION = 'non_transaction',
}

export enum ENUM_PROGRAM_SEGMENT_EVENT_DETAIL_VALUE {
  BIRTHDAY = 'birthday'
}

export enum ENUM_PROGRAM_SEGMENT_LOGIC {
  EQUALS = 'equals',
}

export type ISegment = {
  [key in ENUM_LOYALTY_PROGRAM_TYPE]: {
    attr: ENUM_PROGRAM_SEGMENT_ATTR;
    required: boolean | ((form: FormInstance<any>) => boolean);
  }[];
};
export type ISegmentSuitableComponentDetail = {
  attr: ENUM_PROGRAM_SEGMENT_ATTR;
  logic: ENUM_PROGRAM_SEGMENT_LOGIC[];
  value: any;
};
export type ISegmentSuitableComponent = {
  [key in ENUM_LOYALTY_PROGRAM_TYPE]: ISegmentSuitableComponentDetail[];
};

export const SEGMENT_CONDITION: ISegment = {
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
      required: (form) => {
        const currentSegments = form.getFieldValue('segment') as ISegmentSuitableComponentDetail[];
        const segmentSuitable = currentSegments.find(
          (item) =>
            item.attr === ENUM_PROGRAM_SEGMENT_ATTR.TYPE_OF_EVENT &&
            item.value === ENUM_PROGRAM_SEGMENT_TYPE_OF_EVENT_VALUE.NON_TRANSACTION,
        );
        return !!segmentSuitable;
      },
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
};
