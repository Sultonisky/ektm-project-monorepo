import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateFakultasDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name?: string;
  
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    campusId?: string;
  }
  