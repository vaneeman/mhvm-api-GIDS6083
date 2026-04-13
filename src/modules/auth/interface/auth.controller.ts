import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authSvc: AuthService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  public async register(@Body() createUserDto: CreateUserDto) {
    const { name, lastName, username, password } = createUserDto;
    return await this.authSvc.register(name, lastName, username, password);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() loginDto: LoginDto) {
    const { username, password } = loginDto;
    return await this.authSvc.login(username, password);
  }

  @Get('/me')
  public getProfile() {}

  @Post('/refresh')
  public refreshToken() {}

  @Post('/logout')
  public logout() {}
}
