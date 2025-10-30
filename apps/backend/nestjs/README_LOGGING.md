# Enhanced Logging System untuk NestJS Backend

Sistem logging yang telah ditingkatkan memberikan kemampuan tracking yang lebih detail dan mudah dipahami untuk aplikasi NestJS Anda.

## 🚀 Fitur Utama

### ✅ Logging yang Lebih Jelas
- **Emoji indicators** untuk mudah identifikasi jenis log
- **Structured logging** dengan metadata yang detail
- **Request tracking** dengan unique request ID
- **Performance monitoring** untuk slow operations
- **Error severity analysis** (critical, high, medium, low)

### 🔧 Method Logging Baru
- `success()` - Operasi berhasil dengan ✅
- `businessLog()` - Business logic dengan 🔧
- `securityLog()` - Security events dengan 🔒
- `validationError()` - Validation errors dengan ⚠️
- `authLog()` - Authentication events dengan 🔒
- `externalApiLog()` - External API calls dengan 🌐

### 📊 Automatic Interceptors
- **LoggingInterceptor** - HTTP request/response tracking
- **ErrorLoggingInterceptor** - Error analysis dan severity detection
- **SuccessLoggingInterceptor** - Success operation tracking

## 📁 File Structure

```
nestjs/
├── common/
│   ├── logger/
│   │   └── logger.service.ts          # Enhanced logger service
│   ├── interceptors/
│   │   ├── logging.interceptor.ts      # HTTP request/response logging
│   │   ├── error-logging.interceptor.ts # Error analysis logging
│   │   └── success-logging.interceptor.ts # Success operation logging
│   ├── prisma/
│   │   └── prisma.logger.ts           # Enhanced Prisma logging
│   └── common.module.ts               # Global module exports
├── LOGGING_GUIDE.md                   # Detailed usage guide
├── LOGGING_EXAMPLES.md                # Code examples
└── package.json                       # Updated with uuid dependency
```

## 🛠️ Setup dan Installation

### 1. Install Dependencies
```bash
cd nestjs
npm install uuid @types/uuid
```

### 2. Update App Module
```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CommonModule } from '../common/common.module';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { ErrorLoggingInterceptor } from '../common/interceptors/error-logging.interceptor';
import { SuccessLoggingInterceptor } from '../common/interceptors/success-logging.interceptor';

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

## 📝 Cara Penggunaan

### 1. Basic Logging di Service

```typescript
import { Injectable } from '@nestjs/common';
import { AppLogger } from '../common/logger/logger.service';

@Injectable()
export class YourService {
  constructor(private readonly logger: AppLogger) {}

