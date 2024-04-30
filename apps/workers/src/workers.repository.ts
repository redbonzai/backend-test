import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AbstractRepository, AbstractDocument } from '@app/common/database';
import { WorkerDocument } from '@workers/models';
import { CreateWorkerDto } from './dto/create-worker.dto';

@Injectable()
export class WorkersRepository extends AbstractRepository<AbstractDocument> {
  protected readonly logger = new Logger(WorkersRepository.name);
  private readonly workerModel: Model<WorkerDocument>;
  constructor(
    @InjectModel(WorkerDocument.name)
    workerModel: Model<WorkerDocument>,
  ) {
    super(workerModel as unknown as Model<AbstractDocument>);
    this.workerModel = workerModel;
  }

  async create(worker: CreateWorkerDto): Promise<WorkerDocument> {
    const createdWorker = new this.workerModel(worker);
    return await createdWorker.save();
  }
}
