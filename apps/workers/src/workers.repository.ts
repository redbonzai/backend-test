import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AbstractRepository, AbstractDocument } from '@app/common/database';
import { WorkerDocument } from './models/worker.schema';
import { CreateWorkerDto } from './dto/create-worker.dto';

@Injectable()
export class WorkersRepository extends AbstractRepository<AbstractDocument> {
  protected readonly logger = new Logger(WorkersRepository.name);
  private workerModel: Model<WorkerDocument>;
  constructor(
    @InjectModel(WorkerDocument.name)
    workerModel: Model<WorkerDocument>,
  ) {
    super(workerModel);
    this.workerModel = workerModel;
  }

  async create(worker: CreateWorkerDto): Promise<WorkerDocument> {
    const createdWorker = new this.workerModel(worker);
    return await createdWorker.save();
  }
}
