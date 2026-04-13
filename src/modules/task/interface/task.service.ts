import { Inject, Injectable } from '@nestjs/common';
import { Task } from '../entities/task.entity';
import { CreateTaskDto, UpdateTaskDto } from '../dto/create-task.dto';

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

  public async getTaskById(id: number): Promise<Task> {
    const query = `SELECT * FROM tasks WHERE id = ${id}`;
    const [results] = await this.mysql.query(query);
    return results[0] as Task;
  }

  public async InsertTask(task: CreateTaskDto): Promise<Task> {
    const query = `INSERT INTO tasks (name, description, priority, user_id) VALUES ('${task.name}', '${task.description}', ${task.priority}, ${task.user_id})`;
    const [result] = await this.mysql.query(query);
    const insertId = result.insertId;
    return await this.getTaskById(result.insertId);
  }

  public async updateTask(
    id: number,
    taskUpdate: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.getTaskById(id);
    task.name = taskUpdate.name ?? task.name;
    task.description = taskUpdate.description ?? task.description;
    task.priority = taskUpdate.priority ?? task.priority;

    const query = `UPDATE tasks SET name = '${task.name}', description = '${task.description}', priority = ${task.priority} WHERE id = ${id}`;
    await this.mysql.query(query);
    return await this.getTaskById(id);
  }

  public async deleteTask(id: number): Promise<boolean> {
    const query = `DELETE FROM tasks WHERE id = ${id}`;
    const [result] = await this.mysql.query(query);
    return result.affectedRows > 0;
  }
}
