import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class PaymentGatewayKeyRequestDTO {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Key chữ có thể chứa chữ hoặc số',
  })
  clientId = '';

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Key chữ có thể chứa chữ hoặc số',
  })
  apiKey = '';

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Key chữ có thể chứa chữ hoặc số',
  })
  checksumKey = '';
}
