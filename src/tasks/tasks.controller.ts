import { Delete, Param, Patch, UsePipes, ValidationPipe } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Controller, Get, Post } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Tasks } from './tasks.model';

import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(): Tasks[] {
    return this.tasksService.getAllTasks();
  }

  @Get(':id')
  getTaskById(@Param() params): Tasks {
    const taskId = params.id;
    return this.tasksService.getTaskById(taskId);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto): Tasks {
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete(':id')
  deleteTaskById(@Param() params): Tasks[] {
    const taskId = params.id;
    return this.tasksService.deleteTaskById(taskId);
  }

  @Patch(':id')
  updateTaskById(@Param() params, @Body() fields: CreateTaskDto): Tasks {
    const taskId = params.id;
    return this.tasksService.updateTaskById(taskId, fields);
  }
}
