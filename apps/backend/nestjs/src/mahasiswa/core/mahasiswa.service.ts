import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import {
  CreateMahasiswaDto,
  MahasiswaResponseDto,
  UpdateMahasiswaDto,
} from '../http/dtos';
import * as bcrypt from 'bcrypt';
import { AppLogger } from '../../../common/logger/logger.service';

@Injectable()
export class MahasiswaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLogger,
  ) {}

  async create(createDto: CreateMahasiswaDto): Promise<MahasiswaResponseDto> {
    this.logger.log('Attempting to create new mahasiswa', 'MAHASISWA_SERVICE', {
      email: createDto.email,
      nim: createDto.nim,
      jurusanId: createDto.jurusanId,
    });

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

    const emailExists = await this.prisma.mahasiswa.findUnique({
      where: { email: createDto.email },
    });

    if (emailExists) {
      this.logger.warn(
        'Create mahasiswa failed - email already exists',
        'MAHASISWA_SERVICE',
        {
          email: createDto.email,
        },
      );
      throw new ConflictException('Email already exists');
    }

    const nimExists = await this.prisma.mahasiswa.findUnique({
      where: { nim: createDto.nim },
    });

    if (nimExists) {
      this.logger.warn(
        'Create mahasiswa failed - NIM already exists',
        'MAHASISWA_SERVICE',
        {
          nim: createDto.nim,
        },
      );
      throw new ConflictException('NIM already exists');
    }

    const hashedPassword = await bcrypt.hash(createDto.password, 10);

    try {
      const mahasiswa = await this.prisma.mahasiswa.create({
        data: {
          name: createDto.name,
          email: createDto.email,
          password: hashedPassword,
          nim: createDto.nim,
          kelas: createDto.kelas,
          phone: createDto.phone,
          semester: createDto.semester,
          jurusanId: BigInt(createDto.jurusanId),
          foto: createDto.foto,
        },
        select: {
          id: true,
          name: true,
          email: true,
          nim: true,
          kelas: true,
          phone: true,
          semester: true,
          jurusanId: true,
          jurusan: {
            select: {
              id: true,
              name: true,
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
            },
          },
          foto: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      this.logger.log('Successfully created mahasiswa', 'MAHASISWA_SERVICE', {
        id: mahasiswa.id.toString(),
        email: mahasiswa.email,
        nim: mahasiswa.nim,
      });

      return {
        ...mahasiswa,
        id: mahasiswa.id.toString(),
        semester: mahasiswa.semester,
        jurusanId: mahasiswa.jurusanId.toString(),
        jurusan: {
          ...mahasiswa.jurusan,
          id: mahasiswa.jurusan.id.toString(),
          fakultas: {
            ...mahasiswa.jurusan.fakultas,
            id: mahasiswa.jurusan.fakultas.id.toString(),
            campus: {
              ...mahasiswa.jurusan.fakultas.campus,
              id: mahasiswa.jurusan.fakultas.campus.id.toString(),
            },
          },
        },
      } as MahasiswaResponseDto;
    } catch (error) {
      this.logger.error(
        'Failed to create mahasiswa',
        error.stack,
        'MAHASISWA_SERVICE',
        {
          email: createDto.email,
          nim: createDto.nim,
        },
      );
      throw error;
    }
  }

  async findAll(): Promise<MahasiswaResponseDto[]> {
    this.logger.log('Fetching all mahasiswa', 'MAHASISWA_SERVICE');

    try {
      const items = await this.prisma.mahasiswa.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          nim: true,
          kelas: true,
          phone: true,
          semester: true,
          jurusanId: true,
          jurusan: {
            select: {
              id: true,
              name: true,
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
            },
          },
          foto: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      this.logger.log(
        `Retrieved ${items.length} mahasiswa records`,
        'MAHASISWA_SERVICE',
      );

      return items.map((m) => ({
        ...m,
        id: m.id.toString(),
        semester: m.semester,
        jurusanId: m.jurusanId.toString(),
        jurusan: {
          ...m.jurusan,
          id: m.jurusan.id.toString(),
          fakultas: {
            ...m.jurusan.fakultas,
            id: m.jurusan.fakultas.id.toString(),
            campus: {
              ...m.jurusan.fakultas.campus,
              id: m.jurusan.fakultas.campus.id.toString(),
            },
          },
        },
      })) as MahasiswaResponseDto[];
    } catch (error) {
      this.logger.error(
        'Failed to fetch mahasiswa',
        error.stack,
        'MAHASISWA_SERVICE',
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<MahasiswaResponseDto> {
    this.logger.log('Fetching mahasiswa by ID', 'MAHASISWA_SERVICE', { id });

    try {
      const mahasiswa = await this.prisma.mahasiswa.findUnique({
        where: { id: BigInt(id) },
        select: {
          id: true,
          name: true,
          email: true,
          nim: true,
          kelas: true,
          phone: true,
          semester: true,
          jurusanId: true,
          jurusan: {
            select: {
              id: true,
              name: true,
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
            },
          },
          foto: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!mahasiswa) {
        this.logger.warn('Mahasiswa not found', 'MAHASISWA_SERVICE', { id });
        throw new NotFoundException('Mahasiswa not found');
      }

      this.logger.log('Successfully found mahasiswa', 'MAHASISWA_SERVICE', {
        id,
        email: mahasiswa.email,
      });

      return {
        ...mahasiswa,
        id: mahasiswa.id.toString(),
        semester: mahasiswa.semester,
        jurusanId: mahasiswa.jurusanId.toString(),
        jurusan: {
          ...mahasiswa.jurusan,
          id: mahasiswa.jurusan.id.toString(),
          fakultas: {
            ...mahasiswa.jurusan.fakultas,
            id: mahasiswa.jurusan.fakultas.id.toString(),
            campus: {
              ...mahasiswa.jurusan.fakultas.campus,
              id: mahasiswa.jurusan.fakultas.campus.id.toString(),
            },
          },
        },
      } as MahasiswaResponseDto;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        'Failed to fetch mahasiswa by ID',
        error.stack,
        'MAHASISWA_SERVICE',
        { id },
      );
      throw error;
    }
  }

  async update(
    id: string,
    updateDto: UpdateMahasiswaDto,
  ): Promise<MahasiswaResponseDto> {
    this.logger.log('Updating mahasiswa', 'MAHASISWA_SERVICE', {
      id,
      updateFields: Object.keys(updateDto),
    });

    try {
      const existing = await this.prisma.mahasiswa.findUnique({
        where: { id: BigInt(id) },
      });

      if (!existing) {
        this.logger.warn(
          'Update failed - mahasiswa not found',
          'MAHASISWA_SERVICE',
          { id },
        );
        throw new NotFoundException('Mahasiswa not found');
      }

      // Check if jurusan exists (if jurusanId is being updated)
      if (updateDto.jurusanId) {
        const jurusan = await this.prisma.jurusan.findUnique({
          where: { id: BigInt(updateDto.jurusanId) },
        });

        if (!jurusan) {
          throw new NotFoundException('Jurusan not found');
        }
      }

      if (updateDto.email && updateDto.email !== existing.email) {
        const emailExists = await this.prisma.mahasiswa.findUnique({
          where: { email: updateDto.email },
        });

        if (emailExists) {
          this.logger.warn(
            'Update failed - email already exists',
            'MAHASISWA_SERVICE',
            {
              id,
              email: updateDto.email,
            },
          );
          throw new ConflictException('Email already exists');
        }
      }

      if (updateDto.nim && updateDto.nim !== existing.nim) {
        const nimExists = await this.prisma.mahasiswa.findUnique({
          where: { nim: updateDto.nim },
        });

        if (nimExists) {
          this.logger.warn(
            'Update failed - NIM already exists',
            'MAHASISWA_SERVICE',
            {
              id,
              nim: updateDto.nim,
            },
          );
          throw new ConflictException('NIM already exists');
        }
      }

      const data: any = { ...updateDto };
      if (updateDto.password) {
        data.password = await bcrypt.hash(updateDto.password, 10);
      }
      if (updateDto.jurusanId) {
        data.jurusanId = BigInt(updateDto.jurusanId);
      }

      const mahasiswa = await this.prisma.mahasiswa.update({
        where: { id: BigInt(id) },
        data,
        select: {
          id: true,
          name: true,
          email: true,
          nim: true,
          kelas: true,
          phone: true,
          semester: true,
          jurusanId: true,
          jurusan: {
            select: {
              id: true,
              name: true,
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
            },
          },
          foto: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      this.logger.log('Successfully updated mahasiswa', 'MAHASISWA_SERVICE', {
        id,
        email: mahasiswa.email,
      });

      return {
        ...mahasiswa,
        id: mahasiswa.id.toString(),
        semester: mahasiswa.semester,
        jurusanId: mahasiswa.jurusanId.toString(),
        jurusan: {
          ...mahasiswa.jurusan,
          id: mahasiswa.jurusan.id.toString(),
          fakultas: {
            ...mahasiswa.jurusan.fakultas,
            id: mahasiswa.jurusan.fakultas.id.toString(),
            campus: {
              ...mahasiswa.jurusan.fakultas.campus,
              id: mahasiswa.jurusan.fakultas.campus.id.toString(),
            },
          },
        },
      } as MahasiswaResponseDto;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      )
        throw error;

      this.logger.error(
        'Failed to update mahasiswa',
        error.stack,
        'MAHASISWA_SERVICE',
        { id },
      );
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    this.logger.log('Deleting mahasiswa', 'MAHASISWA_SERVICE', { id });

    try {
      const existing = await this.prisma.mahasiswa.findUnique({
        where: { id: BigInt(id) },
      });

      if (!existing) {
        this.logger.warn(
          'Delete failed - mahasiswa not found',
          'MAHASISWA_SERVICE',
          { id },
        );
        throw new NotFoundException('Mahasiswa not found');
      }

      await this.prisma.mahasiswa.delete({ where: { id: BigInt(id) } });

      this.logger.log('Successfully deleted mahasiswa', 'MAHASISWA_SERVICE', {
        id,
        email: existing.email,
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        'Failed to delete mahasiswa',
        error.stack,
        'MAHASISWA_SERVICE',
        { id },
      );
      throw error;
    }
  }
}