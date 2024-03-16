import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { LocationService } from './location.service';
import { AbstractDocument } from '@app/common/database';
import { CreateLocationDto } from './dto/create-location.dto';
// import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  create(
    @Body() createLocationDto: CreateLocationDto,
  ): Promise<AbstractDocument> {
    return this.locationService.create(createLocationDto);
  }

  @Get()
  findAll(): Promise<AbstractDocument[]> {
    return this.locationService.findAll();
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<AbstractDocument> {
    return await this.locationService.findOne(id);
  }
}
