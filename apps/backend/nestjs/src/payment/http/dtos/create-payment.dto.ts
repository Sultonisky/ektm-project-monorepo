import { IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';
import { PaymentMethodDto } from './payment-response.dto';

export class CreatePaymentDto {
  @IsNumberString()
  @IsNotEmpty()
  mahasiswaId: string; // BigInt as string in APIs

  @IsString()
  @IsNotEmpty()
  paymentCode: string;

  // All amount fields are strings carrying decimal text, validated at service
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

  @IsEnum(PaymentMethodDto)
  paymentMethod: PaymentMethodDto;
}

