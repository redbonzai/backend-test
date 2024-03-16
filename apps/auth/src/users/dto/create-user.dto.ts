import { IsEmail, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  _id?: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
