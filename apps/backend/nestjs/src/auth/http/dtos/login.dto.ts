import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsNumber()
  @IsNotEmpty()
  nim: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}