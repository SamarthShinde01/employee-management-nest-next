import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import {
  AssignTaskDto,
  TaskStatusCountDto,
  UpdateTaskStatusDto,
} from './dto/task-dto.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { basename, extname } from 'path';
import { Express } from 'express';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { DashboardCountsDto } from './dto/all-counts.dto';
import { User } from '@prisma/client';
import { DeleteUserResponseDto } from './dto/delete-user.dto';
import { AssignTaskResponseDto } from './dto/assign-task.dto';
import { ViewAssignedTaskResponseDto } from './dto/view-task.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @UseInterceptors(
    FileInterceptor('profileImage', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
  ) {
    const imagePath = file?.path ? basename(file.path) : undefined;
    return this.usersService.createUser({
      ...createUserDto,
      profileImage: imagePath ?? undefined,
    });
  }

  @Get('/all-counts')
  @ApiOperation({ summary: 'get all counts' })
  @ApiOkResponse({
    description: 'Dashboard summary counts',
    type: DashboardCountsDto,
  })
  async allCounts(): Promise<DashboardCountsDto> {
    return this.usersService.getAllCounts();
  }

  @Get()
  @ApiOperation({ summary: 'get all users' })
  @ApiOkResponse({
    description: 'List of all users',
    type: [UserResponseDto],
  })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'get user by id' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
  @ApiOkResponse({ type: UserResponseDto, description: 'User found' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @Put('/update/:id')
  @ApiOperation({ summary: 'Update the user' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete user' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID to delete' })
  @ApiOkResponse({
    type: DeleteUserResponseDto,
    description: 'User deleted successfully',
  })
  async remove(@Param('id') id: string): Promise<DeleteUserResponseDto> {
    return this.usersService.deleteUser(id);
  }

  //Task assign controllers
  @Post('assign-task')
  @ApiOperation({ summary: 'Assign task' })
  @ApiBody({ type: AssignTaskDto })
  @ApiOkResponse({
    type: AssignTaskResponseDto,
    description: 'Tasks assigned successfully',
  })
  async assignTask(@Body() body: AssignTaskDto) {
    return this.usersService.assignTask(body);
  }

  @Get('/view-task/:employeeId')
  @ApiOperation({ summary: 'View assigned tasks' })
  @ApiParam({
    name: 'employeeId',
    type: 'string',
    description: 'Employee ID to fetch tasks',
  })
  @ApiOkResponse({
    type: ViewAssignedTaskResponseDto,
    description: 'Tasks fetched successfully',
  })
  async viewAssignedTasks(
    @Param('employeeId') employeeId: string,
  ): Promise<ViewAssignedTaskResponseDto> {
    return this.usersService.viewAssignedTask(employeeId);
  }

  @Put('/update-status/:employeeId')
  @ApiOperation({ summary: 'Update task status' })
  @ApiResponse({ status: 201, description: 'Task updated successfully' })
  @ApiOperation({ summary: 'udpate task status' })
  async updateTaskStatus(
    @Param('employeeId') employeeId: string,
    @Body() data: UpdateTaskStatusDto,
  ) {
    return this.usersService.updateTaskStatus(employeeId, data);
  }

  @Get('/task-counts/:employeeId')
  @ApiOperation({ summary: 'tasks count' })
  @ApiOkResponse({
    type: TaskStatusCountDto,
    description: 'Tasks count fetched successfully',
  })
  async getTaskStatusCount(@Param('employeeId') employeeId: string) {
    return this.usersService.taskStatusCount(employeeId);
  }
}
