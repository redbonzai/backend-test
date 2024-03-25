import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { LoggedTimeService } from './logged-time.service';
import { AbstractDocument } from '@app/common/database';
import { CreateLoggedTimeDto } from '@loggedtime/dto/create-loggedtime.dto';
import { LaborCostFilterDto } from '@loggedtime/dto/labor-cost-filter.dto';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Logged Time')
@Controller('loggedtime')
export class LoggedTimeController {
  protected readonly logger = new Logger(LoggedTimeController.name);
  constructor(private readonly loggedTimeService: LoggedTimeService) {}

  @Post()
  @ApiOperation({ summary: 'Create logged time' })
  @ApiResponse({
    status: 201,
    description: 'The logged time has been successfully created.',
    type: AbstractDocument,
  })
  @ApiBody({ type: CreateLoggedTimeDto })
  async create(
    @Body() loggedTimeDto: CreateLoggedTimeDto,
  ): Promise<AbstractDocument> {
    return await this.loggedTimeService.create(loggedTimeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all logged times' })
  @ApiResponse({
    status: 200,
    description: 'List of all logged times',
    type: AbstractDocument,
    isArray: true,
  })
  findAll(): Promise<AbstractDocument[]> {
    return this.loggedTimeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific logged time by ID' })
  @ApiResponse({
    status: 200,
    description: 'Details of the specific logged time',
    type: AbstractDocument,
  })
  async findOne(@Param('id') id: string): Promise<AbstractDocument> {
    return await this.loggedTimeService.findOne(id);
  }

  @Get('labor/cost')
  @ApiOperation({ summary: 'Get labor cost for workers' })
  @ApiResponse({
    status: 200,
    description: 'Labor cost for workers',
    type: AbstractDocument,
    isArray: true,
  })
  @ApiQuery({
    name: 'workerId',
    type: 'string',
    required: false,
    description: 'Worker ID to filter by',
  })
  @ApiQuery({
    name: 'startDate',
    type: 'string',
    required: false,
    description: 'Start date of the period',
  })
  @ApiQuery({
    name: 'endDate',
    type: 'string',
    required: false,
    description: 'End date of the period',
  })
  laborWorker(
    @Query() filterDto: LaborCostFilterDto,
  ): Promise<AbstractDocument[]> {
    try {
      return this.loggedTimeService.laborWorker(filterDto);
    } catch (error) {
      this.logger.error('labWorker Exception:', error);
      console.log('THERE WAS AN EXCEPTION IN LABOR WORKER', error);
    }
  }

  @Get('labor/location')
  @ApiOperation({ summary: 'Get labor cost by location' })
  @ApiResponse({
    status: 200,
    description: 'Labor cost by location',
    type: AbstractDocument,
    isArray: true,
  })
  @ApiQuery({
    name: 'locationId',
    type: 'string',
    required: false,
    description: 'Location ID to filter by',
  })
  @ApiQuery({
    name: 'startDate',
    type: 'string',
    required: false,
    description: 'Start date of the period',
  })
  @ApiQuery({
    name: 'endDate',
    type: 'string',
    required: false,
    description: 'End date of the period',
  })
  laborLocation(
    @Query() filterDto: LaborCostFilterDto,
  ): Promise<AbstractDocument[]> {
    return this.loggedTimeService.laborLocation(filterDto);
  }

  @Get('tasks/worker')
  tasksPerWorker(
    @Query() filterDto: LaborCostFilterDto,
  ): Promise<AbstractDocument[]> {
    return this.loggedTimeService.tasksPerWorker(filterDto);
  }
}
