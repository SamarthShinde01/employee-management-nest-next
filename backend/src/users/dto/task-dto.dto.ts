import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TaskNameDto {
  @ApiProperty({ example: 'Fix UI bugs' })
  @IsString()
  name: string;
}

export class AssignTaskDto {
  @ApiProperty({ example: 'employee-uuid-123' })
  @IsString()
  employeeId: string;

  @ApiProperty({ type: [TaskNameDto], description: 'Array of tasks to assign' })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TaskNameDto)
  tasks: TaskNameDto[];

  @ApiPropertyOptional({ example: 'project-uuid-456' })
  @IsOptional()
  @IsString()
  projectId?: string;
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export class UpdateTaskStatusDto {
  @ApiProperty({ example: 'task-uuid-789' })
  @IsString()
  @IsNotEmpty()
  taskId: string;

  @ApiProperty({ example: 'PENDING', enum: TaskStatus })
  @IsString()
  @IsIn(Object.values(TaskStatus))
  status: TaskStatus;
}

export class TaskStatusCountDto {
  @ApiProperty({ example: 5 })
  PENDING: number;

  @ApiProperty({ example: 3 })
  IN_PROGRESS: number;

  @ApiProperty({ example: 7 })
  COMPLETED: number;
}
