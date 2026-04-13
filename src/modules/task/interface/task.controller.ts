import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from '../dto/create-task.dto';
import { Task } from '../entities/task.entity';

@Controller('/api/task')
export class TaskController {
  constructor(private tasksvc: TaskService) {}

  @Get('')
  async getAllTasks(): Promise<Task[]> {
    return await this.tasksvc.getAllTasks();
  }

  @Get(':id')
  public async listTaskById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Task> {
    const result = await this.tasksvc.getTaskById(id);
    console.log('Tipo de dato', typeof result);
    if (result == undefined || result == null) {
      throw new HttpException(
        `Tarea con id: ${id} no encontrada`,
        HttpStatus.NOT_FOUND,
      );
    }
    return this.tasksvc.getTaskById(id);
  }

  @Post('')
  public async insertTask(@Body() task: CreateTaskDto): Promise<Task> {
    const result = this.tasksvc.InsertTask(task);
    if (result == undefined || result == null) {
      throw new HttpException(
        `Error al insertar la tarea`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return result;
  }

  @Put(':id')
  public async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() taskUpdate: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksvc.updateTask(id, taskUpdate);
  }

  @Delete(':id')
  public async deleteTask(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<boolean> {
    const result = await this.tasksvc.deleteTask(id);
    if (!result) {
      throw new HttpException(
        `Error al eliminar la tarea con id: ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}
