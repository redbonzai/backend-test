import { AbstractRepository, AbstractDocument } from '@app/common/database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TaskDocument } from '@tasks/models';
import { Model } from 'mongoose';
import { CreateTaskDto } from '@tasks/dto/create-task.dto';

@Injectable()
export class TaskRepository extends AbstractRepository<AbstractDocument> {
  protected readonly logger = new Logger(TaskRepository.name);
  private readonly taskModel: Model<TaskDocument>;

  constructor(
    @InjectModel(TaskDocument.name)
    taskModel: Model<TaskDocument>,
  ) {
    super(taskModel);
    this.taskModel = taskModel;
  }

  async create(task: CreateTaskDto): Promise<TaskDocument> {
    const createTask = new this.taskModel(task);
    return await createTask.save();
  }
}
