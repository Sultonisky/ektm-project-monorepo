import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import {
  CreateJurusanDto,
  JurusanResponseDto,
  UpdateJurusanDto,
} from '../http/dtos';
import { AppLogger } from '../../../common/logger/logger.service';

@Injectable()
export class JurusanService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLogger,
  ) {}

  async create(createDto: CreateJurusanDto): Promise<JurusanResponseDto> {
    this.logger.log('Creating new jurusan', 'JURUSAN_SERVICE', { 
      name: createDto.name, 
      fakultasId: createDto.fakultasId 
    });

    try {
      // Check if fakultas exists
      const fakultas = await this.prisma.fakultas.findUnique({
        where: { id: BigInt(createDto.fakultasId) },
        include: {
          campus: true,
        },
      });

      if (!fakultas) {
        throw new NotFoundException('Fakultas not found');
      }

      // Check if jurusan already exists in this fakultas
      const existingJurusan = await this.prisma.jurusan.findFirst({
        where: { 
          name: createDto.name,
          fakultasId: BigInt(createDto.fakultasId),
        },
      });

      if (existingJurusan) {
        throw new ConflictException('Jurusan with this name already exists in this faculty');
      }

      const jurusan = await this.prisma.jurusan.create({
        data: {
          name: createDto.name,
          fakultasId: BigInt(createDto.fakultasId),
        },
        select: {
          id: true,
          name: true,
          fakultasId: true,
          fakultas: {
            select: {
              id: true,
              name: true,
              campus: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      });

      this.logger.log(
        `Jurusan created successfully with ID: ${jurusan.id}`,
        'JURUSAN_SERVICE',
      );

      return {
        ...jurusan,
        id: jurusan.id.toString(),
        fakultasId: jurusan.fakultasId.toString(),
        fakultas: {
          ...jurusan.fakultas,
          id: jurusan.fakultas.id.toString(),
          campus: {
            ...jurusan.fakultas.campus,
            id: jurusan.fakultas.campus.id.toString(),
          },
        },
      } as JurusanResponseDto;
    } catch (error) {
      this.logger.error(
        'Failed to create jurusan',
        error.stack,
        'JURUSAN_SERVICE',
      );
      throw error;
    }
  }

  async findAll(): Promise<JurusanResponseDto[]> {
    this.logger.log('Fetching all jurusan', 'JURUSAN_SERVICE');

    try {
      const jurusan = await this.prisma.jurusan.findMany({
        select: {
          id: true,
          name: true,
          fakultasId: true,
          fakultas: {
            select: {
              id: true,
              name: true,
              campus: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      this.logger.log(
        `Retrieved ${jurusan.length} jurusan records`,
        'JURUSAN_SERVICE',
      );

      return jurusan.map((jurusan) => ({
        ...jurusan,
        id: jurusan.id.toString(),
        fakultasId: jurusan.fakultasId.toString(),
        fakultas: {
          ...jurusan.fakultas,
          id: jurusan.fakultas.id.toString(),
          campus: {
            ...jurusan.fakultas.campus,
            id: jurusan.fakultas.campus.id.toString(),
          },
        },
      })) as JurusanResponseDto[];
    } catch (error) {
      this.logger.error(
        'Failed to fetch jurusan',
        error.stack,
        'JURUSAN_SERVICE',
      );
      throw error;
    }
  }

  async findByFakultas(fakultasId: string): Promise<JurusanResponseDto[]> {
    this.logger.log('Fetching jurusan by fakultas', 'JURUSAN_SERVICE', { fakultasId });

    try {
      const jurusan = await this.prisma.jurusan.findMany({
        where: { fakultasId: BigInt(fakultasId) },
        select: {
          id: true,
          name: true,
          fakultasId: true,
          fakultas: {
            select: {
              id: true,
              name: true,
              campus: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { name: 'asc' },
      });

      this.logger.log(
        `Retrieved ${jurusan.length} jurusan for fakultas ${fakultasId}`,
        'JURUSAN_SERVICE',
      );

      return jurusan.map((jurusan) => ({
        ...jurusan,
        id: jurusan.id.toString(),
        fakultasId: jurusan.fakultasId.toString(),
        fakultas: {
          ...jurusan.fakultas,
          id: jurusan.fakultas.id.toString(),
          campus: {
            ...jurusan.fakultas.campus,
            id: jurusan.fakultas.campus.id.toString(),
          },
        },
      })) as JurusanResponseDto[];
    } catch (error) {
      this.logger.error(
        'Failed to fetch jurusan by fakultas',
        error.stack,
        'JURUSAN_SERVICE',
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<JurusanResponseDto> {
    this.logger.log('Fetching jurusan by ID', 'JURUSAN_SERVICE', { id });

    try {
      const jurusan = await this.prisma.jurusan.findUnique({
        where: { id: BigInt(id) },
        select: {
          id: true,
          name: true,
          fakultasId: true,
          fakultas: {
            select: {
              id: true,
              name: true,
              campus: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!jurusan) {
        throw new NotFoundException('Jurusan not found');
      }

      this.logger.log(
        `Jurusan found with ID: ${jurusan.id}`,
        'JURUSAN_SERVICE',
      );

      return {
        ...jurusan,
        id: jurusan.id.toString(),
        fakultasId: jurusan.fakultasId.toString(),
        fakultas: {
          ...jurusan.fakultas,
          id: jurusan.fakultas.id.toString(),
          campus: {
            ...jurusan.fakultas.campus,
            id: jurusan.fakultas.campus.id.toString(),
          },
        },
      } as JurusanResponseDto;
    } catch (error) {
      this.logger.error(
        'Failed to fetch jurusan',
        error.stack,
        'JURUSAN_SERVICE',
      );
      throw error;
    }
  }

  async update(id: string, updateDto: UpdateJurusanDto): Promise<JurusanResponseDto> {
    this.logger.log('Updating jurusan', 'JURUSAN_SERVICE', { id });

    try {
      // Check if jurusan exists
      const existingJurusan = await this.prisma.jurusan.findUnique({
        where: { id: BigInt(id) },
      });

      if (!existingJurusan) {
        throw new NotFoundException('Jurusan not found');
      }

      // Check if fakultas exists (if fakultasId is being updated)
      if (updateDto.fakultasId) {
        const fakultas = await this.prisma.fakultas.findUnique({
          where: { id: BigInt(updateDto.fakultasId) },
        });

        if (!fakultas) {
          throw new NotFoundException('Fakultas not found');
        }
      }

      // Check if new name already exists in the fakultas (if name is being updated)
      if (updateDto.name && updateDto.name !== existingJurusan.name) {
        const fakultasId = updateDto.fakultasId ? BigInt(updateDto.fakultasId) : existingJurusan.fakultasId;
        const nameExists = await this.prisma.jurusan.findFirst({
          where: { 
            name: updateDto.name,
            fakultasId: fakultasId,
          },
        });

        if (nameExists) {
          throw new ConflictException('Jurusan with this name already exists in this faculty');
        }
      }

      const updatedJurusan = await this.prisma.jurusan.update({
        where: { id: BigInt(id) },
        data: {
          name: updateDto.name,
          fakultasId: updateDto.fakultasId ? BigInt(updateDto.fakultasId) : undefined,
        },
        select: {
          id: true,
          name: true,
          fakultasId: true,
          fakultas: {
            select: {
              id: true,
              name: true,
              campus: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      });

      this.logger.log(
        `Jurusan updated successfully with ID: ${updatedJurusan.id}`,
        'JURUSAN_SERVICE',
      );

      return {
        ...updatedJurusan,
        id: updatedJurusan.id.toString(),
        fakultasId: updatedJurusan.fakultasId.toString(),
        fakultas: {
          ...updatedJurusan.fakultas,
          id: updatedJurusan.fakultas.id.toString(),
          campus: {
            ...updatedJurusan.fakultas.campus,
            id: updatedJurusan.fakultas.campus.id.toString(),
          },
        },
      } as JurusanResponseDto;
    } catch (error) {
      this.logger.error(
        'Failed to update jurusan',
        error.stack,
        'JURUSAN_SERVICE',
      );
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    this.logger.log('Deleting jurusan', 'JURUSAN_SERVICE', { id });

    try {
      // Check if jurusan exists
      const existingJurusan = await this.prisma.jurusan.findUnique({
        where: { id: BigInt(id) },
        include: {
          mahasiswa: true,
          biayaDefaults: true,
        },
      });

      if (!existingJurusan) {
        throw new NotFoundException('Jurusan not found');
      }

      // Check if jurusan has associated data
      const hasMahasiswa = existingJurusan.mahasiswa.length > 0;
      const hasBiayaDefaults = existingJurusan.biayaDefaults.length > 0;
      
      if (hasMahasiswa) {
        throw new ConflictException(
          'Cannot delete jurusan that has associated students. Please delete all students first.',
        );
      }
      
      if (hasBiayaDefaults) {
        throw new ConflictException(
          'Cannot delete jurusan that has associated biaya defaults. Please delete all biaya defaults first.',
        );
      }

      await this.prisma.jurusan.delete({
        where: { id: BigInt(id) },
      });

      this.logger.log(
        `Jurusan deleted successfully with ID: ${id}`,
        'JURUSAN_SERVICE',
      );
    } catch (error) {
      this.logger.error(
        'Failed to delete jurusan',
        error.stack,
        'JURUSAN_SERVICE',
      );
      throw error;
    }
  }
}
