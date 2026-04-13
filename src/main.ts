import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Uso de pipes de forma global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en el DTO
    }),
  );

  //Configuracion de swagger
  const config = new DocumentBuilder()
    .setTitle('API con vulnerabilidades de seguridad')
    .setDescription('Documentacion de la API para pruebas.')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

//? MYSQL
//!npm i mysql2
//!npm i @types/mysql2 -D

//? POSTGRESQL
//!npm i pg
//!npm i @types/pg -D

//? Install SWAGGER
//! npm install @nestjs/swagger

//! git commit -a "fix: CRUD funcional con base de datos y configuracion de SWAGGER"

//! git commit -a "fix: Uso de prisma y correccion de CRUD (Task)"