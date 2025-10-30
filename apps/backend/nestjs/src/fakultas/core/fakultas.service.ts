import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import {
  CreateFakultasDto,
  FakultasResponseDto,
  UpdateFakultasDto,
} from '../http/dtos';
import { AppLogger } from '../../../common/logger/logger.service';

@Injectable()
export class FakultasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLogger,
  ) {}

  async create(createDto: CreateFakultasDto): Promise<FakultasResponseDto> {
    this.logger.log('Creating new fakultas', 'FAKULTAS_SERVICE', { 
      name: createDto.name, 
      campusId: createDto.campusId 
    });

    try {
      // Check if campus exists
      const campus = await this.prisma.campus.findUnique({
        where: { id: BigInt(createDto.campusId) },
      });

      if (!campus) {
        throw new NotFoundException('Campus not found');
      }

      // Check if fakultas already exists in this campus
      const existingFakultas = await this.prisma.fakultas.findFirst({
        where: { 
          name: createDto.name,
          campusId: BigInt(createDto.campusId),
        },
      });

      if (existingFakultas) {
        throw new ConflictException('Fakultas with this name already exists in this campus');
      }

      const fakultas = await this.prisma.fakultas.create({
        data: {
          name: createDto.name,
          campusId: BigInt(createDto.campusId),
        },
        select: {
          id: true,
          name: true,
          campusId: true,
          campus: {
            select: {
              id: true,
              name: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      });

      this.logger.log(
        `Fakultas created successfully with ID: ${fakultas.id}`,
        'FAKULTAS_SERVICE',
      );

      return {
        ...fakultas,
        id: fakultas.id.toString(),
        campusId: fakultas.campusId.toString(),
        campus: {
          ...fakultas.campus,
          id: fakultas.campus.id.toString(),
        },
      } as FakultasResponseDto;
    } catch (error) {
      this.logger.error(
        'Failed to create fakultas',
        error.stack,
        'FAKULTAS_SERVICE',
      );
      throw error;
    }
  }

  async findAll(): Promise<FakultasResponseDto[]> {
    this.logger.log('Fetching all fakultas', 'FAKULTAS_SERVICE');

    try {
      const fakultas = await this.prisma.fakultas.findMany({
        select: {
          id: true,
          name: true,
          campusId: true,
          campus: {
            select: {
              id: true,
              name: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      this.logger.log(
        `Retrieved ${fakultas.length} fakultas records`,
        'FAKULTAS_SERVICE',
      );

      return fakultas.map((fakultas) => ({
        ...fakultas,
        id: fakultas.id.toString(),
        campusId: fakultas.campusId.toString(),
        campus: {
          ...fakultas.campus,
          id: fakultas.campus.id.toString(),
        },
      })) as FakultasResponseDto[];
    } catch (error) {
      this.logger.error(
        'Failed to fetch fakultas',
        error.stack,
        'FAKULTAS_SERVICE',
      );
      throw error;
    }
  }

  async findByCampus(campusId: string): Promise<FakultasResponseDto[]> {
    this.logger.log('Fetching fakultas by campus', 'FAKULTAS_SERVICE', { campusId });

    try {
      const fakultas = await this.prisma.fakultas.findMany({
        where: { campusId: BigInt(campusId) },
        select: {
          id: true,
          name: true,
          campusId: true,
          campus: {
            select: {
              id: true,
              name: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { name: 'asc' },
      });

      this.logger.log(
        `Retrieved ${fakultas.length} fakultas for campus ${campusId}`,
        'FAKULTAS_SERVICE',
      );

      return fakultas.map((fakultas) => ({
        ...fakultas,
        id: fakultas.id.toString(),
        campusId: fakultas.campusId.toString(),
        campus: {
          ...fakultas.campus,
          id: fakultas.campus.id.toString(),
        },
      })) as FakultasResponseDto[];
    } catch (error) {
      this.logger.error(
        'Failed to fetch fakultas by campus',
        error.stack,
        'FAKULTAS_SERVICE',
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<FakultasResponseDto> {
    this.logger.log('Fetching fakultas by ID', 'FAKULTAS_SERVICE', { id });

    try {
      const fakultas = await this.prisma.fakultas.findUnique({
        where: { id: BigInt(id) },
        select: {
          id: true,
          name: true,
          campusId: true,
          campus: {
            select: {
              id: true,
              name: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!fakultas) {
        throw new NotFoundException('Fakultas not found');
      }

      this.logger.log(
        `Fakultas found with ID: ${fakultas.id}`,
        'FAKULTAS_SERVICE',
      );

      return {
        ...fakultas,
        id: fakultas.id.toString(),
        campusId: fakultas.campusId.toString(),
        campus: {
          ...fakultas.campus,
          id: fakultas.campus.id.toString(),
        },
      } as FakultasResponseDto;
    } catch (error) {
      this.logger.error(
        'Failed to fetch fakultas',
        error.stack,
        'FAKULTAS_SERVICE',
      );
      throw error;
    }
  }

  async update(id: string, updateDto: UpdateFakultasDto): Promise<FakultasResponseDto> {
    this.logger.log('Updating fakultas', 'FAKULTAS_SERVICE', { id });

    try {
      // Check if fakultas exists
      const existingFakultas = await this.prisma.fakultas.findUnique({
        where: { id: BigInt(id) },
      });

      if (!existingFakultas) {
        throw new NotFoundException('Fakultas not found');
      }

      // Check if campus exists (if campusId is being updated)
      if (updateDto.campusId) {
        const campus = await this.prisma.campus.findUnique({
          where: { id: BigInt(updateDto.campusId) },
        });

        if (!campus) {
          throw new NotFoundException('Campus not found');
        }
      }

      // Check if new name already exists in the campus (if name is being updated)
      if (updateDto.name && updateDto.name !== existingFakultas.name) {
        const campusId = updateDto.campusId ? BigInt(updateDto.campusId) : existingFakultas.campusId;
        const nameExists = await this.prisma.fakultas.findFirst({
          where: { 
            name: updateDto.name,
            campusId: campusId,
          },
        });

        if (nameExists) {
          throw new ConflictException('Fakultas with this name already exists in this campus');
        }
      }

      const updatedFakultas = await this.prisma.fakultas.update({
        where: { id: BigInt(id) },
        data: {
          name: updateDto.name,
          campusId: updateDto.campusId ? BigInt(updateDto.campusId) : undefined,
        },
        select: {
          id: true,
          name: true,
          campusId: true,
          campus: {
            select: {
              id: true,
              name: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      });

      this.logger.log(
        `Fakultas updated successfully with ID: ${updatedFakultas.id}`,
        'FAKULTAS_SERVICE',
      );

      return {
        ...updatedFakultas,
        id: updatedFakultas.id.toString(),
        campusId: updatedFakultas.campusId.toString(),
        campus: {
          ...updatedFakultas.campus,
          id: updatedFakultas.campus.id.toString(),
        },
      } as FakultasResponseDto;
    } catch (error) {
      this.logger.error(
        'Failed to update fakultas',
        error.stack,
        'FAKULTAS_SERVICE',
      );
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    this.logger.log('Deleting fakultas', 'FAKULTAS_SERVICE', { id });

    try {
      // Check if fakultas exists
      const existingFakultas = await this.prisma.fakultas.findUnique({
        where: { id: BigInt(id) },
        include: {
          jurusan: {
            include: {
              mahasiswa: true,
            },
          },
        },
      });

      if (!existingFakultas) {
        throw new NotFoundException('Fakultas not found');
      }

      // Check if fakultas has associated data
      const hasJurusan = existingFakultas.jurusan.length > 0;
      if (hasJurusan) {
        throw new ConflictException(
          'Cannot delete fakultas that has associated majors. Please delete all majors first.',
        );
      }

      await this.prisma.fakultas.delete({
        where: { id: BigInt(id) },
      });

      this.logger.log(
        `Fakultas deleted successfully with ID: ${id}`,
        'FAKULTAS_SERVICE',
      );
    } catch (error) {
      this.logger.error(
        'Failed to delete fakultas',
        error.stack,
        'FAKULTAS_SERVICE',
      );
      throw error;
    }
  }
}
