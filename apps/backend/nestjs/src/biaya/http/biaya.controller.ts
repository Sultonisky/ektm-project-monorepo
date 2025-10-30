import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { BiayaService } from '../core/biaya.service';
import { CreateBiayaDto, BiayaResponseDto, UpdateBiayaDto } from './dtos';

@Controller('biaya')
export class BiayaController {
  constructor(private readonly biayaService: BiayaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateBiayaDto): Promise<BiayaResponseDto> {
    return this.biayaService.create(dto);
  }

  @Get()
  async findAll(@Query('jurusanId') jurusanId?: string): Promise<BiayaResponseDto[] | BiayaResponseDto | null> {
    if (jurusanId) {
      return this.biayaService.findByJurusan(jurusanId);
    }
    return this.biayaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BiayaResponseDto> {
    return this.biayaService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBiayaDto,
  ): Promise<BiayaResponseDto> {
    return this.biayaService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.biayaService.remove(id);
  }
}
