import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { CampusService } from '../core/campus.service';
import { CreateCampusDto, CampusResponseDto, UpdateCampusDto } from './dtos';

@Controller('campus')
export class CampusController {
  constructor(private readonly campusService: CampusService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCampusDto): Promise<CampusResponseDto> {
    return this.campusService.create(dto);
  }

  @Get()
  async findAll(): Promise<CampusResponseDto[]> {
    return this.campusService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CampusResponseDto> {
    return this.campusService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCampusDto,
  ): Promise<CampusResponseDto> {
    return this.campusService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.campusService.remove(id);
  }
}
