import { IsNotEmpty, IsString } from 'class-validator';

export class AppInfoDTO {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  companyId: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  type: string;

  @IsString()
  activeLocation: string;

  @IsString()
  userName: string;

  @IsString()
  email: string;
}
