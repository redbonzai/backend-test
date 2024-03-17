import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LoggedTimeService } from './logged-time.service';
import { AbstractDocument } from '@app/common/database';
import { CreateLoggedTimeDto } from '@loggedtime/dto/create-loggedtime.dto';

@Controller('loggedtime')
export class LoggedTimeController {
  constructor(private readonly loggedTimeService: LoggedTimeService) {}

  @Post()
  async create(
    @Body() loggedTimeDto: CreateLoggedTimeDto,
  ): Promise<AbstractDocument> {
    return await this.loggedTimeService.create(loggedTimeDto);
  }

  @Get()
  findAll(): Promise<AbstractDocument[]> {
    return this.loggedTimeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AbstractDocument> {
    return await this.loggedTimeService.findOne(id);
  }

  @Get('labor/cost')
  laborWorker(): Promise<AbstractDocument[]> {
    return this.loggedTimeService.laborWorker();
  }

  @Get('labor/location')
  laborLocation(): Promise<AbstractDocument[]> {
    return this.loggedTimeService.laborLocation();
  }
}
