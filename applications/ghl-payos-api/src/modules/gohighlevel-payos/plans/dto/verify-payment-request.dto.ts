import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class VerifyPaymentRequestDTO {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsOptional()
  desc: string;

  @IsString()
  @IsNotEmpty()
  signature: string;

  @IsNotEmpty()
  data: Record<string, any>;
}
