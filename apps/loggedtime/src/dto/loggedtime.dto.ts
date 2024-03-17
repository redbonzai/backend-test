import { Type } from 'class-transformer';
import { TaskDto } from '@tasks/dto/tasks.dto';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { WorkerDto } from '@workers/dto/worker.dto';
import { LocationDto } from '@locations/dto/locations.dto';

export class LoggedTimeDto {
  @IsNumber()
  @IsNotEmpty()
  timeSeconds: number;

  @IsObject()
  @ValidateNested()
  @Type(() => TaskDto)
  task: TaskDto;

  @IsObject()
  @ValidateNested()
  @Type(() => WorkerDto)
  worker: WorkerDto;

  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}
