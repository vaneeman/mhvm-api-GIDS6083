import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, Matches, IsEnum } from 'class-validator';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(300)
  lastName!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  username!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(50, { message: 'La contraseña no debe superar 50 caracteres' })
  @Matches(/(?=.*[A-Z])/, { message: 'La contraseña debe tener al menos una letra mayúscula' })
  @Matches(/(?=.*[0-9])/, { message: 'La contraseña debe tener al menos un número' })
  @Matches(/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, { message: 'La contraseña debe tener al menos un carácter especial' })
  password!: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(300)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  username?: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(50, { message: 'La contraseña no debe superar 50 caracteres' })
  @Matches(/(?=.*[A-Z])/, { message: 'La contraseña debe tener al menos una letra mayúscula' })
  @Matches(/(?=.*[0-9])/, { message: 'La contraseña debe tener al menos un número' })
  @Matches(/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, { message: 'La contraseña debe tener al menos un carácter especial' })
  password?: string;

  @IsOptional()
  @IsEnum(Role, { message: 'El rol debe ser USER o ADMIN' })
  role?: Role;
}