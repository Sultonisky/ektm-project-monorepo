import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/core/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async loginMahasiswa(nim: number, password: string) {
    const mhs = await this.usersService.findMahasiswaByNim(nim);
    if (!mhs) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, mhs.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    // Convert BigInt to string
    const payload = { 
      sub: mhs.id.toString(), 
      role: 'mahasiswa', 
      nim: mhs.nim, 
      name: mhs.name 
    };
    const accessToken = await this.jwtService.signAsync(payload);
    
    return { 
      access_token: accessToken, 
      user: { 
        id: mhs.id.toString(), // Convert BigInt to string
        nim: mhs.nim, 
        name: mhs.name, 
        role: 'mahasiswa' 
      } 
    };
  }

  async loginAdmin(email: string, password: string) {
    const admin = await this.usersService.findAdminByEmail(email);
    if (!admin) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    // Convert BigInt to string
    const payload = { 
      sub: admin.id.toString(), 
      role: 'admin', 
      email: admin.email, 
      name: admin.name 
    };
    const accessToken = await this.jwtService.signAsync(payload);
    
    return { 
      access_token: accessToken, 
      user: { 
        id: admin.id.toString(), // Convert BigInt to string
        email: admin.email, 
        name: admin.name, 
        role: 'admin' 
      } 
    };
  }
}