import { IsOptional, IsDecimal, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateBiayaDto {
  @IsOptional()
  @IsDecimal({ decimal_digits: '0,2' })
  @Min(0)
  @Transform(({ value }) => value ? parseFloat(value) : null)
  biayaPokok?: number;

  @IsOptional()
  @IsDecimal({ decimal_digits: '0,2' })
  @Min(0)
  @Transform(({ value }) => value ? parseFloat(value) : null)
  biayaTambahanJurusan?: number;

  @IsOptional()
  @IsDecimal({ decimal_digits: '0,2' })
  @Min(0)
  @Transform(({ value }) => value ? parseFloat(value) : null)
  biayaPraktikum?: number;

  @IsOptional()
  @IsDecimal({ decimal_digits: '0,2' })
  @Min(0)
  @Transform(({ value }) => value ? parseFloat(value) : null)
  biayaUjian?: number;

  @IsOptional()
  @IsDecimal({ decimal_digits: '0,2' })
  @Min(0)
  @Transform(({ value }) => value ? parseFloat(value) : null)
  biayaKegiatan?: number;
}