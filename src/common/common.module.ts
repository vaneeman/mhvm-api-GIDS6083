import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { UtilService } from './services/util.service';

@Global()
@Module({
  providers: [PrismaService, UtilService],
  exports: [PrismaService, UtilService],
})
export class CommonModule {}
