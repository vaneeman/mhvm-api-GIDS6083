import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma/browser';
import { PrismaService } from 'src/common/services/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  public async getUserByUsername(username: string): Promise<User | null> {
    return await this.prisma.user.findFirst({ where: { username } });
  }

  public async getUserById(id: number): Promise<User | null> {
    return await this.prisma.user.findFirst({ where: { id } });
  }

  public async updateHash(userId: number, hash: string | null): Promise<User> {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { hash },
    });
  }

  public async updatePassword(userId: number, hashedPassword: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword, hash: null },
    });
  }

  async register(name: string, lastName: string, username: string, hashedPassword: string): Promise<User> {
    return await this.prisma.user.create({
      data: { name, lastName, username, password: hashedPassword },
    });
  }
}
