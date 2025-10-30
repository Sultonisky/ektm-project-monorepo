import { Injectable, NotFoundException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { AppLogger } from '../../../common/logger/logger.service';
import { CreatePaymentDto, UpdatePaymentDto, PaymentResponseDto } from '../http/dtos';
import { MidtransService, MidtransChargeRequest } from './midtrans.service';
import { NotifikasiService } from '../../notifikasi/core/notifikasi.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLogger,
    private readonly midtransService: MidtransService,
    @Inject(forwardRef(() => NotifikasiService))
    private readonly notifikasiService: NotifikasiService,
  ) {}

  private toResponse(payment: any): PaymentResponseDto {
    return {
      ...payment,
      id: payment.id.toString(),
      mahasiswaId: payment.mahasiswaId.toString(),
      // Ensure decimals are strings
      biayaPokok: payment.biayaPokok?.toString(),
      biayaTambahanJurusan: payment.biayaTambahanJurusan?.toString(),
      biayaPraktikum: payment.biayaPraktikum?.toString(),
      biayaUjian: payment.biayaUjian?.toString(),
      biayaKegiatan: payment.biayaKegiatan?.toString(),
      totalPayment: payment.totalPayment?.toString(),
      // Midtrans fields
      midtransOrderId: payment.midtransOrderId,
      midtransTransactionId: payment.midtransTransactionId,
      midtransPaymentUrl: payment.midtransPaymentUrl,
      midtransVaNumber: payment.midtransVaNumber,
      midtransBillKey: payment.midtransBillKey,
      midtransBillerCode: payment.midtransBillerCode,
    } as PaymentResponseDto;
  }

  async createWithMidtrans(dto: CreatePaymentDto): Promise<PaymentResponseDto> {
    this.logger.log(`Creating payment with Midtrans for code: ${dto.paymentCode}`, 'PaymentService');
    
    const existing = await this.prisma.payment.findUnique({
      where: { paymentCode: dto.paymentCode },
      select: { id: true },
    });
    if (existing) {
      this.logger.warn(`Payment code already exists: ${dto.paymentCode}`, 'PaymentService');
      throw new ConflictException('paymentCode already exists');
    }

    // Calculate total payment
    const biayaPokok = dto.biayaPokok ? parseFloat(dto.biayaPokok) : 0;
    const biayaTambahanJurusan = dto.biayaTambahanJurusan ? parseFloat(dto.biayaTambahanJurusan) : 0;
    const biayaPraktikum = dto.biayaPraktikum ? parseFloat(dto.biayaPraktikum) : 0;
    const biayaUjian = dto.biayaUjian ? parseFloat(dto.biayaUjian) : 0;
    const biayaKegiatan = dto.biayaKegiatan ? parseFloat(dto.biayaKegiatan) : 0;
    
    const totalPayment = biayaPokok + biayaTambahanJurusan + biayaPraktikum + biayaUjian + biayaKegiatan;
    
    if (totalPayment <= 0) {
      throw new ConflictException('Total payment must be greater than 0');
    }

    // Get mahasiswa data for customer details
    const mahasiswa = await this.prisma.mahasiswa.findUnique({
      where: { id: BigInt(dto.mahasiswaId) },
      select: { name: true, email: true, phone: true }
    });

    if (!mahasiswa) {
      throw new NotFoundException('Mahasiswa not found');
    }

    // Create Midtrans order ID
    const midtransOrderId = `PAY-${dto.paymentCode}-${Date.now()}`;

    // Prepare Midtrans charge request
    const midtransRequest: MidtransChargeRequest = {
      payment_type: this.mapPaymentMethodToMidtrans(dto.paymentMethod),
      transaction_details: {
        order_id: midtransOrderId,
        gross_amount: totalPayment,
      },
      customer_details: {
        first_name: mahasiswa.name.split(' ')[0] || mahasiswa.name,
        last_name: mahasiswa.name.split(' ').slice(1).join(' ') || '',
        email: mahasiswa.email,
        phone: mahasiswa.phone,
      },
    };

    // Add specific payment method details
    if (dto.paymentMethod === 'bank') {
      midtransRequest.bank_transfer = { bank: 'bca' }; // Default to BCA
    } else if (dto.paymentMethod === 'e_wallet') {
      midtransRequest.echannel = {
        bill_info1: `Payment: ${dto.paymentCode}`,
        bill_info2: `Mahasiswa: ${mahasiswa.name}`,
      };
    }

    try {
      // Create Midtrans transaction
      const midtransResponse = await this.midtransService.createTransaction(midtransRequest);
      
      this.logger.log(`Midtrans transaction created: ${midtransResponse.transaction_id}`, 'PaymentService');

      // Create payment record in database
      const created = await this.prisma.payment.create({
        data: {
          mahasiswaId: BigInt(dto.mahasiswaId),
          paymentCode: dto.paymentCode,
          biayaPokok: dto.biayaPokok ? dto.biayaPokok : undefined,
          biayaTambahanJurusan: dto.biayaTambahanJurusan ? dto.biayaTambahanJurusan : undefined,
          biayaPraktikum: dto.biayaPraktikum ? dto.biayaPraktikum : undefined,
          biayaUjian: dto.biayaUjian ? dto.biayaUjian : undefined,
          biayaKegiatan: dto.biayaKegiatan ? dto.biayaKegiatan : undefined,
          totalPayment: totalPayment.toString(),
          paymentMethod: dto.paymentMethod as any,
          status: this.mapMidtransStatusToPaymentStatus(midtransResponse.transaction_status) as any,
          
          // Midtrans fields
          midtransOrderId: midtransResponse.order_id,
          midtransTransactionId: midtransResponse.transaction_id,
          midtransPaymentUrl: midtransResponse.actions?.[0]?.url,
          midtransVaNumber: midtransResponse.va_numbers?.[0]?.va_number,
          midtransBillKey: midtransResponse.bill_key,
          midtransBillerCode: midtransResponse.biller_code,
        } as any,
        select: {
          id: true,
          mahasiswaId: true,
          paymentCode: true,
          biayaPokok: true,
          biayaTambahanJurusan: true,
          biayaPraktikum: true,
          biayaUjian: true,
          biayaKegiatan: true,
          totalPayment: true,
          paymentMethod: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      this.logger.log(`Payment created successfully with ID: ${created.id}`, 'PaymentService');
      
      // Create payment pending notification
      try {
        await this.notifikasiService.createPaymentNotification(
          dto.mahasiswaId,
          'pending',
          dto.paymentCode,
        );
        this.logger.log(`Payment pending notification created for payment: ${created.id}`, 'PaymentService');
      } catch (notificationError) {
        // Log error but don't fail the payment creation
        this.logger.warn(
          `Failed to create payment pending notification: ${notificationError.message}`,
          'PaymentService',
        );
      }
      
      return this.toResponse(created);

    } catch (error) {
      this.logger.error(`Failed to create Midtrans transaction: ${error.message}`, 'PaymentService');
      throw error;
    }
  }

  private mapPaymentMethodToMidtrans(paymentMethod: string): string {
    switch (paymentMethod) {
      case 'bank':
        return 'bank_transfer';
      case 'e_wallet':
        return 'echannel';
      case 'credit_card':
        return 'credit_card';
      default:
        return 'bank_transfer';
    }
  }

  private mapMidtransStatusToPaymentStatus(midtransStatus: string): string {
    switch (midtransStatus) {
      case 'pending':
        return 'belum';
      case 'settlement':
        return 'lunas';
      case 'capture':
        return 'lunas';
      case 'deny':
        return 'belum';
      case 'cancel':
        return 'belum';
      case 'expire':
        return 'belum';
      case 'failure':
        return 'belum';
      default:
        return 'belum';
    }
  }

  async getBiayaDefaultByMahasiswa(mahasiswaId: string, semester?: number): Promise<any> {
    this.logger.log(`Getting biaya default for mahasiswa: ${mahasiswaId}, semester: ${semester || 1}`, 'PaymentService');
    
    // Get mahasiswa with jurusan information
    const mahasiswa = await this.prisma.mahasiswa.findUnique({
      where: { id: BigInt(mahasiswaId) },
      include: {
        jurusan: {
        include: {
          biayaDefaults: {
            where: { semester: semester || 1 },
            take: 1
          },
            fakultas: {
              include: {
                campus: true
              }
            }
          }
        }
      }
    });

    if (!mahasiswa) {
      throw new NotFoundException('Mahasiswa not found');
    }

    if (!mahasiswa.jurusan.biayaDefaults || mahasiswa.jurusan.biayaDefaults.length === 0) {
      this.logger.warn(`No biaya default found for jurusan: ${mahasiswa.jurusan.name}, semester: ${semester || 1}`, 'PaymentService');
      return {
        mahasiswa: {
          id: mahasiswa.id.toString(),
          name: mahasiswa.name,
          nim: mahasiswa.nim,
          jurusan: {
            id: mahasiswa.jurusan.id.toString(),
            name: mahasiswa.jurusan.name,
            fakultas: {
              id: mahasiswa.jurusan.fakultas.id.toString(),
              name: mahasiswa.jurusan.fakultas.name,
              campus: {
                id: mahasiswa.jurusan.fakultas.campus.id.toString(),
                name: mahasiswa.jurusan.fakultas.campus.name
              }
            }
          }
        },
        biayaDefault: null,
        message: 'Tidak ada biaya default yang dikonfigurasi untuk jurusan ini'
      };
    }

    const biayaDefault = mahasiswa.jurusan.biayaDefaults[0];
    
    return {
      mahasiswa: {
        id: mahasiswa.id.toString(),
        name: mahasiswa.name,
        nim: mahasiswa.nim,
        jurusan: {
          id: mahasiswa.jurusan.id.toString(),
          name: mahasiswa.jurusan.name,
          fakultas: {
            id: mahasiswa.jurusan.fakultas.id.toString(),
            name: mahasiswa.jurusan.fakultas.name,
            campus: {
              id: mahasiswa.jurusan.fakultas.campus.id.toString(),
              name: mahasiswa.jurusan.fakultas.campus.name
            }
          }
        }
      },
      biayaDefault: {
        id: biayaDefault.id.toString(),
        semester: biayaDefault.semester,
        biayaPokok: biayaDefault.biayaPokok ? Number(biayaDefault.biayaPokok) : 0,
        biayaTambahanJurusan: biayaDefault.biayaTambahanJurusan ? Number(biayaDefault.biayaTambahanJurusan) : 0,
        biayaPraktikum: biayaDefault.biayaPraktikum ? Number(biayaDefault.biayaPraktikum) : 0,
        biayaUjian: biayaDefault.biayaUjian ? Number(biayaDefault.biayaUjian) : 0,
        biayaKegiatan: biayaDefault.biayaKegiatan ? Number(biayaDefault.biayaKegiatan) : 0,
        total: (
          (biayaDefault.biayaPokok ? Number(biayaDefault.biayaPokok) : 0) +
          (biayaDefault.biayaTambahanJurusan ? Number(biayaDefault.biayaTambahanJurusan) : 0) +
          (biayaDefault.biayaPraktikum ? Number(biayaDefault.biayaPraktikum) : 0) +
          (biayaDefault.biayaUjian ? Number(biayaDefault.biayaUjian) : 0) +
          (biayaDefault.biayaKegiatan ? Number(biayaDefault.biayaKegiatan) : 0)
        )
      }
    };
  }

  async create(dto: CreatePaymentDto): Promise<PaymentResponseDto> {
    this.logger.log(`Creating payment with code: ${dto.paymentCode} for mahasiswa: ${dto.mahasiswaId}`, 'PaymentService');
    
    const existing = await this.prisma.payment.findUnique({
      where: { paymentCode: dto.paymentCode },
      select: { id: true },
    });
    if (existing) {
      this.logger.warn(`Payment code already exists: ${dto.paymentCode}`, 'PaymentService');
      throw new ConflictException('paymentCode already exists');
    }

    // Calculate total payment from all biaya fields
    const biayaPokok = dto.biayaPokok ? parseFloat(dto.biayaPokok) : 0;
    const biayaTambahanJurusan = dto.biayaTambahanJurusan ? parseFloat(dto.biayaTambahanJurusan) : 0;
    const biayaPraktikum = dto.biayaPraktikum ? parseFloat(dto.biayaPraktikum) : 0;
    const biayaUjian = dto.biayaUjian ? parseFloat(dto.biayaUjian) : 0;
    const biayaKegiatan = dto.biayaKegiatan ? parseFloat(dto.biayaKegiatan) : 0;
    
    const totalPayment = biayaPokok + biayaTambahanJurusan + biayaPraktikum + biayaUjian + biayaKegiatan;
    
    this.logger.log(`Calculated total payment: ${totalPayment} for payment code: ${dto.paymentCode}`, 'PaymentService');

    const created = await this.prisma.payment.create({
      data: {
        mahasiswaId: BigInt(dto.mahasiswaId),
        paymentCode: dto.paymentCode,
        biayaPokok: dto.biayaPokok ? dto.biayaPokok : undefined,
        biayaTambahanJurusan: dto.biayaTambahanJurusan ? dto.biayaTambahanJurusan : undefined,
        biayaPraktikum: dto.biayaPraktikum ? dto.biayaPraktikum : undefined,
        biayaUjian: dto.biayaUjian ? dto.biayaUjian : undefined,
        biayaKegiatan: dto.biayaKegiatan ? dto.biayaKegiatan : undefined,
        totalPayment: totalPayment > 0 ? totalPayment.toString() : undefined,
        paymentMethod: dto.paymentMethod as any,
      },
      select: {
        id: true,
        mahasiswaId: true,
        paymentCode: true,
        biayaPokok: true,
        biayaTambahanJurusan: true,
        biayaPraktikum: true,
        biayaUjian: true,
        biayaKegiatan: true,
        totalPayment: true,
        paymentMethod: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    this.logger.log(`Payment created successfully with ID: ${created.id} and total: ${created.totalPayment}`, 'PaymentService');
    
    // Create payment pending notification
    try {
      await this.notifikasiService.createPaymentNotification(
        dto.mahasiswaId,
        'pending',
        dto.paymentCode,
      );
      this.logger.log(`Payment pending notification created for payment: ${created.id}`, 'PaymentService');
    } catch (notificationError) {
      // Log error but don't fail the payment creation
      this.logger.warn(
        `Failed to create payment pending notification: ${notificationError.message}`,
        'PaymentService',
      );
    }
    
    return this.toResponse(created);
  }

  async findAll(params?: { mahasiswaId?: string; status?: string }): Promise<PaymentResponseDto[]> {
    this.logger.log(`Finding all payments with filters: ${JSON.stringify(params)}`, 'PaymentService');
    
    const where: any = {};
    if (params?.mahasiswaId) where.mahasiswaId = BigInt(params.mahasiswaId);
    if (params?.status) where.status = params.status as any;

    const list = await this.prisma.payment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        mahasiswaId: true,
        paymentCode: true,
        biayaPokok: true,
        biayaTambahanJurusan: true,
        biayaPraktikum: true,
        biayaUjian: true,
        biayaKegiatan: true,
        totalPayment: true,
        paymentMethod: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    this.logger.log(`Found ${list.length} payments`, 'PaymentService');
    return list.map(p => this.toResponse(p));
  }

  async findOne(id: string): Promise<PaymentResponseDto> {
    this.logger.log(`Finding payment with ID: ${id}`, 'PaymentService');
    
    const payment = await this.prisma.payment.findUnique({
      where: { id: BigInt(id) },
      select: {
        id: true,
        mahasiswaId: true,
        paymentCode: true,
        biayaPokok: true,
        biayaTambahanJurusan: true,
        biayaPraktikum: true,
        biayaUjian: true,
        biayaKegiatan: true,
        totalPayment: true,
        paymentMethod: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!payment) {
      this.logger.warn(`Payment not found with ID: ${id}`, 'PaymentService');
      throw new NotFoundException('Payment not found');
    }
    
    this.logger.log(`Payment found: ${payment.paymentCode} with total: ${payment.totalPayment}`, 'PaymentService');
    return this.toResponse(payment);
  }

  async update(id: string, dto: UpdatePaymentDto): Promise<PaymentResponseDto> {
    // Ensure exists and get current data
    const current = await this.prisma.payment.findUnique({ 
      where: { id: BigInt(id) },
      select: {
        biayaPokok: true,
        biayaTambahanJurusan: true,
        biayaPraktikum: true,
        biayaUjian: true,
        biayaKegiatan: true,
      }
    });
    if (!current) throw new NotFoundException('Payment not found');

    // Calculate total payment from updated or current values
    const biayaPokok = dto.biayaPokok ? parseFloat(dto.biayaPokok) : (current.biayaPokok ? parseFloat(current.biayaPokok.toString()) : 0);
    const biayaTambahanJurusan = dto.biayaTambahanJurusan ? parseFloat(dto.biayaTambahanJurusan) : (current.biayaTambahanJurusan ? parseFloat(current.biayaTambahanJurusan.toString()) : 0);
    const biayaPraktikum = dto.biayaPraktikum ? parseFloat(dto.biayaPraktikum) : (current.biayaPraktikum ? parseFloat(current.biayaPraktikum.toString()) : 0);
    const biayaUjian = dto.biayaUjian ? parseFloat(dto.biayaUjian) : (current.biayaUjian ? parseFloat(current.biayaUjian.toString()) : 0);
    const biayaKegiatan = dto.biayaKegiatan ? parseFloat(dto.biayaKegiatan) : (current.biayaKegiatan ? parseFloat(current.biayaKegiatan.toString()) : 0);
    
    const totalPayment = biayaPokok + biayaTambahanJurusan + biayaPraktikum + biayaUjian + biayaKegiatan;

    const updated = await this.prisma.payment.update({
      where: { id: BigInt(id) },
      data: {
        paymentCode: dto.paymentCode,
        biayaPokok: dto.biayaPokok,
        biayaTambahanJurusan: dto.biayaTambahanJurusan,
        biayaPraktikum: dto.biayaPraktikum,
        biayaUjian: dto.biayaUjian,
        biayaKegiatan: dto.biayaKegiatan,
        totalPayment: totalPayment > 0 ? totalPayment.toString() : undefined,
        paymentMethod: dto.paymentMethod as any,
        status: dto.status as any,
      },
      select: {
        id: true,
        mahasiswaId: true,
        paymentCode: true,
        biayaPokok: true,
        biayaTambahanJurusan: true,
        biayaPraktikum: true,
        biayaUjian: true,
        biayaKegiatan: true,
        totalPayment: true,
        paymentMethod: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return this.toResponse(updated);
  }

  async remove(id: string): Promise<void> {
    const exists = await this.prisma.payment.findUnique({ where: { id: BigInt(id) }, select: { id: true } });
    if (!exists) throw new NotFoundException('Payment not found');
    await this.prisma.payment.delete({ where: { id: BigInt(id) } });
  }

  async findByMidtransOrderId(orderId: string): Promise<PaymentResponseDto | null> {
    this.logger.log(`Finding payment by Midtrans order ID: ${orderId}`, 'PaymentService');
    
    const payment = await this.prisma.payment.findFirst({
      where: { midtransOrderId: orderId } as any,
      select: {
        id: true,
        mahasiswaId: true,
        paymentCode: true,
        biayaPokok: true,
        biayaTambahanJurusan: true,
        biayaPraktikum: true,
        biayaUjian: true,
        biayaKegiatan: true,
        totalPayment: true,
        paymentMethod: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!payment) {
      this.logger.warn(`Payment not found for Midtrans order ID: ${orderId}`, 'PaymentService');
      return null;
    }

    return this.toResponse(payment);
  }

  async updatePaymentStatus(
    id: string, 
    status: string, 
    additionalData?: { midtransTransactionId?: string; midtransStatus?: string }
  ): Promise<void> {
    this.logger.log(`Updating payment ${id} status to: ${status}`, 'PaymentService');
    // Get payment data before update
    const payment = await this.prisma.payment.findUnique({
      where: { id: BigInt(id) },
      select: {
        mahasiswaId: true,
        paymentCode: true,
        semester: true,
        status: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const updateData: any = { status: status as any };

    if (additionalData?.midtransTransactionId) {
      updateData.midtransTransactionId = additionalData.midtransTransactionId;
    }

    await this.prisma.payment.update({
      where: { id: BigInt(id) },
      data: updateData,
    });

    this.logger.log(`Payment ${id} status updated successfully`, 'PaymentService');

    // Create notification based on status change
    if (payment.status !== status) {
      try {
        const mahasiswaId = payment.mahasiswaId.toString();
        const notificationStatus = status === 'lunas' ? 'success' : status === 'belum' ? 'pending' : 'error';

        await this.notifikasiService.createPaymentNotification(
          mahasiswaId,
          notificationStatus as 'success' | 'error' | 'pending',
          payment.paymentCode,
          payment.semester,
        );
        this.logger.log(
          `Payment ${notificationStatus} notification created for payment: ${id}`,
          'PaymentService',
        );
      } catch (notificationError) {
        // Log error but don't fail the status update
        this.logger.warn(
          `Failed to create payment status notification: ${notificationError.message}`,
          'PaymentService',
        );
      }
    }
  }
}
