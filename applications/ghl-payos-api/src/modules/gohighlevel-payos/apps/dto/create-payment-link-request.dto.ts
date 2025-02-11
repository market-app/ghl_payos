import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreatePaymentLinkRequestDTO {
  @IsString()
  @IsOptional()
  locationId: string;

  @IsPositive()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  amount: number;

  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @IsString()
  @IsNotEmpty()
  redirectUri: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  params: Record<string, any>;
}
