import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LogsModule } from 'src/modules/logs/interface/logs.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule, LogsModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}