import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from '../dto/create-task.dto';

@Controller('/api/tasks')
export class TaskController {
  constructor(private tasksvc: TaskService) {}

  @Get('')
  public getAllTasks() {
    return this.tasksvc.getAllTasks();
  }

  @Get(':id')
  public listTaskById(@Param('id') id: string) {
    return this.tasksvc.getTaskById(parseInt(id));
  }

  @Post('')
  public insertTask(@Body() task: CreateTaskDto): any {
    console.error('Inserting task:', task);
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
