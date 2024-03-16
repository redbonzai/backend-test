import { IsNumber, IsString } from 'class-validator';

export class CreateWorkerDto {
  @IsString()
  name: string;

  @IsNumber()
  hourlyWage: number;
}
