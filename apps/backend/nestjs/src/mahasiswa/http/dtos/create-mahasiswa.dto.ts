import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min, Max, MinLength } from 'class-validator';

export class CreateMahasiswaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password: string;

  @IsInt()
  @Min(1)
  nim: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  kelas: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  phone: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(8)
  semester: number;

  @IsString()
  @IsNotEmpty()
  jurusanId: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  foto?: string;
} 