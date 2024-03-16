import { Injectable } from '@nestjs/common';
import { AbstractDocument } from '@app/common/database';
import { WorkersRepository } from './workers.repository';
import { CreateWorkerDto } from './dto/create-worker.dto';

@Injectable()
export class WorkersService {
  constructor(private workersRepository: WorkersRepository) {}

  async create(createWorkerDto: CreateWorkerDto): Promise<AbstractDocument> {
    return this.workersRepository.create(createWorkerDto);
  }

  findAll(): Promise<AbstractDocument[]> {
    return this.workersRepository.find({});
  }

  findOne(_id: string): Promise<AbstractDocument> {
    return this.workersRepository.findOne({ _id });
  }
}
