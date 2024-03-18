import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { LocationService } from './location.service';
import { AbstractDocument } from '@app/common/database';
import { CreateLocationDto } from '@locations/dto';
// import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new location' })
  @ApiBody({ type: CreateLocationDto })
  @ApiResponse({
    status: 201,
    description: 'The location has been successfully created.',
    type: AbstractDocument,
  })
  create(
    @Body() createLocationDto: CreateLocationDto,
  ): Promise<AbstractDocument> {
    return this.locationService.create(createLocationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all locations' })
  @ApiResponse({
    status: 200,
    description: 'List of all locations',
    type: AbstractDocument,
    isArray: true,
  })
  findAll(): Promise<AbstractDocument[]> {
    return this.locationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific location by ID' })
  @ApiResponse({
    status: 200,
    description: 'The details of the location',
    type: AbstractDocument,
  })
  async findOne(@Param('id') id: string): Promise<AbstractDocument> {
    return await this.locationService.findOne(id);
  }
}
