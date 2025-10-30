import { IsInt, Min, IsString, MinLength } from 'class-validator';

export class LoginMahasiswaDto {
  @IsInt()
  @Min(1)
  nim: number;

  @IsString()
  @MinLength(6)
  password: string;
}


