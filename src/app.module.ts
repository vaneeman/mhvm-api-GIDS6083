import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/interface/auth.module';
import { TaskModule } from './modules/task/interface/task.module';
import { UserModule } from './modules/user/interface/user.module';
import { UtilService } from './common/services/util.service';

@Module({
  imports: [AuthModule, TaskModule, UserModule],
  providers: [UtilService],
})
export class AppModule {}
