import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotifikasiService } from '../core/notifikasi.service';
import {
  CreateNotifikasiDto,
  NotifikasiResponseDto,
  UpdateNotifikasiDto,
  NotifikasiStatsDto,
} from './dtos';

@Controller('notifikasi')
export class NotifikasiController {
  constructor(private readonly notifikasiService: NotifikasiService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateNotifikasiDto): Promise<NotifikasiResponseDto> {
    return this.notifikasiService.create(dto);
  }

  @Get()
  async findAll(
    @Query('mahasiswaId') mahasiswaId?: string,
    @Query('filter') filter?: 'all' | 'unread',
  ): Promise<NotifikasiResponseDto[]> {
    return this.notifikasiService.findAll(mahasiswaId, filter);
  }

  // Get notifications for current logged-in mahasiswa
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async findMine(
    @Req() req: any,
    @Query('filter') filter?: 'all' | 'unread',
  ): Promise<NotifikasiResponseDto[]> {
    const mahasiswaId = req.user?.userId || req.user?.sub; // set in JwtStrategy
    return this.notifikasiService.findAll(mahasiswaId?.toString(), filter);
  }

  @Get('stats')
  async getStats(@Query('mahasiswaId') mahasiswaId?: string): Promise<NotifikasiStatsDto> {
    return this.notifikasiService.getStats(mahasiswaId);
  }

  // Get notification stats for current logged-in mahasiswa
  @Get('me/stats')
  @UseGuards(AuthGuard('jwt'))
  async getMyStats(@Req() req: any): Promise<NotifikasiStatsDto> {
    const mahasiswaId = req.user?.userId || req.user?.sub;
    return this.notifikasiService.getStats(mahasiswaId?.toString());
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<NotifikasiResponseDto> {
    return this.notifikasiService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateNotifikasiDto,
  ): Promise<NotifikasiResponseDto> {
    return this.notifikasiService.update(id, dto);
  }

  @Patch(':id/read')
  @HttpCode(HttpStatus.OK)
  async markAsRead(@Param('id') id: string): Promise<NotifikasiResponseDto> {
    return this.notifikasiService.markAsRead(id);
  }

  @Post('mark-all-read')
  @HttpCode(HttpStatus.OK)
  async markAllAsRead(@Body('mahasiswaId') mahasiswaId: string): Promise<void> {
    return this.notifikasiService.markAllAsRead(mahasiswaId);
  }

  // Mark all as read for current logged-in mahasiswa
  @Post('me/mark-all-read')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async markAllMyNotificationsAsRead(@Req() req: any): Promise<void> {
    const mahasiswaId = (req.user?.userId || req.user?.sub)?.toString();
    return this.notifikasiService.markAllAsRead(mahasiswaId);
  }
}
