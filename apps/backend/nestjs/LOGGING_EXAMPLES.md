import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { AppLogger, LogContext } from '../../../common/logger/logger.service';

@Injectable()
export class ExampleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLogger,
  ) {}

  // Contoh penggunaan logging untuk operasi CREATE
  async createUser(userData: CreateUserDto): Promise<UserResponseDto> {
    this.logger.businessLog(
      'CREATE_USER',
      `Creating user with email: ${userData.email}`,
      'USER_SERVICE',
      {
        operation: 'CREATE_USER',
        module: 'USER_SERVICE',
        email: userData.email,
        requestId: this.getRequestId(),
      }
    );

    try {
      // Validasi input
      await this.validateUserInput(userData);

      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        this.logger.warn(
          `User already exists with email: ${userData.email}`,
          'USER_SERVICE',
          {
            operation: 'CREATE_USER',
            module: 'USER_SERVICE',
            errorCode: 'USER_ALREADY_EXISTS',
            email: userData.email,
            existingUserId: existingUser.id,
          }
        );
        throw new BadRequestException('User already exists');
      }

      // Create user
      const user = await this.prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          password: await this.hashPassword(userData.password),
        },
      });

      this.logger.success(
        `User created successfully with ID: ${user.id}`,
        'USER_SERVICE',
        {
          operation: 'CREATE_USER',
          module: 'USER_SERVICE',
          userId: user.id,
          email: user.email,
          name: user.name,
        }
      );

      return this.mapUserToResponse(user);
    } catch (error) {
      this.logger.error(
        `Failed to create user with email: ${userData.email}`,
        error.stack,
        'USER_SERVICE',
        {
          operation: 'CREATE_USER',
          module: 'USER_SERVICE',
          errorCode: error.code || 'CREATE_USER_ERROR',
          email: userData.email,
          errorName: error.name,
          errorMessage: error.message,
        }
      );
      throw error;
    }
  }

  // Contoh penggunaan logging untuk operasi READ
  async getUserById(id: string): Promise<UserResponseDto> {
    this.logger.businessLog(
      'GET_USER',
      `Fetching user with ID: ${id}`,
      'USER_SERVICE',
      {
        operation: 'GET_USER',
        module: 'USER_SERVICE',
        userId: id,
      }
    );

    try {
      const user = await this.prisma.user.findUnique({
        where: { id: BigInt(id) },
      });

      if (!user) {
        this.logger.warn(
          `User not found with ID: ${id}`,
          'USER_SERVICE',
          {
            operation: 'GET_USER',
            module: 'USER_SERVICE',
            errorCode: 'USER_NOT_FOUND',
            userId: id,
          }
        );
        throw new NotFoundException('User not found');
      }

      this.logger.log(
        `User retrieved successfully: ${user.email}`,
        'USER_SERVICE',
        {
          operation: 'GET_USER',
          module: 'USER_SERVICE',
          userId: user.id,
          email: user.email,
        }
      );

      return this.mapUserToResponse(user);
    } catch (error) {
      this.logger.error(
        `Failed to get user with ID: ${id}`,
        error.stack,
        'USER_SERVICE',
        {
          operation: 'GET_USER',
          module: 'USER_SERVICE',
          errorCode: error.code || 'GET_USER_ERROR',
          userId: id,
          errorName: error.name,
          errorMessage: error.message,
        }
      );
      throw error;
    }
  }

  // Contoh penggunaan logging untuk operasi UPDATE
  async updateUser(id: string, updateData: UpdateUserDto): Promise<UserResponseDto> {
    this.logger.businessLog(
      'UPDATE_USER',
      `Updating user with ID: ${id}`,
      'USER_SERVICE',
      {
        operation: 'UPDATE_USER',
        module: 'USER_SERVICE',
        userId: id,
        updateFields: Object.keys(updateData),
      }
    );

    try {
      // Check if user exists
      const existingUser = await this.prisma.user.findUnique({
        where: { id: BigInt(id) },
      });

      if (!existingUser) {
        this.logger.warn(
          `User not found for update with ID: ${id}`,
          'USER_SERVICE',
          {
            operation: 'UPDATE_USER',
            module: 'USER_SERVICE',
            errorCode: 'USER_NOT_FOUND',
            userId: id,
          }
        );
        throw new NotFoundException('User not found');
      }

      // Validate update data
      await this.validateUpdateData(updateData);

      const updatedUser = await this.prisma.user.update({
        where: { id: BigInt(id) },
        data: {
          ...updateData,
          updatedAt: new Date(),
        },
      });

      this.logger.success(
        `User updated successfully: ${updatedUser.email}`,
        'USER_SERVICE',
        {
          operation: 'UPDATE_USER',
          module: 'USER_SERVICE',
          userId: updatedUser.id,
          email: updatedUser.email,
          updatedFields: Object.keys(updateData),
        }
      );

      return this.mapUserToResponse(updatedUser);
    } catch (error) {
      this.logger.error(
        `Failed to update user with ID: ${id}`,
        error.stack,
        'USER_SERVICE',
        {
          operation: 'UPDATE_USER',
          module: 'USER_SERVICE',
          errorCode: error.code || 'UPDATE_USER_ERROR',
          userId: id,
          errorName: error.name,
          errorMessage: error.message,
        }
      );
      throw error;
    }
  }

  // Contoh penggunaan logging untuk operasi DELETE
  async deleteUser(id: string): Promise<void> {
    this.logger.businessLog(
      'DELETE_USER',
      `Deleting user with ID: ${id}`,
      'USER_SERVICE',
      {
        operation: 'DELETE_USER',
        module: 'USER_SERVICE',
        userId: id,
      }
    );

    try {
      // Check if user exists
      const existingUser = await this.prisma.user.findUnique({
        where: { id: BigInt(id) },
      });

      if (!existingUser) {
        this.logger.warn(
          `User not found for deletion with ID: ${id}`,
          'USER_SERVICE',
          {
            operation: 'DELETE_USER',
            module: 'USER_SERVICE',
            errorCode: 'USER_NOT_FOUND',
            userId: id,
          }
        );
        throw new NotFoundException('User not found');
      }

      await this.prisma.user.delete({
        where: { id: BigInt(id) },
      });

      this.logger.success(
        `User deleted successfully: ${existingUser.email}`,
        'USER_SERVICE',
        {
          operation: 'DELETE_USER',
          module: 'USER_SERVICE',
          userId: id,
          email: existingUser.email,
        }
      );
    } catch (error) {
      this.logger.error(
        `Failed to delete user with ID: ${id}`,
        error.stack,
        'USER_SERVICE',
        {
          operation: 'DELETE_USER',
          module: 'USER_SERVICE',
          errorCode: error.code || 'DELETE_USER_ERROR',
          userId: id,
          errorName: error.name,
          errorMessage: error.message,
        }
      );
      throw error;
    }
  }

  // Contoh penggunaan logging untuk authentication
  async authenticateUser(credentials: LoginDto): Promise<AuthResponseDto> {
    this.logger.authLog(
      'LOGIN_ATTEMPT',
      `Login attempt for email: ${credentials.email}`,
      undefined,
      'AUTH_SERVICE',
      {
        operation: 'USER_LOGIN',
        module: 'AUTH_SERVICE',
        email: credentials.email,
      }
    );

    try {
      const user = await this.prisma.user.findUnique({
        where: { email: credentials.email },
      });

      if (!user) {
        this.logger.authLog(
          'LOGIN_FAILED',
          `Login failed - user not found: ${credentials.email}`,
          undefined,
          'AUTH_SERVICE',
          {
            operation: 'USER_LOGIN',
            module: 'AUTH_SERVICE',
            errorCode: 'USER_NOT_FOUND',
            email: credentials.email,
          }
        );
        throw new BadRequestException('Invalid credentials');
      }

      const isPasswordValid = await this.comparePassword(
        credentials.password,
        user.password
      );

      if (!isPasswordValid) {
        this.logger.authLog(
          'LOGIN_FAILED',
          `Login failed - invalid password for: ${credentials.email}`,
          user.id,
          'AUTH_SERVICE',
          {
            operation: 'USER_LOGIN',
            module: 'AUTH_SERVICE',
            errorCode: 'INVALID_PASSWORD',
            email: credentials.email,
            userId: user.id,
          }
        );
        throw new BadRequestException('Invalid credentials');
      }

      const token = await this.generateToken(user);

      this.logger.authLog(
        'LOGIN_SUCCESS',
        `User logged in successfully: ${user.email}`,
        user.id,
        'AUTH_SERVICE',
        {
          operation: 'USER_LOGIN',
          module: 'AUTH_SERVICE',
          userId: user.id,
          email: user.email,
        }
      );

      return {
        user: this.mapUserToResponse(user),
        token,
      };
    } catch (error) {
      this.logger.error(
        `Authentication failed for email: ${credentials.email}`,
        error.stack,
        'AUTH_SERVICE',
        {
          operation: 'USER_LOGIN',
          module: 'AUTH_SERVICE',
          errorCode: error.code || 'AUTH_ERROR',
          email: credentials.email,
          errorName: error.name,
          errorMessage: error.message,
        }
      );
      throw error;
    }
  }

  // Contoh penggunaan logging untuk external API calls
  async callExternalAPI(data: any): Promise<any> {
    const startTime = Date.now();
    
    this.logger.log(
      `Calling external API with data: ${JSON.stringify(data).substring(0, 100)}...`,
      'EXTERNAL_API_SERVICE',
      {
        operation: 'EXTERNAL_API_CALL',
        module: 'EXTERNAL_API_SERVICE',
        apiEndpoint: 'https://api.example.com/data',
      }
    );

    try {
      // Simulate external API call
      const response = await this.makeExternalAPICall(data);
      const responseTime = Date.now() - startTime;

      this.logger.externalApiLog(
        'POST',
        'https://api.example.com/data',
        200,
        responseTime,
        'ExampleAPI',
        'EXTERNAL_API_SERVICE',
        {
          operation: 'EXTERNAL_API_CALL',
          module: 'EXTERNAL_API_SERVICE',
          responseSize: JSON.stringify(response).length,
        }
      );

      return response;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      this.logger.externalApiLog(
        'POST',
        'https://api.example.com/data',
        error.status || 500,
        responseTime,
        'ExampleAPI',
        'EXTERNAL_API_SERVICE',
        {
          operation: 'EXTERNAL_API_CALL',
          module: 'EXTERNAL_API_SERVICE',
          errorCode: error.code || 'EXTERNAL_API_ERROR',
          errorMessage: error.message,
        }
      );

      throw error;
    }
  }

  // Contoh penggunaan logging untuk validation
  private async validateUserInput(userData: CreateUserDto): Promise<void> {
    const errors: string[] = [];

    if (!userData.email || !this.isValidEmail(userData.email)) {
      errors.push('Invalid email format');
    }

    if (!userData.password || userData.password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }

    if (!userData.name || userData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    }

    if (errors.length > 0) {
      this.logger.validationError(
        'User input validation failed',
        errors,
        'USER_SERVICE',
        {
          operation: 'VALIDATE_USER_INPUT',
          module: 'USER_SERVICE',
          inputKeys: Object.keys(userData),
          validationErrors: errors,
        }
      );
      throw new BadRequestException('Validation failed');
    }
  }

  // Contoh penggunaan logging untuk security events
  async handleSecurityEvent(event: string, details: any): Promise<void> {
    this.logger.securityLog(
      event,
      `Security event detected: ${event}`,
      'SECURITY_SERVICE',
      {
        operation: 'SECURITY_EVENT',
        module: 'SECURITY_SERVICE',
        securityEvent: event,
        eventDetails: details,
      }
    );
  }

  // Helper methods
  private async hashPassword(password: string): Promise<string> {
    // Implementation for password hashing
    return 'hashed_password';
  }

  private async comparePassword(password: string, hash: string): Promise<boolean> {
    // Implementation for password comparison
    return password === 'correct_password';
  }

  private async generateToken(user: any): Promise<string> {
    // Implementation for token generation
    return 'jwt_token';
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private mapUserToResponse(user: any): UserResponseDto {
    return {
      id: user.id.toString(),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private getRequestId(): string {
    // Get request ID from context or generate new one
    return 'req_' + Date.now();
  }

  private async makeExternalAPICall(data: any): Promise<any> {
    // Simulate external API call
    return { success: true, data };
  }

  private async validateUpdateData(updateData: UpdateUserDto): Promise<void> {
    // Implementation for update data validation
  }
}

// DTOs untuk contoh
interface CreateUserDto {
  email: string;
  password: string;
  name: string;
}

interface UpdateUserDto {
  email?: string;
  name?: string;
}

interface LoginDto {
  email: string;
  password: string;
}

interface UserResponseDto {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthResponseDto {
  user: UserResponseDto;
  token: string;
}
