import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class BuyPlanRequestDTO {
  @IsString()
  @IsNotEmpty()
  redirectUri: string;

  @IsPositive()
  @IsNotEmpty()
  planId: number;
}
