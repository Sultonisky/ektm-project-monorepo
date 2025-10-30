import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import {
  CreateCampusDto,
  CampusResponseDto,
  UpdateCampusDto,
} from '../http/dtos';
import { AppLogger } from '../../../common/logger/logger.service';

@Injectable()
export class CampusService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLogger,
  ) {}

  async create(createDto: CreateCampusDto): Promise<CampusResponseDto> {
    this.logger.log('Creating new campus', 'CAMPUS_SERVICE', { name: createDto.name });

    try {
      // Check if campus already exists
      const existingCampus = await this.prisma.campus.findUnique({
        where: { name: createDto.name },
      });

      if (existingCampus) {
        throw new ConflictException('Campus with this name already exists');
      }

      const campus = await this.prisma.campus.create({
        data: {
          name: createDto.name,
          address: createDto.address,
          foto: createDto.foto,
        },
        select: {
          id: true,
          name: true,
          address: true,
          foto: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      this.logger.log(
        `Campus created successfully with ID: ${campus.id}`,
        'CAMPUS_SERVICE',
      );

      return {
        ...campus,
        id: campus.id.toString(),
      } as CampusResponseDto;
    } catch (error) {
      this.logger.error(
        'Failed to create campus',
        error.stack,
        'CAMPUS_SERVICE',
      );
      throw error;
    }
  }

  async findAll(): Promise<CampusResponseDto[]> {
    this.logger.log('Fetching all campuses', 'CAMPUS_SERVICE');

    try {
      const campuses = await this.prisma.campus.findMany({
        select: {
          id: true,
          name: true,
          address: true,
          foto: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      this.logger.log(
        `Retrieved ${campuses.length} campus records`,
        'CAMPUS_SERVICE',
      );

      return campuses.map((campus) => ({
        ...campus,
        id: campus.id.toString(),
      })) as CampusResponseDto[];
    } catch (error) {
      this.logger.error(
        'Failed to fetch campuses',
        error.stack,
        'CAMPUS_SERVICE',
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<CampusResponseDto> {
    this.logger.log('Fetching campus by ID', 'CAMPUS_SERVICE', { id });

    try {
      const campus = await this.prisma.campus.findUnique({
        where: { id: BigInt(id) },
        select: {
          id: true,
          name: true,
          address: true,
          foto: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!campus) {
        throw new NotFoundException('Campus not found');
      }

      this.logger.log(
        `Campus found with ID: ${campus.id}`,
        'CAMPUS_SERVICE',
      );

      return {
        ...campus,
        id: campus.id.toString(),
      } as CampusResponseDto;
    } catch (error) {
      this.logger.error(
        'Failed to fetch campus',
        error.stack,
        'CAMPUS_SERVICE',
      );
      throw error;
    }
  }

  async update(id: string, updateDto: UpdateCampusDto): Promise<CampusResponseDto> {
    this.logger.log('Updating campus', 'CAMPUS_SERVICE', { id });

    try {
      // Check if campus exists
      const existingCampus = await this.prisma.campus.findUnique({
        where: { id: BigInt(id) },
      });

      if (!existingCampus) {
        throw new NotFoundException('Campus not found');
      }

      // Check if new name already exists (if name is being updated)
      if (updateDto.name && updateDto.name !== existingCampus.name) {
        const nameExists = await this.prisma.campus.findUnique({
          where: { name: updateDto.name },
        });

        if (nameExists) {
          throw new ConflictException('Campus with this name already exists');
        }
      }

      const updatedCampus = await this.prisma.campus.update({
        where: { id: BigInt(id) },
        data: {
          name: updateDto.name,
          address: updateDto.address,
          foto: updateDto.foto,
        },
        select: {
          id: true,
          name: true,
          address: true,
          foto: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      this.logger.log(
        `Campus updated successfully with ID: ${updatedCampus.id}`,
        'CAMPUS_SERVICE',
      );

      return {
        ...updatedCampus,
        id: updatedCampus.id.toString(),
      } as CampusResponseDto;
    } catch (error) {
      this.logger.error(
        'Failed to update campus',
        error.stack,
        'CAMPUS_SERVICE',
      );
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    this.logger.log('Deleting campus', 'CAMPUS_SERVICE', { id });

    try {
      // Check if campus exists
      const existingCampus = await this.prisma.campus.findUnique({
        where: { id: BigInt(id) },
        include: {
          fakultas: {
            include: {
              jurusan: {
                include: {
                  mahasiswa: true,
                },
              },
            },
          },
        },
      });

      if (!existingCampus) {
        throw new NotFoundException('Campus not found');
      }

      // Check if campus has associated data
      const hasFakultas = existingCampus.fakultas.length > 0;
      if (hasFakultas) {
        throw new ConflictException(
          'Cannot delete campus that has associated faculties. Please delete all faculties first.',
        );
      }

      await this.prisma.campus.delete({
        where: { id: BigInt(id) },
      });

      this.logger.log(
        `Campus deleted successfully with ID: ${id}`,
        'CAMPUS_SERVICE',
      );
    } catch (error) {
      this.logger.error(
        'Failed to delete campus',
        error.stack,
        'CAMPUS_SERVICE',
      );
      throw error;
    }
  }
}
