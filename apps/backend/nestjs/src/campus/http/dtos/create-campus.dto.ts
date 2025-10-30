import { IsNotEmpty, IsString, MaxLength, IsOptional } from "class-validator";

export class CreateCampusDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @IsString()
    @IsOptional()
    @MaxLength(2048)
    foto?: string;

    @IsString()
    @IsOptional()
    @MaxLength(500)
    address?: string;
  }