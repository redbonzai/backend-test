import { AbstractDocument, AbstractRepository } from '@app/common/database';
import { Logger } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LoggedTimeDocument } from '@loggedtime/models';
import { CreateLoggedTimeDto } from '@loggedtime/dto';
import { TaskDocument } from '@tasks/models';
import { WorkerDocument } from '@workers/models';
import { LocationDocument } from '@locations/models';
import { firstOrCreate } from '@app/common/database/first-or-create';
import { LaborCostFilterDto } from '@loggedtime/dto/labor-cost-filter.dto';

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

  // Method to build match stages for filtering
  buildMatchStages(filterDto: LaborCostFilterDto): any[] {
    const matchStages = [];
    console.log('FILTER DTO', filterDto);
    if (filterDto.includeCompleted !== undefined) {
      matchStages.push({
        $match: { 'taskDetails.completed': filterDto.includeCompleted },
      });
    }

    if (filterDto.workerIds && filterDto.workerIds.length > 0) {
      matchStages.push({
        $match: {
          worker: {
            $in: filterDto.workerIds.map((id) => new Types.ObjectId(id)),
          },
        },
      });
    }

    if (filterDto.locationIds && filterDto.locationIds.length > 0) {
      matchStages.push({
        $match: {
          location: {
            $in: filterDto.locationIds.map((id) => new Types.ObjectId(id)),
          },
        },
      });
    }

    if (filterDto.taskIds && filterDto.taskIds.length > 0) {
      matchStages.push({
        $match: {
          location: {
            $in: filterDto.locationIds.map((id) => new Types.ObjectId(id)),
          },
        },
      });
    }

    console.log('MATCH STAGES', JSON.stringify(matchStages));
    return matchStages;
  }

  async laborCostByWorker(filterDto: LaborCostFilterDto): Promise<any[]> {
    const matchStages = this.buildMatchStages(filterDto);

    const pipeline = [
      {
        $lookup: {
          from: 'taskdocuments', // Join with taskdocuments to access 'completed' field
          localField: 'task', // Field from loggedtimedocuments
          foreignField: '_id', // Field from taskdocuments
          as: 'taskDetails', // Array of matched taskdocuments
        },
      },
      { $unwind: '$taskDetails' }, // Unwind for direct access to task details
      ...matchStages, // Apply filter conditions including checking taskDetails.completed
      {
        $lookup: {
          from: 'workerdocuments', // Further lookup for worker details
          localField: 'worker',
          foreignField: '_id',
          as: 'workerDetails',
        },
      },
      { $unwind: '$workerDetails' },
      {
        $group: {
          _id: '$workerDetails.username',
          totalHours: { $sum: { $divide: ['$timeSeconds', 3600] } },
          hourlyWage: { $first: '$workerDetails.hourlyWage' },
        },
      },
      {
        $project: {
          _id: 0,
          worker: '$_id',
          totalCost: { $multiply: ['$totalHours', '$hourlyWage'] },
        },
      },
    ];

    return await this.loggedTimeModel.aggregate(pipeline).exec();
  }

  async laborCostByLocation(filterDto: LaborCostFilterDto): Promise<any[]> {
    const pipeline = [
      {
        $lookup: {
          from: 'taskdocuments',
          localField: 'task',
          foreignField: '_id',
          as: 'taskDetails',
        },
      },
      { $unwind: '$taskDetails' },
      // Apply match stages here, after task details are available for filtering by completion status
      ...this.buildMatchStages(filterDto),
      {
        $lookup: {
          from: 'locationdocuments',
          localField: 'location',
          foreignField: '_id',
          as: 'locationDetails',
        },
      },
      { $unwind: '$locationDetails' },
      {
        $lookup: {
          from: 'workerdocuments',
          localField: 'worker',
          foreignField: '_id',
          as: 'workerDetails',
        },
      },
      { $unwind: '$workerDetails' },
      {
        $group: {
          _id: '$locationDetails.name',
          totalHours: { $sum: { $divide: ['$timeSeconds', 3600] } },
          totalLaborCost: {
            $sum: {
              $multiply: [
                { $divide: ['$timeSeconds', 3600] },
                '$workerDetails.hourlyWage',
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          location: '$_id',
          totalLaborCost: 1,
        },
      },
    ];

    return await this.loggedTimeModel.aggregate(pipeline).exec();
  }

  async tasksPerWorker(filterDto: LaborCostFilterDto): Promise<any[]> {
    const matchStages = this.buildMatchStages(filterDto);

    const pipeline = [
      {
        $lookup: {
          from: 'taskdocuments',
          localField: 'task',
          foreignField: '_id',
          as: 'taskDetails',
        },
      },
      { $unwind: '$taskDetails' },
      // Integrating the dynamic match stages built from filterDto
      ...matchStages,
      {
        $lookup: {
          from: 'workerdocuments', // Ensure this matches your MongoDB collection name for workers
          localField: 'worker',
          foreignField: '_id',
          as: 'workerDetails',
        },
      },
      { $unwind: '$workerDetails' },
      {
        $group: {
          _id: '$worker',
          numberOfTasks: { $sum: 1 },
          workerName: { $first: '$workerDetails.username' }, // Getting the worker's name
          totalHours: { $sum: { $divide: ['$taskDetails.timeSeconds', 3600] } }, // Sum total hours per worker, adjust if necessary
        },
      },
      {
        $project: {
          _id: 0,
          workerId: '$_id',
          workerName: 1,
          numberOfTasks: 1,
          totalHours: 1,
        },
      },
    ];

    return await this.loggedTimeModel.aggregate(pipeline).exec();
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

    return firstOrCreate(this.loggedTimeModel, loggedTimeData, loggedTimeData);
  }

  private async firstOrCreateTask(
    taskName: string,
    locationName: string,
  ): Promise<TaskDocument> {
    const location: LocationDocument = await firstOrCreate(
      this.locationModel,
      { name: locationName },
      { name: locationName },
    );
    return firstOrCreate(
      this.taskModel,
      { description: taskName, 'location.name': locationName },
      { description: taskName, location },
    );
  }

  private async firstOrCreateWorker(
    workerName: string,
    hourlyWage: number,
  ): Promise<WorkerDocument> {
    return firstOrCreate(
      this.workerModel,
      { username: workerName, hourlyWage },
      { username: workerName, hourlyWage },
    );
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
