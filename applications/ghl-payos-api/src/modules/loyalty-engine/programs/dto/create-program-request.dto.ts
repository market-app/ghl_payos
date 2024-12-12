import { Expose, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Validate,
  ValidateNested,
} from 'class-validator';
import 'reflect-metadata';
import {
  ENUM_LOYALTY_PROGRAM_STATUS,
  ENUM_LOYALTY_PROGRAM_TYPE,
  ENUM_PROGRAM_REWARD_MECHANISM_DURATION_TYPE,
  ENUM_PROGRAM_REWARD_MECHANISM_TIME_TO_TOPUP,
  ENUM_PROGRAM_REWARD_MECHANISM_TYPE,
  ENUM_PROGRAM_SEGMENT_ATTR,
  ENUM_PROGRAM_SEGMENT_LOGIC,
  ENUM_REWARD_STATUS,
  ENUM_REWARD_TYPE,
} from 'src/shared/constants/loyalty-engine.constant';
import { IsAfterOneDay, IsEndDateAfterStartDate, Match } from './common.dto';

export class ProgramSegmentDTO {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsEnum(ENUM_PROGRAM_SEGMENT_ATTR, {
    message: `attr phải thuộc trong ${Object.values(
      ENUM_PROGRAM_SEGMENT_ATTR,
    )}`,
  })
  attr:
    | ENUM_PROGRAM_SEGMENT_ATTR.CLIENT_SOURCE
    | ENUM_PROGRAM_SEGMENT_ATTR.EVENT_DETAIL
    | ENUM_PROGRAM_SEGMENT_ATTR.TYPE_OF_EVENT
    | ENUM_PROGRAM_SEGMENT_ATTR.USER_TIER;

  @IsEnum(ENUM_PROGRAM_SEGMENT_LOGIC)
  @IsNotEmpty()
  logic: ENUM_PROGRAM_SEGMENT_LOGIC.EQUALS;

  @IsNotEmpty()
  @IsString()
  value: string;
}

export class ProgramRewardNameDTO {
  @IsNotEmpty()
  @IsPositive()
  @Match('value', {
    message: 'Value và Key phải có giá trị giống nhau',
  })
  key: number;

  @IsNotEmpty()
  @IsString()
  label: string;

  @IsNotEmpty()
  @IsPositive()
  value: number;
}
export class ProgramRewardMechanismDTO {
  @IsNotEmpty()
  @IsEnum(ENUM_PROGRAM_REWARD_MECHANISM_TYPE)
  type:
    | ENUM_PROGRAM_REWARD_MECHANISM_TYPE.ONCE
    | ENUM_PROGRAM_REWARD_MECHANISM_TYPE.PERIODIC;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(ENUM_PROGRAM_REWARD_MECHANISM_DURATION_TYPE)
  durationType:
    | ENUM_PROGRAM_REWARD_MECHANISM_DURATION_TYPE.DAILY
    | ENUM_PROGRAM_REWARD_MECHANISM_DURATION_TYPE.MONTHLY
    | ENUM_PROGRAM_REWARD_MECHANISM_DURATION_TYPE.WEEKLY;

  @IsOptional()
  @IsPositive()
  @Max(31)
  day: number;

  @IsOptional()
  @IsEnum(ENUM_PROGRAM_REWARD_MECHANISM_TIME_TO_TOPUP)
  timeToTopUp:
    | ENUM_PROGRAM_REWARD_MECHANISM_TIME_TO_TOPUP.AFTER_REQUEST_TIER
    | ENUM_PROGRAM_REWARD_MECHANISM_TIME_TO_TOPUP.FIXED_ON_SELECTED_DATE;
}

export class ProgramRewardDTO {
  @IsOptional()
  rewardId: string;

  @IsNotEmpty()
  @IsEnum(ENUM_REWARD_TYPE)
  type:
    | ENUM_REWARD_TYPE.BRAND_VOUCHER
    | ENUM_REWARD_TYPE.GIFT_SET
    | ENUM_REWARD_TYPE.UP_POINT;

  @IsPositive({
    message: 'Số lượng quà phải lớn hơn 0',
  })
  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  @IsDefined()
  @Type(() => ProgramRewardNameDTO)
  @ValidateNested()
  rewardName: ProgramRewardNameDTO;

  @IsNotEmpty()
  @IsEnum(ENUM_REWARD_STATUS)
  status: ENUM_REWARD_STATUS.ACTIVATED | ENUM_REWARD_STATUS.DEACTIVATED;

  @ValidateNested()
  @Type(() => ProgramRewardMechanismDTO)
  @IsDefined()
  mechanism: ProgramRewardMechanismDTO;
}

export class CreateProgramDTO {
  @IsNotEmpty()
  @IsEnum(ENUM_LOYALTY_PROGRAM_TYPE)
  type:
    | ENUM_LOYALTY_PROGRAM_TYPE.EARN_AND_BURN
    | ENUM_LOYALTY_PROGRAM_TYPE.PERK;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  @Validate(IsAfterOneDay, {
    message: 'Ngày bắt đầu phải từ ngày hôm sau',
  })
  startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  @Validate(IsEndDateAfterStartDate, {
    message: 'Ngày kết thúc phải lớn hơn ngày bắt đầu',
  })
  endDate: Date;

  @IsNotEmpty()
  @IsEnum(ENUM_LOYALTY_PROGRAM_STATUS)
  status:
    | ENUM_LOYALTY_PROGRAM_STATUS.ACTIVATED
    | ENUM_LOYALTY_PROGRAM_STATUS.DEACTIVATED;

  @ValidateNested({ each: true })
  @Type(() => ProgramSegmentDTO)
  @IsArray()
  @IsDefined()
  @ArrayMinSize(1)
  segment: ProgramSegmentDTO[];

  @ValidateNested({ each: true })
  @Type(() => ProgramRewardDTO)
  @IsArray()
  @IsDefined()
  @ArrayMinSize(1)
  reward: ProgramRewardDTO[];
}
