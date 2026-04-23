import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { UtilService } from 'src/common/services/util.service';
import { AuthGuard } from 'src/common/guards/auth.guards';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { LogsService } from 'src/modules/logs/interface/logs.service';

@Controller('/api/user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private usersvc: UserService,
    private utilSvc: UtilService,
    private logsSvc: LogsService,
  ) {}

  @Get('')
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  async getAllUsers(): Promise<User[]> {
    return await this.usersvc.getAllUsers();
  }

  @Get(':id')
  public async listUserById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<User> {
    const sessionUser = req['user'];
    if (sessionUser.role !== 'ADMIN' && sessionUser.sub !== id)
      throw new ForbiddenException('No tienes permiso para ver este usuario');

    const result = await this.usersvc.getUserById(id);
    if (!result) throw new NotFoundException(`Usuario con id: ${id} no encontrado`);

    const { password, hash, ...safeUser } = result as any;
    return safeUser;
  }

  @Post('')
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  public async insertUser(@Body() user: CreateUserDto, @Req() req: any): Promise<User> {
    const encryptedPassword = await this.utilSvc.hashPassword(user.password);
    user.password = encryptedPassword;
    const result = await this.usersvc.InsertUser(user);
    if (!result) throw new HttpException('Error al insertar el usuario', HttpStatus.INTERNAL_SERVER_ERROR);
    const { password, hash, ...safeUser } = result as any;
    return safeUser;
  }

  @Put(':id')
  public async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userUpdate: UpdateUserDto,
    @Req() req: any,
  ): Promise<User> {
    const sessionUser = req['user'];
    if (sessionUser.role !== 'ADMIN' && sessionUser.sub !== id)
      throw new ForbiddenException('No tienes permiso para editar este usuario');

    // ✅ Log de cambio de rol
    if (userUpdate.role && sessionUser.role === 'ADMIN') {
      await this.logsSvc.createLog({
        statusCode: 200,
        path: req.url,
        errorCode: `ROLE_CHANGED_TO_${userUpdate.role}`,
        session_id: sessionUser.sub,
      });
    }

    if (userUpdate.password) {
      userUpdate.password = await this.utilSvc.hashPassword(userUpdate.password);
    }

    const result = await this.usersvc.updateUser(id, userUpdate);
    const { password, hash, ...safeUser } = result as any;
    return safeUser;
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  public async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<boolean> {
    if (req['user'].sub === id)
      throw new ForbiddenException('No puedes eliminar tu propio usuario');
    await this.usersvc.deleteUser(id);
    return true;
  }
}