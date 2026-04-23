import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { UtilService } from 'src/common/services/util.service';
import { AuthGuard } from 'src/common/guards/auth.guards';
import { LogsService } from 'src/modules/logs/interface/logs.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authSvc: AuthService,
    private readonly utilSvc: UtilService,
    private readonly logsSvc: LogsService,
  ) {}

  private async generateTokens(user: { id: number; name: string; lastName: string; role?: string }) {
    const basePayload = { sub: user.id, name: user.name, lastName: user.lastName, role: user.role ?? 'USER' };
    const refresh_token_jwt = await this.utilSvc.generateJWT(basePayload, '7d');
    const hashRT = await this.utilSvc.hash(refresh_token_jwt);
    await this.authSvc.updateHash(user.id, hashRT);
    const access_token = await this.utilSvc.generateJWT({ ...basePayload, hash: hashRT }, '1h');
    return { access_token, refresh_token: hashRT };
  }

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  public async register(@Body() createUserDto: CreateUserDto, @Req() req: any) {
    const { name, lastName, username, password } = createUserDto;
    const hashedPassword = await this.utilSvc.hashPassword(password);
    const user = await this.authSvc.register(name, lastName, username, hashedPassword);

    // ✅ Log de registro exitoso
    await this.logsSvc.createLog({
      statusCode: 201,
      path: req.url,
      errorCode: 'REGISTER_SUCCESS',
      session_id: user.id,
    });

    return this.generateTokens(user);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() loginDto: LoginDto, @Req() req: any): Promise<any> {
    const { username, password } = loginDto;
    const user = await this.authSvc.getUserByUsername(username);

    // ✅ Log de login fallido por usuario no encontrado
    if (!user) {
      await this.logsSvc.createLog({
        statusCode: 401,
        path: req.url,
        errorCode: 'LOGIN_FAILED_USER_NOT_FOUND',
      });
      throw new UnauthorizedException('El usuario y/o contraseña es incorrecto');
    }

    // ✅ Log de login fallido por contraseña incorrecta
    if (!(await this.utilSvc.checkPassword(password, user.password))) {
      await this.logsSvc.createLog({
        statusCode: 401,
        path: req.url,
        errorCode: 'LOGIN_FAILED_WRONG_PASSWORD',
        session_id: user.id,
      });
      throw new UnauthorizedException('El usuario y/o contraseña son incorrectos');
    }

    // ✅ Log de login exitoso
    await this.logsSvc.createLog({
      statusCode: 200,
      path: req.url,
      errorCode: 'LOGIN_SUCCESS',
      session_id: user.id,
    });

    return this.generateTokens(user);
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  public getProfile(@Req() req: any) {
    return req['user'];
  }

  @Post('/refresh')
  @UseGuards(AuthGuard)
  public async refreshToken(@Req() req: any) {
    const sessionUser = req['user'];
    const user = await this.authSvc.getUserById(sessionUser.sub);
    if (!user || !user.hash) throw new ForbiddenException('Acceso denegado');
    if (sessionUser.hash !== user.hash) throw new ForbiddenException('Token inválido');
    return this.generateTokens(user);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  public async logout(@Req() req: any) {
    // ✅ Log de logout
    await this.logsSvc.createLog({
      statusCode: 200,
      path: req.url,
      errorCode: 'LOGOUT',
      session_id: req['user'].sub,
    });
    await this.authSvc.updateHash(req['user'].sub, null);
  }

  @Post('/reset-password')
  @HttpCode(HttpStatus.OK)
  public async resetPassword(
    @Body('username') username: string,
    @Body('newPassword') newPassword: string,
    @Req() req: any,
  ) {
    const user = await this.authSvc.getUserByUsername(username);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');
    const hashed = await this.utilSvc.hashPassword(newPassword);
    await this.authSvc.updatePassword(user.id, hashed);

    
    await this.logsSvc.createLog({
      statusCode: 200,
      path: req.url,
      errorCode: 'PASSWORD_RESET',
      session_id: user.id,
    });

    return { message: 'Contraseña actualizada correctamente' };
  }
}