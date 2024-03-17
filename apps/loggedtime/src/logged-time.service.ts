import { Injectable } from '@nestjs/common';
import { AbstractDocument } from '@app/common/database';
import { LoggedTimeRepository } from '@loggedtime/loggedtime.repository';
import { CreateLoggedTimeDto } from '@loggedtime/dto';

@Injectable()
export class LoggedTimeService {
  constructor(private loggedTimeRepository: LoggedTimeRepository) {}

  async create(loggedTimeDto: CreateLoggedTimeDto): Promise<AbstractDocument> {
    console.log('incoming to the service: ', loggedTimeDto);
    return this.loggedTimeRepository.create(loggedTimeDto);
  }

  findAll(): Promise<AbstractDocument[]> {
    return this.loggedTimeRepository.find({});
  }

  findOne(_id: string): Promise<AbstractDocument> {
    return this.loggedTimeRepository.findOne({ _id });
  }
}
