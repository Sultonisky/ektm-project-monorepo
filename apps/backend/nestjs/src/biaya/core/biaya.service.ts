import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import {
  CreateBiayaDto,
  BiayaResponseDto,
  UpdateBiayaDto,
} from '../http/dtos';
import { AppLogger } from '../../../common/logger/logger.service';

@Injectable()
export class BiayaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLogger,
  ) {}

  async create(createDto: CreateBiayaDto): Promise<BiayaResponseDto> {
    this.logger.log('Creating new biaya default', 'BIAYA_SERVICE', { 
      jurusanId: createDto.jurusanId 
    });

    try {
      // Check if jurusan exists
      const jurusan = await this.prisma.jurusan.findUnique({
        where: { id: BigInt(createDto.jurusanId) },
        include: {
          fakultas: {
            include: {
              campus: true,
            },
          },
        },
      });

      if (!jurusan) {
        throw new NotFoundException('Jurusan not found');
      }

      // Check if biaya default already exists for this jurusan and semester
      const existingBiaya = await this.prisma.biayaDefault.findFirst({
        where: { 
          jurusanId: BigInt(createDto.jurusanId),
          semester: createDto.semester || 1
        },
      });

      if (existingBiaya) {
        throw new ConflictException('Biaya default already exists for this jurusan and semester');
      }

      const biaya = await this.prisma.biayaDefault.create({
        data: {
          jurusanId: BigInt(createDto.jurusanId),
          semester: createDto.semester || 1,
          biayaPokok: createDto.biayaPokok,
          biayaTambahanJurusan: createDto.biayaTambahanJurusan,
          biayaPraktikum: createDto.biayaPraktikum,
          biayaUjian: createDto.biayaUjian,
          biayaKegiatan: createDto.biayaKegiatan,
        },
        include: {
          jurusan: {
            include: {
              fakultas: {
                include: {
                  campus: true,
                },
              },
            },
          },
        },
      });

      this.logger.log(
        `Biaya default created successfully with ID: ${biaya.id}`,
        'BIAYA_SERVICE',
      );

      return {
        id: biaya.id.toString(),
        jurusanId: biaya.jurusanId.toString(),
        semester: biaya.semester,
        biayaPokok: biaya.biayaPokok ? Number(biaya.biayaPokok) : undefined,
        biayaTambahanJurusan: biaya.biayaTambahanJurusan ? Number(biaya.biayaTambahanJurusan) : undefined,
        biayaPraktikum: biaya.biayaPraktikum ? Number(biaya.biayaPraktikum) : undefined,
        biayaUjian: biaya.biayaUjian ? Number(biaya.biayaUjian) : undefined,
        biayaKegiatan: biaya.biayaKegiatan ? Number(biaya.biayaKegiatan) : undefined,
        jurusan: {
          id: biaya.jurusan.id.toString(),
          name: biaya.jurusan.name,
          fakultas: {
            id: biaya.jurusan.fakultas.id.toString(),
            name: biaya.jurusan.fakultas.name,
            campus: {
              id: biaya.jurusan.fakultas.campus.id.toString(),
              name: biaya.jurusan.fakultas.campus.name,
            },
          },
        },
        createdAt: biaya.createdAt,
        updatedAt: biaya.updatedAt,
      } as BiayaResponseDto;
    } catch (error) {
      this.logger.error(
        'Failed to create biaya default',
        error.stack,
        'BIAYA_SERVICE',
      );
      throw error;
    }
  }

  async findAll(): Promise<BiayaResponseDto[]> {
    this.logger.log('Fetching all biaya defaults', 'BIAYA_SERVICE');

    try {
      const biayaList = await this.prisma.biayaDefault.findMany({
        include: {
          jurusan: {
            include: {
              fakultas: {
                include: {
                  campus: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      this.logger.log(
        `Retrieved ${biayaList.length} biaya default records`,
        'BIAYA_SERVICE',
      );

      return biayaList.map((biaya) => ({
        id: biaya.id.toString(),
        jurusanId: biaya.jurusanId.toString(),
        semester: biaya.semester,
        biayaPokok: biaya.biayaPokok ? Number(biaya.biayaPokok) : undefined,
        biayaTambahanJurusan: biaya.biayaTambahanJurusan ? Number(biaya.biayaTambahanJurusan) : undefined,
        biayaPraktikum: biaya.biayaPraktikum ? Number(biaya.biayaPraktikum) : undefined,
        biayaUjian: biaya.biayaUjian ? Number(biaya.biayaUjian) : undefined,
        biayaKegiatan: biaya.biayaKegiatan ? Number(biaya.biayaKegiatan) : undefined,
        jurusan: {
          id: biaya.jurusan.id.toString(),
          name: biaya.jurusan.name,
          fakultas: {
            id: biaya.jurusan.fakultas.id.toString(),
            name: biaya.jurusan.fakultas.name,
            campus: {
              id: biaya.jurusan.fakultas.campus.id.toString(),
              name: biaya.jurusan.fakultas.campus.name,
            },
          },
        },
        createdAt: biaya.createdAt,
        updatedAt: biaya.updatedAt,
      })) as BiayaResponseDto[];
    } catch (error) {
      this.logger.error(
        'Failed to fetch biaya defaults',
        error.stack,
        'BIAYA_SERVICE',
      );
      throw error;
    }
  }

  async findByJurusan(jurusanId: string, semester?: number): Promise<BiayaResponseDto | null> {
    this.logger.log('Fetching biaya default by jurusan', 'BIAYA_SERVICE', { jurusanId, semester });

    try {
      const biaya = await this.prisma.biayaDefault.findFirst({
        where: { 
          jurusanId: BigInt(jurusanId),
          semester: semester || 1
        },
        include: {
          jurusan: {
            include: {
              fakultas: {
                include: {
                  campus: true,
                },
              },
            },
          },
        },
      });

      if (!biaya) {
        this.logger.log(
          `No biaya default found for jurusan ${jurusanId}`,
          'BIAYA_SERVICE',
        );
        return null;
      }

      this.logger.log(
        `Biaya default found for jurusan ${jurusanId}`,
        'BIAYA_SERVICE',
      );

      return {
        id: biaya.id.toString(),
        jurusanId: biaya.jurusanId.toString(),
        semester: biaya.semester,
        biayaPokok: biaya.biayaPokok ? Number(biaya.biayaPokok) : undefined,
        biayaTambahanJurusan: biaya.biayaTambahanJurusan ? Number(biaya.biayaTambahanJurusan) : undefined,
        biayaPraktikum: biaya.biayaPraktikum ? Number(biaya.biayaPraktikum) : undefined,
        biayaUjian: biaya.biayaUjian ? Number(biaya.biayaUjian) : undefined,
        biayaKegiatan: biaya.biayaKegiatan ? Number(biaya.biayaKegiatan) : undefined,
        jurusan: {
          id: biaya.jurusan.id.toString(),
          name: biaya.jurusan.name,
          fakultas: {
            id: biaya.jurusan.fakultas.id.toString(),
            name: biaya.jurusan.fakultas.name,
            campus: {
              id: biaya.jurusan.fakultas.campus.id.toString(),
              name: biaya.jurusan.fakultas.campus.name,
            },
          },
        },
        createdAt: biaya.createdAt,
        updatedAt: biaya.updatedAt,
      } as BiayaResponseDto;
    } catch (error) {
      this.logger.error(
        'Failed to fetch biaya default by jurusan',
        error.stack,
        'BIAYA_SERVICE',
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<BiayaResponseDto> {
    this.logger.log('Fetching biaya default by ID', 'BIAYA_SERVICE', { id });

    try {
      const biaya = await this.prisma.biayaDefault.findUnique({
        where: { id: BigInt(id) },
        include: {
          jurusan: {
            include: {
              fakultas: {
                include: {
                  campus: true,
                },
              },
            },
          },
        },
      });

      if (!biaya) {
        throw new NotFoundException('Biaya default not found');
      }

      this.logger.log(
        `Biaya default found with ID: ${biaya.id}`,
        'BIAYA_SERVICE',
      );

      return {
        id: biaya.id.toString(),
        jurusanId: biaya.jurusanId.toString(),
        semester: biaya.semester,
        biayaPokok: biaya.biayaPokok ? Number(biaya.biayaPokok) : undefined,
        biayaTambahanJurusan: biaya.biayaTambahanJurusan ? Number(biaya.biayaTambahanJurusan) : undefined,
        biayaPraktikum: biaya.biayaPraktikum ? Number(biaya.biayaPraktikum) : undefined,
        biayaUjian: biaya.biayaUjian ? Number(biaya.biayaUjian) : undefined,
        biayaKegiatan: biaya.biayaKegiatan ? Number(biaya.biayaKegiatan) : undefined,
        jurusan: {
          id: biaya.jurusan.id.toString(),
          name: biaya.jurusan.name,
          fakultas: {
            id: biaya.jurusan.fakultas.id.toString(),
            name: biaya.jurusan.fakultas.name,
            campus: {
              id: biaya.jurusan.fakultas.campus.id.toString(),
              name: biaya.jurusan.fakultas.campus.name,
            },
          },
        },
        createdAt: biaya.createdAt,
        updatedAt: biaya.updatedAt,
      } as BiayaResponseDto;
    } catch (error) {
      this.logger.error(
        'Failed to fetch biaya default',
        error.stack,
        'BIAYA_SERVICE',
      );
      throw error;
    }
  }

  async update(id: string, updateDto: UpdateBiayaDto): Promise<BiayaResponseDto> {
    this.logger.log('Updating biaya default', 'BIAYA_SERVICE', { id });

    try {
      // Check if biaya default exists
      const existingBiaya = await this.prisma.biayaDefault.findUnique({
        where: { id: BigInt(id) },
      });

      if (!existingBiaya) {
        throw new NotFoundException('Biaya default not found');
      }

      const updatedBiaya = await this.prisma.biayaDefault.update({
        where: { id: BigInt(id) },
        data: {
          biayaPokok: updateDto.biayaPokok,
          biayaTambahanJurusan: updateDto.biayaTambahanJurusan,
          biayaPraktikum: updateDto.biayaPraktikum,
          biayaUjian: updateDto.biayaUjian,
          biayaKegiatan: updateDto.biayaKegiatan,
        },
        include: {
          jurusan: {
            include: {
              fakultas: {
                include: {
                  campus: true,
                },
              },
            },
          },
        },
      });

      this.logger.log(
        `Biaya default updated successfully with ID: ${updatedBiaya.id}`,
        'BIAYA_SERVICE',
      );

      return {
        id: updatedBiaya.id.toString(),
        jurusanId: updatedBiaya.jurusanId.toString(),
        biayaPokok: updatedBiaya.biayaPokok ? Number(updatedBiaya.biayaPokok) : undefined,
        biayaTambahanJurusan: updatedBiaya.biayaTambahanJurusan ? Number(updatedBiaya.biayaTambahanJurusan) : undefined,
        biayaPraktikum: updatedBiaya.biayaPraktikum ? Number(updatedBiaya.biayaPraktikum) : undefined,
        biayaUjian: updatedBiaya.biayaUjian ? Number(updatedBiaya.biayaUjian) : undefined,
        biayaKegiatan: updatedBiaya.biayaKegiatan ? Number(updatedBiaya.biayaKegiatan) : undefined,
        jurusan: {
          id: updatedBiaya.jurusan.id.toString(),
          name: updatedBiaya.jurusan.name,
          fakultas: {
            id: updatedBiaya.jurusan.fakultas.id.toString(),
            name: updatedBiaya.jurusan.fakultas.name,
            campus: {
              id: updatedBiaya.jurusan.fakultas.campus.id.toString(),
              name: updatedBiaya.jurusan.fakultas.campus.name,
            },
          },
        },
        createdAt: updatedBiaya.createdAt,
        updatedAt: updatedBiaya.updatedAt,
      } as BiayaResponseDto;
    } catch (error) {
      this.logger.error(
        'Failed to update biaya default',
        error.stack,
        'BIAYA_SERVICE',
      );
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    this.logger.log('Deleting biaya default', 'BIAYA_SERVICE', { id });

    try {
      // Check if biaya default exists
      const existingBiaya = await this.prisma.biayaDefault.findUnique({
        where: { id: BigInt(id) },
      });

      if (!existingBiaya) {
        throw new NotFoundException('Biaya default not found');
      }

      await this.prisma.biayaDefault.delete({
        where: { id: BigInt(id) },
      });

      this.logger.log(
        `Biaya default deleted successfully with ID: ${id}`,
        'BIAYA_SERVICE',
      );
    } catch (error) {
      this.logger.error(
        'Failed to delete biaya default',
        error.stack,
        'BIAYA_SERVICE',
      );
      throw error;
    }
  }
}
