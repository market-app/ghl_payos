import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class PaginationRequest {
  @IsString()
  title: string;

  @IsNumberString()
  @IsNotEmpty()
  limit: string;

  @IsNumberString()
  @IsNotEmpty()
  skip: string;
}
