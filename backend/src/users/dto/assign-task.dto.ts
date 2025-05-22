import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class TaskInput {
  @ApiProperty({ example: 'Fix bugs in module' })
  @IsNotEmpty()
  name: string;
}

export class AssignTaskDto {
  @ApiProperty({ example: 'user-uuid-string' })
  @IsUUID()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ type: [TaskInput] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskInput)
  tasks: TaskInput[];

  @ApiProperty({ example: 'project-uuid-string', required: false })
  @IsUUID()
  @IsOptional()
  projectId?: string;
}

export class AssignTaskResponseDto {
  @ApiProperty({ example: 'Tasks assigned successfully' })
  message: string;

  @ApiProperty({ example: 3 })
  count: number;
}
