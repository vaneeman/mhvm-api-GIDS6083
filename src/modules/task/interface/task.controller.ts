import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller()
export class TaskController {
  constructor(private tasksvc: TaskService) {}

  @Get('/api/tasks')
  public getAllTasks() {
    return this.tasksvc.getAllTasks();
  }

  @Get(':id')
  public listTaskById(@Param('id') id: string) {
    return this.tasksvc.getTaskById(parseInt(id));
  }

  @Post('')
  public insertTask(task: any): any {
    return this.tasksvc.InsertTask(task);
  }

  @Put(':id')
  public updateTask(task: any): any {
    return this.tasksvc.updateTask(task);
  }
  @Delete(':id')
  public deleteTask(id: number) {
    return this.tasksvc.deleteTask(id);
  }
}
