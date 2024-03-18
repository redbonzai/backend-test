import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LocationDto {
  @ApiProperty({
    description: 'The name of the location',
    example: 'Main Office',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
