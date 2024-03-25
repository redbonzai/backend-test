import {
  IsOptional,
  IsBoolean,
  IsMongoId,
  ArrayNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class LaborCostFilterDto {
  @IsOptional()
  @Transform(({ value }) => value === 'true', { toClassOnly: true })
  @IsBoolean()
  includeCompleted?: boolean;

  @IsOptional()
  @Transform(({ value }) =>
    value
      .toString()
      .split(',')
      .map((item: string) => item.trim()),
  )
  @IsMongoId({ each: true })
  @ArrayNotEmpty()
  workerIds?: string[];

  @IsOptional()
  @Transform(({ value }) =>
    value
      .toString()
      .split(',')
      .map((item: string) => item.trim()),
  )
  @IsMongoId({ each: true })
  @ArrayNotEmpty()
  locationIds?: string[];

  @IsOptional()
  @Transform(({ value }) =>
    value
      .toString()
      .split(',')
      .map((item: string) => item.trim()),
  )
  @IsMongoId({ each: true })
  @ArrayNotEmpty()
  taskIds?: string[];
}
