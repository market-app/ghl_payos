import { IsNotEmpty, IsString, Matches } from 'class-validator';

const regexKey = /^[a-zA-Z0-9-]+$/;

export class PaymentGatewayKeyRequestDTO {
  @IsString()
  @IsNotEmpty()
  @Matches(regexKey, {
    message: 'Key chữ có thể chứa chữ, số, dấu -',
  })
  clientId = '';

  @IsString()
  @IsNotEmpty()
  @Matches(regexKey, {
    message: 'Key chữ có thể chứa chữ, số, dấu -',
  })
  apiKey = '';

  @IsString()
  @IsNotEmpty()
  @Matches(regexKey, {
    message: 'Key chữ có thể chứa chữ, số, dấu -',
  })
  checksumKey = '';
}
