// auth.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // async register(dto: RegisterDto) {
  //     const hashedPassword = await bcrypt.hash(dto.password, 10);
  //     const user = await this.prisma.user.create({
  //         data: {
  //             name: dto.name,
  //             email: dto.email,
  //             password: hashedPassword,
  //             role: dto.role || 'USER',
  //         },
  //     });

  //     return { id: user.id };
  // }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(user: { id: string; email: string; role: string }) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });
    return { accessToken };
  }

  async me(user: any) {
    const profile = await this.prisma.user.findUnique({
      where: { id: user.userId, isDeleted: false },
    });

    if (!profile) {
      throw new NotFoundException('User does not exists');
    }

    return profile;
  }
}
