import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDocument } from '@tasks/models';
// import { JwtAuthGuard } from '@app/common/auth';
import { CreateTaskDto } from '@tasks/dto/create-task.dto';
import { AbstractDocument } from '@app/common/database';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto): Promise<TaskDocument> {
    console.log('TASKS REQUESTS: ', createTaskDto);
    return this.taskService.create(createTaskDto);
  }

  @Get()
  findAll(): Promise<AbstractDocument[]> {
    return this.taskService.findAll();
  }

  @Get('id')
  async findOne(@Param('id') id: string): Promise<AbstractDocument> {
    return await this.taskService.findOne(id);
  }
}
