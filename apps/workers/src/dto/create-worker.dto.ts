import { IsNumber, IsString } from 'class-validator';

export class CreateWorkerDto {
  @IsString()
  username: string;

  @IsNumber()
  hourlyWage: number;
}
