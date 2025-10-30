import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateJurusanDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;
  
    @IsString()
    @IsNotEmpty()
    fakultasId: string;
  }