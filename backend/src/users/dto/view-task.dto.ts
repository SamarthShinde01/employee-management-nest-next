import { ApiProperty } from '@nestjs/swagger';

export class TaskProjectDto {
  @ApiProperty({ example: 'Project Apollo' })
  name: string;
}

export class TaskDto {
  @ApiProperty({ example: 'task-uuid' })
  id: string;

  @ApiProperty({ example: 'Fix bugs in UI' })
  name: string;

  @ApiProperty({
    example: 'PENDING',
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
  })
  status: string;

  @ApiProperty({ type: TaskProjectDto, description: 'Project details' })
  project: TaskProjectDto | null;
}

export class ViewAssignedTaskResponseDto {
  @ApiProperty({ type: [TaskDto] })
  tasks: TaskDto[];

  @ApiProperty({
    example: {
      PENDING: 2,
      IN_PROGRESS: 3,
      COMPLETED: 5,
    },
  })
  taskStatusCounts: {
    PENDING: number;
    IN_PROGRESS: number;
    COMPLETED: number;
  };
}
