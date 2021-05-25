import { Injectable, NotFoundException } from '@nestjs/common';
import { Tasks, TaskStatus } from './tasks.model';
import { v1 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  private tasks: Tasks[] = [];
  getAllTasks() {
    return this.tasks;
  }

  getTaskById(taskId: string): Tasks {
    //console.log(taskId);
    const task = this.tasks.find((task) => task.id === taskId);
    if (!task) {
      throw new NotFoundException(`Task with id ${taskId} not found`);
    }
    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Tasks {
    const { title, content } = createTaskDto;
    const task = {
      id: uuid(),
      title,
      content,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    //console.log(task);
    return task;
  }

  deleteTaskById(taskId: string): Tasks[] {
    return this.tasks.filter((task) => task.id !== taskId);
  }

  updateTaskById(taskId: string, fields: CreateTaskDto): Tasks {
    const task = this.getTaskById(taskId);
    for (let props in fields) {
      task[props] = fields[props];
    }
    return task;
  }
}
