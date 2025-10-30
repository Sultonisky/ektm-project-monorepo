import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateFakultasDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;
  
    @IsString()
    @IsNotEmpty()
    campusId: string;
  }
  