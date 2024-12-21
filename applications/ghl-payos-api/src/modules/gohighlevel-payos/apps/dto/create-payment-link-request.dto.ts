import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreatePaymentLinkRequestDTO {
  @IsString()
  @IsNotEmpty()
  locationId: string;

  @IsPositive()
  @IsNotEmpty()
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
}
