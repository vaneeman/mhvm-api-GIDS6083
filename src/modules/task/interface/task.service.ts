import { Inject, Injectable } from '@nestjs/common';
import { Task } from '../entities/task.entity';
import { CreateTaskDto, UpdateTaskDto } from '../dto/create-task.dto';
import { PrismaService } from 'src/common/services/prisma.service';

@Injectable()
export class TaskService {
  constructor(
    @Inject('MYSQL_CONNECTION') private mysql: any,
    // @Inject('PG_CONNECTION') private pg: any,
    private prisma: PrismaService,
  ) {}

  public async getAllTasks(): Promise<Task[]> {
    return await this.prisma.task.findMany({ orderBy: [{ name: 'asc' }] });
  }

  public async getTasksByUser(userId: number): Promise<Task[]> {
    return await this.prisma.task.findMany({
      where: { user_id: userId },
      orderBy: [{ name: 'asc' }],
    });
  }

  public async getTaskById(id: number): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    return task;
  }

  public async InsertTask(task: CreateTaskDto): Promise<Task> {
    const newTask = await this.prisma.task.create({
      data: task,
    });
    return newTask;
  }

  public async updateTask(
    id: number,
    taskUpdate: UpdateTaskDto,
  ): Promise<Task> {
    const taskUpdated = await this.prisma.task.update({
      where: { id },
      data: taskUpdate,
    });
    return taskUpdated;
  }

  public async deleteTask(id: number): Promise<Task> {
    const taskDeleted = await this.prisma.task.delete({
      where: { id },
    });
    return taskDeleted;
  }
}
