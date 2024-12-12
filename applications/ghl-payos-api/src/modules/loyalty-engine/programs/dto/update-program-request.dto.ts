import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ENUM_LOYALTY_PROGRAM_STATUS } from 'src/shared/constants/loyalty-engine.constant';
import { ProgramRewardDTO } from './create-program-request.dto';

export class UpdateProgramDTO {
  @IsOptional()
  @IsDateString()
  endDate: Date;

  @IsNotEmpty()
  @MinLength(1)
  @IsString()
  name: string;

  @IsNotEmpty()
  @MinLength(1)
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(ENUM_LOYALTY_PROGRAM_STATUS)
  status:
    | ENUM_LOYALTY_PROGRAM_STATUS.ACTIVATED
    | ENUM_LOYALTY_PROGRAM_STATUS.DEACTIVATED;

  @ValidateNested({ each: true })
  @Type(() => ProgramRewardDTO)
  @IsArray()
  @IsDefined()
  @ArrayMinSize(1)
  reward: ProgramRewardDTO[];
}
