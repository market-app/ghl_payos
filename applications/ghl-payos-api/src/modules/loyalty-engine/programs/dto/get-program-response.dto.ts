import {
  ENUM_LOYALTY_PROGRAM_STATUS,
  ENUM_LOYALTY_PROGRAM_TYPE,
} from 'src/shared/constants/loyalty-engine.constant';

export class GetProgramDTO {
  name: string;
  status:
    | ENUM_LOYALTY_PROGRAM_STATUS.ACTIVATED
    | ENUM_LOYALTY_PROGRAM_STATUS.DEACTIVATED;

  type:
    | ENUM_LOYALTY_PROGRAM_TYPE.EARN_AND_BURN
    | ENUM_LOYALTY_PROGRAM_TYPE.PERK;

  startDate: string;
  endDate: string;
}
