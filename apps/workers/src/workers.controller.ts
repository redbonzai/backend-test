import { Controller, Get } from '@nestjs/common';
import { WorkersService } from './workers.service';

@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Get()
  getHello(): string {
    return this.workersService.getHello();
  }
}
