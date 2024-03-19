import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from '@tasks/task.controller';
import { TaskService } from '@tasks/task.service';
import { CreateTaskDto } from '@tasks/dto/create-task.dto';
import { UpdateTaskDto } from '@tasks/dto/update-task.dto';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            updateCompletionStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should call TaskService.create with expected DTO', async () => {
      const dto = new CreateTaskDto();
      await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll()', () => {
    it('should call TaskService.findAll', async () => {
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('should call TaskService.findOne with expected ID', async () => {
      const id = 'someId';
      await controller.findOne(id);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('updateCompletionStatus()', () => {
    it('should call TaskService.updateCompletionStatus with expected parameters', async () => {
      const id = 'someId';
      const updateTaskDto = new UpdateTaskDto();
      await controller.updateCompletionStatus(id, updateTaskDto);
      expect(service.updateCompletionStatus).toHaveBeenCalledWith(id, updateTaskDto.completed);
    });
  });
});
