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

  buildMatchStages(filterDto: LaborCostFilterDto): any[] {
    const matchStages = [];

    if (filterDto.includeCompleted !== undefined) {
      console.log('INCLUDES COMPLETED: ', filterDto.includeCompleted);
      matchStages.push({
        $match: { 'taskDetails.completed': filterDto.includeCompleted },
      });
    }

    if (filterDto.workerIds && filterDto.workerIds.length > 0) {
      console.log('INCLUDES WORKER IDS: ', filterDto.workerIds);
      matchStages.push({
        $match: {
          'workerDetails._id': {
            $in: filterDto.workerIds.map((id) => new Types.ObjectId(id)),
          },
        },
      });
    }

    if (filterDto.locationIds && filterDto.locationIds.length > 0) {
      console.log('INCLUDES LOCATION IDS: ', filterDto.locationIds);
      matchStages.push({
        $match: {
          'locationDetails._id': {
            $in: filterDto.locationIds.map((id) => new Types.ObjectId(id)),
          },
        },
      });
    }

    console.log('MATCH STAGES : ', matchStages);

    // Add any other filters here

    return matchStages;
  }

  async laborCostByWorker(filterDto: LaborCostFilterDto): Promise<any[]> {
    console.log('filterDto', filterDto);
    const matchStages = this.buildMatchStages(filterDto);
    console.log('matchStages', matchStages);

    const pipeline = [
      ...matchStages, // Apply filter conditions
      {
        $lookup: {
          from: 'workerdocuments', // Ensure this matches your MongoDB collection name
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
    const matchStages = this.buildMatchStages(filterDto);
    const pipeline = [
      ...matchStages,
      {
        $lookup: {
          from: 'locationdocuments', // Assuming this is your location collection name
          localField: 'location',
          foreignField: '_id',
          as: 'locationDetails',
        },
      },
      {
        $unwind: '$locationDetails',
      },
      {
        $lookup: {
          from: 'workerdocuments', // The collection name for workers
          localField: 'worker',
          foreignField: '_id',
          as: 'workerDetails',
        },
      },
      {
        $unwind: '$workerDetails',
      },
      {
        $group: {
          _id: '$locationDetails.name', // Group by location name
          totalHours: { $sum: { $divide: ['$timeSeconds', 3600] } }, // Summing total hours worked
          totalLaborCost: {
            $sum: {
              $multiply: [
                { $divide: ['$timeSeconds', 3600] },
                '$workerDetails.hourlyWage',
              ],
            },
          }, // Calculating total labor cost
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

    // const pipeline = [
    //   ...matchStages, // Apply filter conditions
    //   {
    //     $lookup: {
    //       from: 'locationdocuments', // Ensure this matches your MongoDB collection name
    //       localField: 'location',
    //       foreignField: '_id',
    //       as: 'locationDetails',
    //     },
    //   },
    //   { $unwind: '$locationDetails' },
    //   {
    //     $lookup: {
    //       from: 'workerdocuments', // Ensure this matches your MongoDB collection name
    //       localField: 'worker',
    //       foreignField: '_id',
    //       as: 'workerDetails',
    //     },
    //   },
    //   { $unwind: '$workerDetails' },
    //   {
    //     $group: {
    //       _id: '$locationDetails.name',
    //       totalHours: { $sum: { $divide: ['$timeSeconds', 3600] } },
    //       totalLaborCost: {
    //         $sum: { $multiply: ['$totalHours', '$workerDetails.hourlyWage'] },
    //       },
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       location: '$_id',
    //       totalLaborCost: 1,
    //     },
    //   },
    // ];

    return await this.loggedTimeModel.aggregate(pipeline).exec();
  }

  // async laborCostByLocation(): Promise<any[]> {
  //   return this.loggedTimeModel.aggregate();
  // }

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
