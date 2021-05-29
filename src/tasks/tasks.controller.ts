import {
  Delete,
  Param,
  Patch,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Controller, Get, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { Users } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './tasks-status.enum';
import { Task } from './tasks.entity';

import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}
  @Get()
  getAllTasks(): Promise<Task[]> {
    return this.tasksService.getAllTasks();
  }

  @Get(':id')
  getTaskById(@Param() params): Promise<Task> {
    const taskId = params.id;
    return this.tasksService.getTaskById(taskId);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser()
    user: Users,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Delete(':id')
  deleteTaskById(@Param() params, @GetUser() user: Users): Promise<void> {
    const taskId = params.id;
    // console.log(user);
    return this.tasksService.deleteTaskById(taskId, user);
  }

  @Patch(':id')
  updateTaskById(
    @Param() params,
    @Body() fields: CreateTaskDto,
  ): Promise<Task> {
    const taskId = params.id;
    return this.tasksService.updateTaskById(taskId, fields);
  }

  //   @Get(':id')
  //   getTaskById(@Param() params): Tasks {
  //     const taskId = params.id;
  //     return this.tasksService.getTaskById(taskId);
  //   }
  //   @Post()
  //   @UsePipes(ValidationPipe)
  //   createTask(@Body() createTaskDto: CreateTaskDto): Tasks {
  //     return this.tasksService.createTask(createTaskDto);
  //   }
  //   @Delete(':id')
  //   deleteTaskById(@Param() params): Tasks[] {
  //     const taskId = params.id;
  //     return this.tasksService.deleteTaskById(taskId);
  //   }
  //   @Patch(':id')
  //   updateTaskById(@Param() params, @Body() fields: CreateTaskDto): Tasks {
  //     const taskId = params.id;
  //     return this.tasksService.updateTaskById(taskId, fields);
  //   }
}
