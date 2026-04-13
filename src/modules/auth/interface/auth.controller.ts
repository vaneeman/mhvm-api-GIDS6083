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

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authSvc: AuthService,
    private readonly utilSvc: UtilService,
  ) {}

  private async generateTokens(user: { id: number; name: string; lastName: string }) {
    const basePayload = { sub: user.id, name: user.name, lastName: user.lastName };
    const refresh_token_jwt = await this.utilSvc.generateJWT(basePayload, '7d');
    const hashRT = await this.utilSvc.hash(refresh_token_jwt);
    await this.authSvc.updateHash(user.id, hashRT);

    const access_token = await this.utilSvc.generateJWT({ ...basePayload, hash: hashRT }, '1h');
    return { access_token, refresh_token: hashRT };
  }

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  public async register(@Body() createUserDto: CreateUserDto) {
    const { name, lastName, username, password } = createUserDto;
    const hashedPassword = await this.utilSvc.hashPassword(password);
    const user = await this.authSvc.register(name, lastName, username, hashedPassword);
    return this.generateTokens(user);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() loginDto: LoginDto): Promise<any> {
    const { username, password } = loginDto;

    const user = await this.authSvc.getUserByUsername(username);
    if (!user) throw new UnauthorizedException('El usuario y/o contraseña es incorrecto');

    if (!(await this.utilSvc.checkPassword(password, user.password)))
      throw new UnauthorizedException('El usuario y/o contraseña son incorrectos');

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
    await this.authSvc.updateHash(req['user'].sub, null);
  }
}
