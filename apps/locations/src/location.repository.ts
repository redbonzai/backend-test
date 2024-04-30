import { Injectable, Logger } from '@nestjs/common';
import { AbstractDocument, AbstractRepository } from '@app/common/database';
import { LocationDocument } from '@locations/models';
import { CreateLocationDto } from './dto/create-location.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class LocationRepository extends AbstractRepository<AbstractDocument> {
  protected readonly logger = new Logger(LocationRepository.name);
  private readonly locationModel: Model<LocationDocument>;

  constructor(
    @InjectModel(LocationDocument.name)
    locationModel: Model<LocationDocument>,
  ) {
    super(locationModel as unknown as Model<AbstractDocument>);
    this.locationModel = locationModel;
  }

  async create(location: CreateLocationDto): Promise<LocationDocument> {
    const createdLocation = new this.locationModel(location);
    return await createdLocation.save();
  }
}
