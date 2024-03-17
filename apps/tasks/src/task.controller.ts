import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDocument } from '@tasks/models';
// import { JwtAuthGuard } from '@app/common/auth';
import { CreateTaskDto } from '@tasks/dto/create-task.dto';
import { AbstractDocument } from '@app/common/database';
import { Task } from '@tasks/interfaces';
import { UpdateTaskDto } from '@tasks/dto/update-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto): Promise<TaskDocument> {
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

  @Patch(':id/completion')
  async updateCompletionStatus(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    {
      return await this.taskService.updateCompletionStatus(
        id,
        updateTaskDto.completed,
      );
    }
  }
}
