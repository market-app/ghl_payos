import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetProgramRequestDTO {
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  skip = 0;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  limit = 10;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  type: string;

  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  status: string;

  @IsOptional()
  fromStartDate: string;

  @IsOptional()
  toStartDate: string;

  @IsOptional()
  fromEndDate: string;

  @IsOptional()
  toEndDate: string;
}
