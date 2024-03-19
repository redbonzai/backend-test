// loggedtime.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { LoggedTimeController } from '@loggedtime/logged-time.controller';
import { LoggedTimeService } from '@loggedtime/logged-time.service';
import { CreateLoggedTimeDto } from '@loggedtime/dto/create-loggedtime.dto';
import { LaborCostFilterDto } from '@loggedtime/dto/labor-cost-filter.dto';

describe('LoggedTimeController', () => {
  let controller: LoggedTimeController;
  let service: LoggedTimeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoggedTimeController],
      providers: [
        {
          provide: LoggedTimeService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            laborWorker: jest.fn(),
            laborLocation: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LoggedTimeController>(LoggedTimeController);
    service = module.get<LoggedTimeService>(LoggedTimeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should call LoggedTimeService.create with expected DTO', async () => {
      const dto = new CreateLoggedTimeDto(); // Populate with test data as needed
      await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll()', () => {
    it('should call LoggedTimeService.findAll', async () => {
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('should call LoggedTimeService.findOne with the expected ID', async () => {
      const id = 'someId';
      await controller.findOne(id);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('laborWorker()', () => {
    it('should call LoggedTimeService.laborWorker with expected filter DTO', async () => {
      const filterDto = new LaborCostFilterDto(); // Populate with test data as needed
      await controller.laborWorker(filterDto);
      expect(service.laborWorker).toHaveBeenCalledWith(filterDto);
    });
  });

  describe('laborLocation()', () => {
    it('should call LoggedTimeService.laborLocation with expected filter DTO', async () => {
      const filterDto = new LaborCostFilterDto(); // Populate with test data as needed
      await controller.laborLocation(filterDto);
      expect(service.laborLocation).toHaveBeenCalledWith(filterDto);
    });
  });
});
