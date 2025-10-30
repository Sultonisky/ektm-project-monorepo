import {
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import {
  CreateNotifikasiDto,
  NotifikasiResponseDto,
  UpdateNotifikasiDto,
  NotifikasiStatsDto,
  NotificationTypeEnum,
} from '../http/dtos';
import { AppLogger } from '../../../common/logger/logger.service';

@Injectable()
export class NotifikasiService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLogger,
  ) {}

  private toResponse(notifikasi: any): NotifikasiResponseDto {
    return {
      id: notifikasi.id.toString(),
      mahasiswaId: notifikasi.mahasiswaId.toString(),
      type: notifikasi.type,
      title: notifikasi.title,
      message: notifikasi.message,
      icon: notifikasi.icon || 'default',
      isRead: notifikasi.isRead,
      createdAt: notifikasi.createdAt,
      updatedAt: notifikasi.updatedAt,
    };
  }

  async create(dto: CreateNotifikasiDto): Promise<NotifikasiResponseDto> {
    this.logger.log('Creating notification', 'NOTIFIKASI_SERVICE', {
      mahasiswaId: dto.mahasiswaId,
      type: dto.type,
      title: dto.title,
    });

    // Verify mahasiswa exists
    const mahasiswa = await this.prisma.mahasiswa.findUnique({
      where: { id: BigInt(dto.mahasiswaId) },
    });

    if (!mahasiswa) {
      this.logger.warn('Create notification failed - mahasiswa not found', 'NOTIFIKASI_SERVICE', {
        mahasiswaId: dto.mahasiswaId,
      });
      throw new NotFoundException('Mahasiswa not found');
    }

    try {
      const notifikasi = await this.prisma.notification.create({
        data: {
          mahasiswaId: BigInt(dto.mahasiswaId),
          type: dto.type as any,
          title: dto.title,
          message: dto.message,
          icon: dto.icon || 'default',
          isRead: false,
        },
        select: {
          id: true,
          mahasiswaId: true,
          type: true,
          title: true,
          message: true,
          icon: true,
          isRead: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      this.logger.log('Successfully created notification', 'NOTIFIKASI_SERVICE', {
        id: notifikasi.id.toString(),
        mahasiswaId: dto.mahasiswaId,
      });

      return this.toResponse(notifikasi);
    } catch (error) {
      this.logger.error(
        'Failed to create notification',
        error.stack,
        'NOTIFIKASI_SERVICE',
        {
          mahasiswaId: dto.mahasiswaId,
        },
      );
      throw error;
    }
  }

  async findAll(mahasiswaId?: string, filter?: 'all' | 'unread'): Promise<NotifikasiResponseDto[]> {
    this.logger.log('Fetching notifications', 'NOTIFIKASI_SERVICE', {
      mahasiswaId,
      filter,
    });

    try {
      const where: any = {};
      
      if (mahasiswaId) {
        where.mahasiswaId = BigInt(mahasiswaId);
      }

      if (filter === 'unread') {
        where.isRead = false;
      }

      const notifications = await this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          mahasiswaId: true,
          type: true,
          title: true,
          message: true,
          icon: true,
          isRead: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      this.logger.log(
        `Retrieved ${notifications.length} notifications`,
        'NOTIFIKASI_SERVICE',
      );

      return notifications.map((n) => this.toResponse(n));
    } catch (error) {
      this.logger.error(
        'Failed to fetch notifications',
        error.stack,
        'NOTIFIKASI_SERVICE',
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<NotifikasiResponseDto> {
    this.logger.log('Fetching notification by ID', 'NOTIFIKASI_SERVICE', { id });

    try {
      const notifikasi = await this.prisma.notification.findUnique({
        where: { id: BigInt(id) },
        select: {
          id: true,
          mahasiswaId: true,
          type: true,
          title: true,
          message: true,
          icon: true,
          isRead: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!notifikasi) {
        this.logger.warn('Notification not found', 'NOTIFIKASI_SERVICE', { id });
        throw new NotFoundException('Notification not found');
      }

      this.logger.log('Successfully found notification', 'NOTIFIKASI_SERVICE', {
        id,
      });

      return this.toResponse(notifikasi);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        'Failed to fetch notification by ID',
        error.stack,
        'NOTIFIKASI_SERVICE',
        { id },
      );
      throw error;
    }
  }

  async update(id: string, updateDto: UpdateNotifikasiDto): Promise<NotifikasiResponseDto> {
    this.logger.log('Updating notification', 'NOTIFIKASI_SERVICE', {
      id,
      updateFields: Object.keys(updateDto),
    });

    try {
      const existing = await this.prisma.notification.findUnique({
        where: { id: BigInt(id) },
      });

      if (!existing) {
        this.logger.warn(
          'Update failed - notification not found',
          'NOTIFIKASI_SERVICE',
          { id },
        );
        throw new NotFoundException('Notification not found');
      }

      const notifikasi = await this.prisma.notification.update({
        where: { id: BigInt(id) },
        data: {
          isRead: updateDto.isRead,
        },
        select: {
          id: true,
          mahasiswaId: true,
          type: true,
          title: true,
          message: true,
          icon: true,
          isRead: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      this.logger.log('Successfully updated notification', 'NOTIFIKASI_SERVICE', {
        id,
      });

      return this.toResponse(notifikasi);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        'Failed to update notification',
        error.stack,
        'NOTIFIKASI_SERVICE',
        { id },
      );
      throw error;
    }
  }

  async markAsRead(id: string): Promise<NotifikasiResponseDto> {
    return this.update(id, { isRead: true });
  }

  async markAllAsRead(mahasiswaId: string): Promise<void> {
    this.logger.log('Marking all notifications as read', 'NOTIFIKASI_SERVICE', {
      mahasiswaId,
    });

    try {
      await this.prisma.notification.updateMany({
        where: {
          mahasiswaId: BigInt(mahasiswaId),
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });

      this.logger.log('Successfully marked all notifications as read', 'NOTIFIKASI_SERVICE', {
        mahasiswaId,
      });
    } catch (error) {
      this.logger.error(
        'Failed to mark all notifications as read',
        error.stack,
        'NOTIFIKASI_SERVICE',
        { mahasiswaId },
      );
      throw error;
    }
  }

  async getStats(mahasiswaId?: string): Promise<NotifikasiStatsDto> {
    this.logger.log('Getting notification stats', 'NOTIFIKASI_SERVICE', {
      mahasiswaId,
    });

    try {
      const where: any = {};
      
      if (mahasiswaId) {
        where.mahasiswaId = BigInt(mahasiswaId);
      }

      const [total, unread] = await Promise.all([
        this.prisma.notification.count({ where }),
        this.prisma.notification.count({
          where: { ...where, isRead: false },
        }),
      ]);

      return {
        total,
        unread,
      };
    } catch (error) {
      this.logger.error(
        'Failed to get notification stats',
        error.stack,
        'NOTIFIKASI_SERVICE',
      );
      throw error;
    }
  }

  // Helper method to create payment notification based on status
  async createPaymentNotification(
    mahasiswaId: string,
    status: 'success' | 'error' | 'pending',
    paymentCode?: string,
    semester?: number,
  ): Promise<NotifikasiResponseDto> {
    let type: NotificationTypeEnum;
    let title: string;
    let message: string;
    let icon: string;

    const paymentInfo = paymentCode
      ? ` pembayaran ${paymentCode}`
      : semester
        ? ` pembayaran semester ${semester}`
        : ' pembayaran anda';

    switch (status) {
      case 'success':
        type = NotificationTypeEnum.PAYMENT_SUCCESS;
        title = 'Pembayaran Berhasil';
        message = `Selamat!${paymentInfo} telah berhasil dilakukan.`;
        icon = 'payment-success';
        break;
      case 'error':
        type = NotificationTypeEnum.PAYMENT_ERROR;
        title = 'Pembayaran Gagal';
        message = `Maaf,${paymentInfo} mengalami kegagalan. Silakan coba lagi atau hubungi administrator.`;
        icon = 'payment-error';
        break;
      case 'pending':
      default:
        type = NotificationTypeEnum.PAYMENT_PENDING;
        title = 'Pembayaran Pending';
        message = `${paymentInfo.charAt(1).toUpperCase() + paymentInfo.slice(2)} sedang dalam proses verifikasi. Mohon tunggu.`;
        icon = 'payment-pending';
        break;
    }

    return this.create({
      mahasiswaId,
      type,
      title,
      message,
      icon,
    });
  }
}
