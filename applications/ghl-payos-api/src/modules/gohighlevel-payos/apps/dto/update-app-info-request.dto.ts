import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateAppInfoRequestDTO {
  @IsNotEmpty()
  @IsString()
  @IsEmail(
    {},
    {
      message: 'email không đúng định dạng',
    },
  )
  email: string;
}
