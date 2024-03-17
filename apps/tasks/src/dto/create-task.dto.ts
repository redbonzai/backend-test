import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { LocationDto } from '@locations/dto/locations.dto';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @ValidateNested()
  @Type(() => LocationDto)
  @IsObject()
  location: LocationDto;

  @IsBoolean()
  completed: boolean;
}
