// workers.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { WorkersController } from '@workers/workers.controller';
import { WorkersService } from '@workers/workers.service';
import { CreateWorkerDto } from '@workers/dto/create-worker.dto';

jest.mock('./workers.service');

describe('WorkersController', () => {
  let controller: WorkersController;
  let service: WorkersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkersController],
      providers: [WorkersService],
    }).compile();

    controller = module.get<WorkersController>(WorkersController);
    service = module.get<WorkersService>(WorkersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should call WorkersService.create with expected DTO', async () => {
      const dto = new CreateWorkerDto(); // Add necessary properties to match your DTO structure
      const mockWorker = { id: '123', ...dto }; // Mock response
      jest.spyOn(service, 'create').mockResolvedValue(mockWorker);

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockWorker);
    });
  });

  describe('findAll()', () => {
    it('should call WorkersService.findAll', async () => {
      const mockWorkers = [{ id: '123' }]; // Mock response
      jest.spyOn(service, 'findAll').mockResolvedValue(mockWorkers);

      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockWorkers);
    });
  });

  describe('findOne()', () => {
    it('should call WorkersService.findOne with expected ID', async () => {
      const id = '123';
      const mockWorker = { id: id }; // Mock response
      jest.spyOn(service, 'findOne').mockResolvedValue(mockWorker);

      const result = await controller.findOne(id); // Adjusted to pass ID correctly
      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockWorker);
    });
  });
});
