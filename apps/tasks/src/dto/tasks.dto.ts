import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class TaskDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsBoolean()
  completed: boolean;
}
