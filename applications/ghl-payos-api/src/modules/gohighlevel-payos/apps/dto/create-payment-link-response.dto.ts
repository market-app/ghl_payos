import { IsDefined, IsOptional, IsString } from 'class-validator';

export class CreatePaymentLinkResponseDTO {
  @IsDefined()
  @IsString()
  oderStatus: string;

  @IsString()
  @IsOptional()
  checkoutUrl?: string;
}
