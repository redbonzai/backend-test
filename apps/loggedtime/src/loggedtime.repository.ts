import { AbstractRepository, AbstractDocument } from '@app/common/database';
import { Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LoggedTimeDocument } from '@loggedtime/models';
import { CreateLoggedTimeDto } from '@loggedtime/dto';

export class LoggedTimeRepository extends AbstractRepository<AbstractDocument> {
  protected readonly logger = new Logger(LoggedTimeRepository.name);
  private readonly loggedTimeModel: Model<LoggedTimeDocument>;

  constructor(
    @InjectModel(LoggedTimeDocument.name)
    loggedTimeModel: Model<LoggedTimeDocument>,
  ) {
    super(loggedTimeModel);
    this.loggedTimeModel = loggedTimeModel;
  }

  async create(loggedTime: CreateLoggedTimeDto): Promise<LoggedTimeDocument> {
    console.log('INCOMING LOGGED TIME REQUEST TO THE REPOSITORY: ', loggedTime);
    const createdLoggedTime = new this.loggedTimeModel(loggedTime);
    console.log('created loggedtime : ', createdLoggedTime);
    return await createdLoggedTime.save();
  }
}
