import { AbstractDocument, AbstractRepository } from '@app/common/database';
import { Logger } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LoggedTimeDocument } from '@loggedtime/models';
import { CreateLoggedTimeDto } from '@loggedtime/dto';
import { TaskDocument } from '@tasks/models';
import { WorkerDocument } from '@workers/models';
import { LocationDocument } from '@locations/models';

export class LoggedTimeRepository extends AbstractRepository<AbstractDocument> {
  protected readonly logger = new Logger(LoggedTimeRepository.name);

  constructor(
    @InjectModel(LoggedTimeDocument.name)
    private readonly loggedTimeModel: Model<LoggedTimeDocument>,
    @InjectModel(TaskDocument.name)
    private readonly taskModel: Model<TaskDocument>,
    @InjectModel(WorkerDocument.name)
    private readonly workerModel: Model<WorkerDocument>,
    @InjectModel(LocationDocument.name)
    private readonly locationModel: Model<LocationDocument>,
  ) {
    super(loggedTimeModel);
  }

  // Generalized firstOrCreate function
  private async firstOrCreate<T>(
    model: Model<T>,
    query: object,
    createData: object,
  ): Promise<T> {
    let document = await model.findOne(query);
    if (!document) {
      document = new model(createData);
      await document.save();
    }
    return document;
  }

  // Method to handle logged time creation or finding existing one
  async create(createDto: CreateLoggedTimeDto): Promise<LoggedTimeDocument> {
    const task = await this.firstOrCreateTask(
      createDto.taskName,
      createDto.locationName,
    );
    const worker = await this.firstOrCreateWorker(
      createDto.workerName,
      createDto.hourlyWage,
    );
    const location = await this.firstOrCreateLocation(createDto.locationName);

    // Assuming createDto includes fields directly usable in LoggedTime creation
    const loggedTimeData = {
      ...createDto,
      task: task._id,
      worker: worker._id,
      location: location._id,
    };

    return this.firstOrCreate(
      this.loggedTimeModel,
      loggedTimeData,
      loggedTimeData,
    );
  }

  private async firstOrCreateTask(
    taskName: string,
    locationName: string,
  ): Promise<TaskDocument> {
    const location: LocationDocument = await this.firstOrCreate(
      this.locationModel,
      { name: locationName },
      { name: locationName },
    );
    return this.firstOrCreate(
      this.taskModel,
      { description: taskName, 'location.name': locationName },
      { description: taskName, location },
    );
  }

  private async firstOrCreateWorker(
    workerName: string,
    hourlyWage: number,
  ): Promise<WorkerDocument> {
    return this.firstOrCreate(
      this.workerModel,
      { username: workerName, hourlyWage },
      { username: workerName, hourlyWage },
    );
  }

  private async firstOrCreateLocation(
    locationName: string,
  ): Promise<LocationDocument> {
    return this.firstOrCreate(
      this.locationModel,
      { name: locationName },
      { name: locationName },
    );
  }

  // Utility methods to find or create task, worker, and location
  // private async findOrCreateTask(description: string): Promise<Types.ObjectId> {
  //   let task = await this.taskModel.findOne({ description });
  //   if (!task) {
  //     task = await this.taskModel.create({ description });
  //   }
  //   return task._id;
  // }
  //
  // private async findOrCreateWorker(
  //   username: string,
  //   hourlyWage: number,
  // ): Promise<Types.ObjectId> {
  //   let worker = await this.workerModel.findOne({ username });
  //   if (!worker) {
  //     worker = await this.workerModel.create({ username, hourlyWage });
  //   }
  //   return worker._id;
  // }
  //
  // private async findOrCreateLocation(name: string): Promise<Types.ObjectId> {
  //   let location = await this.locationModel.findOne({ name });
  //   if (!location) {
  //     location = await this.locationModel.create({ name });
  //   }
  //   return location._id;
  // }
  //
  // // Main method to handle logged time creation
  // async create(
  //   loggedTimeDto: CreateLoggedTimeDto,
  // ): Promise<LoggedTimeDocument> {
  //   const { taskName, workerName, locationName, timeSeconds, hourlyWage } =
  //     loggedTimeDto;
  //
  //   const taskId = await this.findOrCreateTask(taskName);
  //   const workerId = await this.findOrCreateWorker(workerName, hourlyWage);
  //   const locationId = await this.findOrCreateLocation(locationName);
  //
  //   const loggedTime = await this.loggedTimeModel.create({
  //     task: taskId,
  //     worker: workerId,
  //     location: locationId,
  //     timeSeconds,
  //   });
  //   console.log('LOGGED TIME CREATED: ', loggedTime);
  //   return loggedTime;
  // }
}
