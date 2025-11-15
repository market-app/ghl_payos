import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AppInfoDTO {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  companyId: string;

  @IsString()
  activeLocation: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  userName?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsOptional()
  @IsBoolean()
  allInfo?: boolean;
}
