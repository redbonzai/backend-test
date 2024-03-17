import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class WorkerDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNumber()
  @IsNotEmpty()
  hourlyWage: number;
}
