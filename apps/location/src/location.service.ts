import { Injectable } from '@nestjs/common';
import { LocationRepository } from './location.repository';
import { CreateLocationDto } from './dto/create-location.dto';
import { AbstractDocument } from '@app/common/database';

@Injectable()
export class LocationService {
  constructor(private locationRepository: LocationRepository) {}

  async create(
    createLocationDto: CreateLocationDto,
  ): Promise<AbstractDocument> {
    return this.locationRepository.create(createLocationDto);
  }

  findAll(): Promise<AbstractDocument[]> {
    return this.locationRepository.find({});
  }

  findOne(_id: string): Promise<AbstractDocument> {
    return this.locationRepository.findOne({ _id });
  }
}
