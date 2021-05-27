import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { v1 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksRepository } from './tasks.repository';
import { Task } from './tasks.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  async getTaskById(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne(id);
    console.log('---', task);
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found.`);
    }
    return task;
  }

  async getAllTasks(): Promise<Task[]> {
    return await this.tasksRepository.find();
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }

  async deleteTaskById(taskId: string): Promise<void> {
    const task = await this.tasksRepository.delete(taskId);
    if (task.affected === 0) {
      throw new NotFoundException(`Task with ${taskId} not found`);
    }
  }

  async updateTaskById(taskId: string, fields: CreateTaskDto): Promise<Task> {
    const task = await this.getTaskById(taskId);

    if (!task) {
      throw new NotFoundException(`Task with ${taskId} not found`);
    }
    return this.tasksRepository.updateTask(task, fields);
  }

  //   private tasks: Tasks[] = [];
  //   getAllTasks() {
  //     return this.tasks;
  //   }
  //   getTaskById(taskId: string): Tasks {
  //     //console.log(taskId);
  //     const task = this.tasks.find((task) => task.id === taskId);
  //     if (!task) {
  //       throw new NotFoundException(`Task with id ${taskId} not found`);
  //     }
  //     return task;
  //   }
  //   createTask(createTaskDto: CreateTaskDto): Tasks {
  //     const { title, content } = createTaskDto;
  //     const task = {
  //       id: uuid(),
  //       title,
  //       content,
  //       status: TaskStatus.OPEN,
  //     };
  //     this.tasks.push(task);
  //     //console.log(task);
  //     return task;
  //   }
  //   deleteTaskById(taskId: string): Tasks[] {
  //     return this.tasks.filter((task) => task.id !== taskId);
  //   }
  //   updateTaskById(taskId: string, fields: CreateTaskDto): Tasks {
  //     const task = this.getTaskById(taskId);
  //     for (let props in fields) {
  //       task[props] = fields[props];
  //     }
  //     return task;
  //   }
}
