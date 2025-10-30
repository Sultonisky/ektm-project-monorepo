import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { MahasiswaService } from '../core/mahasiswa.service';
import { CreateMahasiswaDto, MahasiswaResponseDto, UpdateMahasiswaDto } from './dtos';

@Controller('mahasiswa')
export class MahasiswaController {
  constructor(private readonly mahasiswaService: MahasiswaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateMahasiswaDto): Promise<MahasiswaResponseDto> {
    return this.mahasiswaService.create(dto);
  }

  @Get()
  async findAll(): Promise<MahasiswaResponseDto[]> {
    return this.mahasiswaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MahasiswaResponseDto> {
    return this.mahasiswaService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMahasiswaDto,
  ): Promise<MahasiswaResponseDto> {
    return this.mahasiswaService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.mahasiswaService.remove(id);
  }
}
