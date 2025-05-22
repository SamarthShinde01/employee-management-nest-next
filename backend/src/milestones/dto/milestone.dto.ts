// milestone.dto.ts

import { IsString, IsInt, IsDateString, IsOptional } from 'class-validator';

export class CreateMilestoneDto {
  @IsString()
  name: string;

  @IsInt()
  percentage: number;

  @IsString()
  description: string;

  @IsDateString()
  targetDate: string; // ISO format string

  @IsOptional()
  @IsDateString()
  achievedDate?: string;

  @IsString()
  projectId: string;
}

export class UpdateMilestoneDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  percentage?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  targetDate?: string;

  @IsOptional()
  @IsDateString()
  achievedDate?: string;

  @IsOptional()
  @IsString()
  projectId?: string;
}