  async createSomething(data: any) {
    // Business operation logging
    this.logger.businessLog(
      'CREATE_SOMETHING',
      `Creating something with data: ${JSON.stringify(data)}`,
      'YOUR_SERVICE',
      {
        operation: 'CREATE_SOMETHING',
        module: 'YOUR_SERVICE',
        dataKeys: Object.keys(data),
      }
    );

    try {
      // Your business logic here
      const result = await this.performOperation(data);

      // Success logging
      this.logger.success(
        `Something created successfully with ID: ${result.id}`,
        'YOUR_SERVICE',
        {
          operation: 'CREATE_SOMETHING',
          module: 'YOUR_SERVICE',
          resultId: result.id,
        }
      );

      return result;
    } catch (error) {
      // Error logging dengan context detail
      this.logger.error(
        `Failed to create something`,
        error.stack,
        'YOUR_SERVICE',
        {
          operation: 'CREATE_SOMETHING',
          module: 'YOUR_SERVICE',
          errorCode: error.code || 'CREATE_ERROR',
          errorName: error.name,
          errorMessage: error.message,
        }
      );
      throw error;
    }
  }
}
```

### 2. Authentication Logging

```typescript
async login(credentials: LoginDto) {
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
    const user = await this.validateUser(credentials);
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

    return { user, token };
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
```

### 3. Validation Error Logging

```typescript
private validateInput(data: any): void {
  const errors: string[] = [];

  if (!data.email) errors.push('Email is required');
  if (!data.password) errors.push('Password is required');

  if (errors.length > 0) {
    this.logger.validationError(
      'Input validation failed',
      errors,
      'YOUR_SERVICE',
      {
        operation: 'VALIDATE_INPUT',
        module: 'YOUR_SERVICE',
        inputKeys: Object.keys(data),
        validationErrors: errors,
      }
    );
    throw new BadRequestException('Validation failed');
  }
}
```

### 4. External API Logging

```typescript
async callExternalAPI(data: any) {
  const startTime = Date.now();
  
  try {
    const response = await this.makeAPICall(data);
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
      }
    );
    throw error;
  }
}
```

## 📊 Log Output Examples

### Console Output
```
2024-01-15 10:30:45 [INFO] [HTTP]: 📥 INCOMING REQUEST: POST /api/users | requestId=abc123, userId=user456, method=POST, url=/api/users, ip=192.168.1.1
2024-01-15 10:30:45 [INFO] [USER_SERVICE]: 🔧 BUSINESS: CREATE_USER - Creating user with email: user@example.com | operation=CREATE_USER, module=USER_SERVICE, email=user@example.com
2024-01-15 10:30:46 [INFO] [USER_SERVICE]: ✅ SUCCESS: User created successfully with ID: 789 | operation=CREATE_USER, module=USER_SERVICE, userId=789, email=user@example.com
2024-01-15 10:30:46 [INFO] [HTTP]: ✅ HTTP POST /api/users | method=POST, url=/api/users, statusCode=201, responseTime=1200ms, requestId=abc123, userId=user456
```

### File Output (JSON)
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

## 🔍 Log Levels dan Severity

### Log Levels
- `error` - Errors dan exceptions
- `warn` - Warnings dan slow operations  
- `info` - General information dan success operations
- `debug` - Detailed debugging information
- `verbose` - Very detailed information

### Error Severity
- `critical` - System-breaking errors (TypeError, ReferenceError)
- `high` - Database errors, network errors, HTTP 5xx
- `medium` - Validation errors, HTTP 4xx
- `low` - Minor issues dan warnings

## 📁 File Logging

Logs disimpan dalam:
- `logs/application-YYYY-MM-DD.log` - Semua logs
- `logs/error-YYYY-MM-DD.log` - Error logs saja

**Retention Policy:**
- Application logs: 14 hari
- Error logs: 30 hari
- Max size: 20MB per file
- Auto compression untuk file lama

## 🔧 Environment Variables

```bash
LOG_LEVEL=info  # debug, info, warn, error
```

## 🎯 Tracking dan Monitoring

### Request Tracking
Setiap request mendapat unique `requestId` untuk:
- Tracking request flow across services
- Debugging issues
- Performance monitoring
- User activity tracking

### Performance Monitoring
- Slow query detection (>1000ms)
- Slow response detection (>2000ms)
- Database operation timing
- External API call timing

### Security Monitoring
- Authentication events
- Failed login attempts
- Security violations
- Suspicious activities

## 📚 Dokumentasi Lengkap

- `LOGGING_GUIDE.md` - Panduan lengkap penggunaan
- `LOGGING_EXAMPLES.md` - Contoh kode lengkap
- File-file di `common/` folder untuk implementasi detail

## 🚀 Benefits

1. **Easy Debugging** - Request ID tracking untuk follow request flow
2. **Performance Monitoring** - Automatic slow operation detection
3. **Security Tracking** - Authentication dan security event logging
4. **Structured Data** - JSON format untuk easy parsing dan analysis
5. **Visual Indicators** - Emoji untuk quick log identification
6. **Error Analysis** - Automatic error severity classification
7. **Business Logic Tracking** - Clear operation logging
8. **External API Monitoring** - Third-party service call tracking

Sistem logging ini akan membuat debugging dan monitoring aplikasi Anda menjadi jauh lebih mudah dan efisien! 🎉
