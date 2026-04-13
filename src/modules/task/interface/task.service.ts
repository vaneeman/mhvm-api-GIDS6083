import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskService {
  public getAllTasks() {
    return 'Listado de tareas';
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
