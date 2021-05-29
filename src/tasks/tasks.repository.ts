import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './tasks.entity';
import { v1 as uuid } from 'uuid';
import { TaskStatus } from './tasks-status.enum';
import { Users } from 'src/auth/user.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto, user: Users): Promise<Task> {
    const { title, content } = createTaskDto;
    const task = this.create({
      id: uuid(),
      title,
      content,
      status: TaskStatus.OPEN,
      user,
    });
    await this.save(task);
    return task;
  }

  async updateTask(task: Task, fields: CreateTaskDto): Promise<Task> {
    for (let props in fields) {
      task[props] = fields[props];
    }
    await this.save(task);
    return task;
  }
}
