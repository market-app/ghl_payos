import { IsNotEmpty, IsString } from 'class-validator';

export class BuyPlanRequestDTO {
  @IsString()
  @IsNotEmpty()
  redirectUri: string;
}
