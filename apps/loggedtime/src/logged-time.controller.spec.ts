import { Test, TestingModule } from '@nestjs/testing';
import { LoggedTimeController } from './logged-time.controller';
import { LoggedTimeService } from './logged-time.service';

describe('LoggedTimeController', () => {
  let loggedTimeController: LoggedTimeController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LoggedTimeController],
      providers: [LoggedTimeService],
    }).compile();

    loggedTimeController = app.get<LoggedTimeController>(LoggedTimeController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(loggedTimeController.getHello()).toBe('Hello World!');
    });
  });
});
