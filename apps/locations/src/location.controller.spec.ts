import { Test, TestingModule } from '@nestjs/testing';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';

describe('LocationController', () => {
  let locationController: LocationController;
  let locationService: LocationService;

  beforeEach(async () => {
    const mockLocationService = {
      create: jest.fn().mockResolvedValue({}),
      findAll: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue({}),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [{ provide: LocationService, useValue: mockLocationService }],
    }).compile();

    locationController = app.get<LocationController>(LocationController);
    locationService = app.get<LocationService>(LocationService);
  });

  it('should create a location', async () => {
    const dto = new CreateLocationDto();
    await locationController.create(dto);
    expect(locationService.create).toHaveBeenCalledWith(dto);
  });

  it('should find all locations', async () => {
    await locationController.findAll();
    expect(locationService.findAll).toHaveBeenCalled();
  });

  it('should find one location', async () => {
    const id = '1';
    await locationController.findOne(id);
    expect(locationService.findOne).toHaveBeenCalledWith(id);
  });
});
