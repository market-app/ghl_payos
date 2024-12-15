import { IsNotEmpty, IsString } from 'class-validator';

export class PaymentGatewayKeyRequestDTO {
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  apiKey: string;

  @IsString()
  @IsNotEmpty()
  checksumKey: string;
}
