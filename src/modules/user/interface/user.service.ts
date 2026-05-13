import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dto/create-user.dto';
import { PrismaService } from 'src/common/services/prisma.service';

@Injectable()
export class UserService {
  constructor(
    @Inject('MYSQL_CONNECTION') private mysql: any,
    // @Inject('PG_CONNECTION') private pg: any,
    private prisma: PrismaService,
  ) {}

  public async getAllUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      orderBy: [{ name: 'asc' }],
      select: {
        id: true,
        name: true,
        lastName: true,
        username: true,
        password: false,
        createdAt: true,
      },
    });
    return users as User[];
  }

  public async getUserById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user;
  }

  public async getUserByUsername(username: string): Promise<{ id: number } | null> {
  return await this.prisma.user.findFirst({
    where: { username },
    select: { id: true },
  });
}

  public async InsertUser(user: CreateUserDto): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: user,
    });
    return newUser;
  }

  public async updateUser(
    id: number,
    userUpdate: UpdateUserDto,
  ): Promise<User> {
    const userUpdated = await this.prisma.user.update({
      where: { id },
      data: userUpdate,
    });
    return userUpdated;
  }

  public async deleteUser(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { task: true },
    });

    if (user?.task && user.task.length > 0) {
      throw new HttpException(
        `No se puede eliminar el usuario porque tiene ${user.task.length} tarea(s) relacionada(s)`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const userDeleted = await this.prisma.user.delete({
      where: { id },
    });
    return userDeleted;
  }
}
