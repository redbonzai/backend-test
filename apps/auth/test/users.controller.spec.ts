// users.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '@auth/users/users.controller';
import { UsersService } from '@auth/users/users.service';
import { CreateUserDto } from '@auth/users/dto/create-user.dto';
import { UpdateUserDto } from '@auth/users/dto/update-user.dto';
import { Types } from 'mongoose';
import { UserDocument } from '@auth/users/models';

jest.mock('@auth/users/users.service');

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser()', () => {
    it('should call UsersService.create with expected DTO', async () => {
      const dto = new CreateUserDto();
      await controller.createUser(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll()', () => {
    it('should call UsersService.findAll', async () => {
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('getCurrentUser()', () => {
    it('should return the current user', async () => {
      const id: Types.ObjectId = new Types.ObjectId();
      const userDocument: Partial<UserDocument> = {
        _id: id, // Mocked _id
        email: 'test@example.com',
        password: 'secret',
      };

      // Use the mocked document as the current user
      const result = await controller.getCurrentUser(
        userDocument as UserDocument,
      );
      expect(result).toEqual(userDocument);
    });
  });

  describe('findOne()', () => {
    it('should call UsersService.findOne with expected ID', async () => {
      const id = 'testId';
      await controller.findOne(id);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update()', () => {
    it('should call UsersService.update with expected parameters', async () => {
      const id = new Types.ObjectId();
      const updateDto = new UpdateUserDto();
      await controller.update(id, updateDto);
      expect(service.update).toHaveBeenCalledWith(
        expect.any(Object),
        updateDto,
      );
    });
  });
});
