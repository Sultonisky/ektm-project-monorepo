import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { FakultasService } from '../core/fakultas.service';
import { CreateFakultasDto, FakultasResponseDto, UpdateFakultasDto } from './dtos';

@Controller('fakultas')
export class FakultasController {
  constructor(private readonly fakultasService: FakultasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateFakultasDto): Promise<FakultasResponseDto> {
    return this.fakultasService.create(dto);
  }

  @Get()
  async findAll(@Query('campusId') campusId?: string): Promise<FakultasResponseDto[]> {
    if (campusId) {
      return this.fakultasService.findByCampus(campusId);
    }
    return this.fakultasService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FakultasResponseDto> {
    return this.fakultasService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateFakultasDto,
  ): Promise<FakultasResponseDto> {
    return this.fakultasService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.fakultasService.remove(id);
  }
}
