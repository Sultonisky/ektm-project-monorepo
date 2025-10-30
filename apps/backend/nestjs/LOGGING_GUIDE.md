# Enhanced Logging System untuk NestJS

Sistem logging yang telah ditingkatkan memberikan kemampuan tracking yang lebih detail untuk aplikasi NestJS Anda.

## Fitur Utama

### 1. Logger Service yang Ditingkatkan (`AppLogger`)

#### Method Logging Baru:
- `success()` - Untuk operasi yang berhasil dengan emoji ✅
- `businessLog()` - Untuk business logic operations dengan emoji 🔧
- `securityLog()` - Untuk security events dengan emoji 🔒
- `validationError()` - Untuk validation errors dengan emoji ⚠️
- `authLog()` - Untuk authentication events dengan emoji 🔒
- `externalApiLog()` - Untuk external API calls dengan emoji 🌐

#### Enhanced Methods:
- `httpLog()` - HTTP requests dengan level otomatis berdasarkan status code
- `dbLog()` - Database operations dengan deteksi slow queries
- `error()` - Error logging dengan error code dan context yang lebih detail

### 2. Interceptors untuk Logging Otomatis

#### `LoggingInterceptor`
- Menangkap semua HTTP requests dan responses
- Generate unique request ID untuk tracking
- Log incoming requests, responses, dan errors
- Include user information, IP, user agent, dll.

#### `ErrorLoggingInterceptor`
- Menganalisis error berdasarkan severity (critical, high, medium, low)
- Automatic error code generation
- Detailed error context logging

#### `SuccessLoggingInterceptor`
- Menganalisis operasi berdasarkan HTTP method dan URL
- Log success operations dengan context yang relevan
- Performance monitoring untuk slow responses

### 3. Prisma Logger yang Ditingkatkan
- Deteksi slow queries (>1000ms)
- Detailed query logging dengan sanitized results
- Error handling untuk database operations

## Cara Penggunaan

### 1. Setup di App Module

```typescript
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CommonModule } from './common/common.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ErrorLoggingInterceptor } from './common/interceptors/error-logging.interceptor';
import { SuccessLoggingInterceptor } from './common/interceptors/success-logging.interceptor';

@Module({
  imports: [CommonModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorLoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SuccessLoggingInterceptor,
    },
  ],
})
export class AppModule {}
```

### 2. Penggunaan di Service

```typescript
import { Injectable } from '@nestjs/common';
import { AppLogger, LogContext } from '../common/logger/logger.service';

@Injectable()
export class YourService {
  constructor(private readonly logger: AppLogger) {}

  async createUser(userData: any) {
    // Business operation logging
    this.logger.businessLog(
      'CREATE_USER',
      `Creating user with email: ${userData.email}`,
      'USER_SERVICE',
      {
        operation: 'CREATE_USER',
        module: 'USER_SERVICE',
        email: userData.email,
      }
    );

    try {
      // Your business logic here
      const user = await this.createUserInDatabase(userData);

      // Success logging
      this.logger.success(
        `User created successfully with ID: ${user.id}`,
        'USER_SERVICE',
        {
          operation: 'CREATE_USER',
          module: 'USER_SERVICE',
          userId: user.id,
          email: user.email,
        }
      );

      return user;
    } catch (error) {
      // Error logging dengan context yang detail
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

  async validateUserInput(input: any) {
    const errors = this.validateInput(input);
    
    if (errors.length > 0) {
      this.logger.validationError(
        'User input validation failed',
        errors,
        'USER_SERVICE',
        {
          operation: 'VALIDATE_USER_INPUT',
          module: 'USER_SERVICE',
          inputKeys: Object.keys(input),
        }
      );
      throw new BadRequestException('Validation failed');
    }
  }

  async authenticateUser(credentials: any) {
    try {
      const user = await this.validateCredentials(credentials);
      
      this.logger.authLog(
        'LOGIN_SUCCESS',
        `User ${user.email} logged in successfully`,
        user.id,
        'AUTH_SERVICE',
        {
          operation: 'USER_LOGIN',
          module: 'AUTH_SERVICE',
          userId: user.id,
          email: user.email,
        }
      );
      
      return user;
    } catch (error) {
      this.logger.authLog(
        'LOGIN_FAILED',
        `Login failed for email: ${credentials.email}`,
        undefined,
        'AUTH_SERVICE',
        {
          operation: 'USER_LOGIN',
          module: 'AUTH_SERVICE',
          errorCode: 'LOGIN_FAILED',
          email: credentials.email,
        }
      );
      throw error;
    }
  }
}
```

### 3. Log Format dan Output

#### Console Output:
```
2024-01-15 10:30:45 [INFO] [HTTP]: 📥 INCOMING REQUEST: POST /api/users | requestId=abc123, userId=user456, method=POST, url=/api/users, ip=192.168.1.1, userAgent=Mozilla/5.0...
2024-01-15 10:30:45 [INFO] [USER_SERVICE]: 🔧 BUSINESS: CREATE_USER - Creating user with email: user@example.com | operation=CREATE_USER, module=USER_SERVICE, email=user@example.com
2024-01-15 10:30:46 [INFO] [USER_SERVICE]: ✅ SUCCESS: User created successfully with ID: 789 | operation=CREATE_USER, module=USER_SERVICE, userId=789, email=user@example.com
2024-01-15 10:30:46 [INFO] [HTTP]: ✅ HTTP POST /api/users | method=POST, url=/api/users, statusCode=201, responseTime=1200ms, requestId=abc123, userId=user456
```

#### File Output (JSON format):
```json
{
  "timestamp": "2024-01-15 10:30:45",
  "level": "info",
  "message": "✅ SUCCESS: User created successfully with ID: 789",
  "context": "USER_SERVICE",
  "operation": "CREATE_USER",
  "module": "USER_SERVICE",
  "userId": "789",
  "email": "user@example.com",
  "requestId": "abc123"
}
```

## Log Levels dan Severity

### Log Levels:
- `error` - Errors dan exceptions
- `warn` - Warnings dan slow operations
- `info` - General information dan success operations
- `debug` - Detailed debugging information
- `verbose` - Very detailed information

### Error Severity:
- `critical` - System-breaking errors (TypeError, ReferenceError)
- `high` - Database errors, network errors, HTTP 5xx
- `medium` - Validation errors, HTTP 4xx
- `low` - Minor issues dan warnings

## File Logging

Logs disimpan dalam:
- `logs/application-YYYY-MM-DD.log` - Semua logs
- `logs/error-YYYY-MM-DD.log` - Error logs saja

Files di-rotate harian dengan kompresi dan retention policy:
- Application logs: 14 hari
- Error logs: 30 hari
- Max size: 20MB per file

## Environment Variables

```bash
LOG_LEVEL=info  # debug, info, warn, error
```

## Tracking dan Monitoring

Setiap request mendapat unique `requestId` yang dapat digunakan untuk:
- Tracking request flow across services
- Debugging issues
- Performance monitoring
- User activity tracking

Request ID juga dikirim sebagai header `X-Request-ID` untuk client-side tracking.
