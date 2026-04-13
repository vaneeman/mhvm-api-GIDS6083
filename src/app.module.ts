import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/interface/auth.module';
import { TaskModule } from './modules/task/interface/task.module';

@Module({
  imports: [AuthModule, TaskModule],
})
export class AppModule {}
