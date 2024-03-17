// create-logged-time.dto.ts
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateLoggedTimeDto {
  @IsNotEmpty()
  @IsString()
  taskName: string;

  @IsNotEmpty()
  @IsString()
  workerName: string;

  @IsNotEmpty()
  @IsNumber()
  hourlyWage: number;

  @IsNotEmpty()
  @IsString()
  locationName: string;

  @IsNotEmpty()
  @IsNumber()
  timeSeconds: number;
}
