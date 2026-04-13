import { Inject, Injectable } from '@nestjs/common';
import { Task } from '../entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @Inject('MYSQL_CONNECTION') private mysql: any,
    // @Inject('PG_CONNECTION') private pg: any,
  ) {}

  public async getAllTasks(): Promise<Task[]> {
    const query = 'SELECT * FROM tasks ORDER BY name ASC';

    const [results] = await this.mysql.query(query);

    return results as Task[];
  }

  public getTaskById(id: number) {
    return `Tarea con id ${id}`;
  }

  public InsertTask(task: any): any {
    return task;
  }
  public updateTask(task: any): any {
    return task;
  }

  public deleteTask(id: number) {
    return `Tarea con id ${id} eliminada`;
  }
}
