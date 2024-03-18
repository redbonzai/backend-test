import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDocument } from '@tasks/models';
// import { JwtAuthGuard } from '@app/common/auth';
import { CreateTaskDto } from '@tasks/dto/create-task.dto';
import { AbstractDocument } from '@app/common/database';
import { Task } from '@tasks/interfaces';
import { UpdateTaskDto } from '@tasks/dto/update-task.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: 201,
    description: 'The task has been successfully created.',
    type: TaskDocument,
  })
  @ApiBody({ type: CreateTaskDto })
  create(@Body() createTaskDto: CreateTaskDto): Promise<TaskDocument> {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({
    status: 200,
    description: 'List of all tasks',
    type: AbstractDocument,
    isArray: true,
  })
  findAll(): Promise<AbstractDocument[]> {
    return this.taskService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific task by ID' })
  @ApiResponse({
    status: 200,
    description: 'Details of the specific task',
    type: AbstractDocument,
  })
  async findOne(@Param('id') id: string): Promise<AbstractDocument> {
    console.log('TASK BY ID: ', id);
    return await this.taskService.findOne(id);
  }

  @Patch(':id/completion')
  @ApiOperation({ summary: 'Update the completion status of a task' })
  @ApiResponse({
    status: 200,
    description: 'The task completion status has been updated.',
    type: Task,
  })
  @ApiParam({ name: 'id', type: 'string', description: 'Task ID' })
  @ApiBody({ type: UpdateTaskDto })
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
