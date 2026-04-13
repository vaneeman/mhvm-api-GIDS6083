import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { mysqlProvider } from 'src/common/providers/mysql.provider';

@Module({
  controllers: [TaskController],
  providers: [TaskService, mysqlProvider],
})
export class TaskModule {}
