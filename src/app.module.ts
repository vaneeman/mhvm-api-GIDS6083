import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/interface/auth.module';
import { TaskModule } from './modules/task/interface/task.module';
import { UserModule } from './modules/user/interface/user.module';
import { LogsModule } from './modules/logs/interface/logs.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), CommonModule, AuthModule, TaskModule, UserModule, LogsModule],
})
export class AppModule {}