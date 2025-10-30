import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export enum NotificationTypeEnum {
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_ERROR = 'payment_error',
  PAYMENT_PENDING = 'payment_pending',
}

export class CreateNotifikasiDto {
  @IsString()
  @IsNotEmpty()
  mahasiswaId: string;

  @IsEnum(NotificationTypeEnum)
  @IsNotEmpty()
  type: NotificationTypeEnum;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  message: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  icon?: string;
}
