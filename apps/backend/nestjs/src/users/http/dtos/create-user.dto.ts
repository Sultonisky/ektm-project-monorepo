import { IsEmail, IsString, IsEnum, MinLength, IsOptional, MaxLength } from 'class-validator';

export enum UserRole {
  admin = 'admin',
  mahasiswa = 'mahasiswa',
}

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.admin;

  @IsString()
  @IsOptional()
  @MaxLength(2048)
  foto?: string;
}
