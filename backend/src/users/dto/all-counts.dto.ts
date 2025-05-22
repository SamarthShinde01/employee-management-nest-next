import { ApiProperty } from '@nestjs/swagger';

class TaskStatusCountsDto {
  @ApiProperty({ example: 10 })
  PENDING: number;

  @ApiProperty({ example: 5 })
  IN_PROGRESS: number;

  @ApiProperty({ example: 15 })
  COMPLETED: number;
}

export class DashboardCountsDto {
  @ApiProperty({ example: 100 })
  totalEmployees: number;

  @ApiProperty({ example: 80 })
  activeEmployees: number;

  @ApiProperty({ example: 20 })
  inactiveEmployees: number;

  @ApiProperty({ type: TaskStatusCountsDto })
  taskStatusCounts: TaskStatusCountsDto;

  @ApiProperty({ example: 500000 })
  totalAnnualRevenue: number;

  @ApiProperty({ example: 12 })
  totalProjects: number;

  @ApiProperty({ example: 4 })
  totalDepartments: number;
}
