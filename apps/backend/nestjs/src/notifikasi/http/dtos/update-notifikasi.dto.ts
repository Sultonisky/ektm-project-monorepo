import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotifikasiDto {
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}
