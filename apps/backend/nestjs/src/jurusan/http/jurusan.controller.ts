import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { JurusanService } from '../core/jurusan.service';
import { CreateJurusanDto, JurusanResponseDto, UpdateJurusanDto } from './dtos';

@Controller('jurusan')
export class JurusanController {
  constructor(private readonly jurusanService: JurusanService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateJurusanDto): Promise<JurusanResponseDto> {
    return this.jurusanService.create(dto);
  }

  @Get()
  async findAll(@Query('fakultasId') fakultasId?: string): Promise<JurusanResponseDto[]> {
    if (fakultasId) {
      return this.jurusanService.findByFakultas(fakultasId);
    }
    return this.jurusanService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<JurusanResponseDto> {
    return this.jurusanService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateJurusanDto,
  ): Promise<JurusanResponseDto> {
    return this.jurusanService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.jurusanService.remove(id);
  }
}
