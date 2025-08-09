import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class WebhookPayosDataDTO {
  @IsNotEmpty()
  orderCode: string;

  amount: number;

  description: string;

  @IsNotEmpty()
  paymentLinkId: string;
}
export class WebhookPayosRequestDTO {
  @IsString()
  code: string;

  @IsString()
  desc: string;

  @IsNotEmpty()
  signature: string;

  @IsNotEmpty()
  data: WebhookPayosDataDTO;
}
