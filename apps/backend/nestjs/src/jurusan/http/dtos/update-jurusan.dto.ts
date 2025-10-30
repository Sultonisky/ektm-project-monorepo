import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateJurusanDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name?: string;
  
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    fakultasId?: string;
  }
  