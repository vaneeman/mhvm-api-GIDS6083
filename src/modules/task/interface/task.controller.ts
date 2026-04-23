import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from '../dto/create-task.dto';
import { Task } from '../entities/task.entity';
import { AuthGuard } from 'src/common/guards/auth.guards';
import { LogsService } from 'src/modules/logs/interface/logs.service';

@Controller('/api/task')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(
    private tasksvc: TaskService,
    private logsSvc: LogsService,
  ) {}

  @Get('')
  async getAllTasks(@Req() req: any): Promise<Task[]> {
    return await this.tasksvc.getTasksByUser(req['user'].sub);
  }

  @Get(':id')
  public async listTaskById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<Task> {
    const result = await this.tasksvc.getTaskById(id);
    if (!result) throw new NotFoundException(`Tarea con id: ${id} no encontrada`);
    if (result.user_id !== req['user'].sub) throw new ForbiddenException('No tienes permiso para ver esta tarea');
    return result;
  }

  @Post('')
  public async insertTask(
    @Body() task: CreateTaskDto,
    @Req() req: any,
  ): Promise<Task> {
    task.user_id = req['user'].sub;
    const result = await this.tasksvc.InsertTask(task);
    if (!result) throw new HttpException('Error al insertar la tarea', HttpStatus.INTERNAL_SERVER_ERROR);

    // ✅ Log de creación de tarea
    await this.logsSvc.createLog({
      statusCode: 201,
      path: req.url,
      errorCode: 'TASK_CREATED',
      session_id: req['user'].sub,
    });

    return result;
  }

  @Put(':id')
  public async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() taskUpdate: UpdateTaskDto,
    @Req() req: any,
  ): Promise<Task> {
    const task = await this.tasksvc.getTaskById(id);
    if (!task) throw new NotFoundException(`Tarea con id: ${id} no encontrada`);
    if (task.user_id !== req['user'].sub) throw new ForbiddenException('No tienes permiso para editar esta tarea');
    return this.tasksvc.updateTask(id, taskUpdate);
  }

  @Delete(':id')
  public async deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<boolean> {
    const task = await this.tasksvc.getTaskById(id);
    if (!task) throw new NotFoundException(`Tarea con id: ${id} no encontrada`);
    if (task.user_id !== req['user'].sub) throw new ForbiddenException('No tienes permiso para eliminar esta tarea');

    try {
      await this.tasksvc.deleteTask(id);

      // ✅ Log de eliminación de tarea
      await this.logsSvc.createLog({
        statusCode: 200,
        path: req.url,
        errorCode: 'TASK_DELETED',
        session_id: req['user'].sub,
      });

    } catch (error) {
      throw new HttpException(`Error al eliminar la tarea con id: ${id}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return true;
  }
}