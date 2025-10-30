import { Controller, Get, Post, Patch, Delete, Param, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentService } from '../core/payment.service';
import { CreatePaymentDto, UpdatePaymentDto, PaymentResponseDto } from './dtos';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreatePaymentDto): Promise<PaymentResponseDto> {
    return this.paymentService.create(dto);
  }

  @Post('midtrans')
  @HttpCode(HttpStatus.CREATED)
  async createWithMidtrans(@Body() dto: CreatePaymentDto): Promise<PaymentResponseDto> {
    return this.paymentService.createWithMidtrans(dto);
  }

  @Get('biaya-default/:mahasiswaId')
  async getBiayaDefaultByMahasiswa(
    @Param('mahasiswaId') mahasiswaId: string,
    @Query('semester') semester?: string
  ): Promise<any> {
    return this.paymentService.getBiayaDefaultByMahasiswa(mahasiswaId, semester ? parseInt(semester) : undefined);
  }

  @Get()
  async findAll(
    @Query('mahasiswaId') mahasiswaId?: string,
    @Query('status') status?: string,
  ): Promise<PaymentResponseDto[]> {
    return this.paymentService.findAll({ mahasiswaId, status });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PaymentResponseDto> {
    return this.paymentService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePaymentDto,
  ): Promise<PaymentResponseDto> {
    return this.paymentService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.paymentService.remove(id);
  }
}
