import { IsString } from 'class-validator';

export class VerifyPaymentRequestDTO {
  @IsString()
  apiKey: string;

  @IsString()
  type: string;

  @IsString()
  chargeId: string;
}
