import { Body, Controller, Get, Post } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { AbstractDocument } from '@app/common/database';
import { CreateWorkerDto } from './dto/create-worker.dto';

@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Post()
  create(@Body() createWorkerDto: CreateWorkerDto): Promise<AbstractDocument> {
    return this.workersService.create(createWorkerDto);
  }

  @Get()
  findAll(): Promise<AbstractDocument[]> {
    return this.workersService.findAll();
  }
}
