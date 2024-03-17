import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from '@tasks/dto/create-task.dto';
import { TaskDocument } from '@tasks/models';
import { TaskRepository } from '@tasks/task.repository';
import { AbstractDocument } from '@app/common/database';
import { Task } from '@tasks/interfaces';

@Injectable()
export class TaskService {
  constructor(private taskRepository: TaskRepository) {}
  create(createTaskDto: CreateTaskDto): Promise<TaskDocument> {
    return this.taskRepository.create(createTaskDto);
  }

  findAll(): Promise<AbstractDocument[]> {
    return this.taskRepository.find({});
  }

  findOne(_id: string): Promise<AbstractDocument> {
    return this.taskRepository.findOne({ _id });
  }

  async updateCompletionStatus(id: string, completed: boolean): Promise<Task> {
    return this.taskRepository.completeTask(id, { completed });
  }
}
