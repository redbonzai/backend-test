import { Body, Controller, Get, Post } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { AbstractDocument } from '@app/common/database';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Workers')
@Controller('workers')
@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new worker' })
  @ApiResponse({ status: 201, description: 'The worker has been successfully created.', type: AbstractDocument })
  @ApiBody({ type: CreateWorkerDto })
  create(@Body() createWorkerDto: CreateWorkerDto): Promise<AbstractDocument> {
    return this.workersService.create(createWorkerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all workers' })
  @ApiResponse({ status: 200, description: 'List of all workers', type: AbstractDocument, isArray: true })
  findAll(): Promise<AbstractDocument[]> {
    return this.workersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific worker by ID' })
  @ApiResponse({ status: 200, description: 'Details of the specified worker', type: AbstractDocument })
  @ApiParam({ name: 'id', type: 'string', description: 'Worker ID' })
  async findOne(@Body() id: string): Promise<AbstractDocument> {
    return await this.workersService.findOne(id);
  }
}
