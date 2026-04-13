import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { publicDecrypt } from 'crypto';
import { LoginDto } from '../dto/login.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authSvc: AuthService) {}

  //POST /auth/register - 201 created

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  public login(@Body() loginDto: LoginDto) {
    const { username, password } = loginDto;

    //TODO: Verificar el usuario y contraseña

    //TODO: Obtener la informacion del usuario (payload)

    //TODO: Generar el token JWT

    //TODO: Devolver el JWT enciptado

    return this.authSvc.login();
  }

  @Get('/me')
  public getProfile() {}

  @Post('/refresh')
  public refreshToken() {}

  @Post('/logout')
  public logout() {}
}
