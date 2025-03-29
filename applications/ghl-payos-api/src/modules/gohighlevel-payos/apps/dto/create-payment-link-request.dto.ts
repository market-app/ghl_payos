import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePaymentLinkRequestDTO {
  @IsString()
  @IsOptional()
  locationId: string;

  @IsString()
  @IsOptional()
  orderId: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  amount: number;

  @IsString()
  @IsOptional()
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
