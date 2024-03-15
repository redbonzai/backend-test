import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common/database/abstract.repository';
import { Model } from 'mongoose';
// import * as mongoose from 'mongoose';
import { AbstractDocument } from '@app/common/database';
import { InjectModel } from '@nestjs/mongoose';
import { WorkerDocument } from './models/worker.schema';

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
}
