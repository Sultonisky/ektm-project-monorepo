import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../core/auth.service';
import { LoginMahasiswaDto } from './dtos/login-mahasiswa.dto';
import { LoginAdminDto } from './dtos/login-admin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/mahasiswa')
  async loginMahasiswa(@Body() dto: LoginMahasiswaDto) {
    return this.authService.loginMahasiswa(dto.nim, dto.password);
  }

  @Post('login/admin')
  async loginAdmin(@Body() dto: LoginAdminDto) {
    return this.authService.loginAdmin(dto.email, dto.password);
  }
}