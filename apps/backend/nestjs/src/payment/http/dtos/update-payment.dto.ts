import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentMethodDto, PaymentStatusDto } from './payment-response.dto';

export class UpdatePaymentDto {
  @IsOptional()
  @IsString()
  paymentCode?: string;

  @IsOptional()
  @IsString()
  biayaPokok?: string;

  @IsOptional()
  @IsString()
  biayaTambahanJurusan?: string;

  @IsOptional()
  @IsString()
  biayaPraktikum?: string;

  @IsOptional()
  @IsString()
  biayaUjian?: string;

  @IsOptional()
  @IsString()
  biayaKegiatan?: string;

  @IsOptional()
  @IsEnum(PaymentMethodDto)
  paymentMethod?: PaymentMethodDto;

  @IsOptional()
  @IsEnum(PaymentStatusDto)
  status?: PaymentStatusDto;
}

