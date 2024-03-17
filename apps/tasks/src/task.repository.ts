import { AbstractRepository, AbstractDocument } from '@app/common/database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TaskDocument } from '@tasks/models';
import { Model } from 'mongoose';
import { CreateTaskDto } from '@tasks/dto/create-task.dto';
import { LocationDocument } from '@locations/models';
import { firstOrCreate } from '@app/common/database/first-or-create';

@Injectable()
export class TaskRepository extends AbstractRepository<AbstractDocument> {
  protected readonly logger = new Logger(TaskRepository.name);

  constructor(
    @InjectModel(TaskDocument.name)
    private readonly taskModel: Model<TaskDocument>,
    @InjectModel(LocationDocument.name)
    private readonly locationModel: Model<LocationDocument>,
  ) {
    super(taskModel);
  }

  async create(createTaskDto: CreateTaskDto): Promise<TaskDocument> {
    // Assuming you have a method to findOrCreateLocation that returns a LocationDocument
    const locationDocument = await this.firstOrCreateLocation(
      createTaskDto.location.name,
    );

    const taskData = {
      ...createTaskDto,
      location: locationDocument, // Replace the simple location name with the document
    };

    const task = new this.taskModel(taskData);
    return task.save();
  }

  private async firstOrCreateLocation(
    locationName: string,
  ): Promise<LocationDocument> {
    return firstOrCreate(
      this.locationModel,
      { name: locationName },
      { name: locationName },
    );
  }
}
