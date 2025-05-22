// project.dto.ts

import {
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

class CostAllocationDto {
  @IsString()
  categoryId: string;

  @IsNumber({}, { message: 'allocatedAmount must be a valid number' })
  allocatedAmount: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateProjectWithAllocationsDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  clientName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsNumber({}, { message: 'Budget must be a valid number' })
  budget: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one employee must be assigned' })
  @IsString({ each: true })
  employeeIds: string[];

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one cost allocation must be assigned' })
  @ValidateNested({ each: true })
  @Type(() => CostAllocationDto)
  costAllocations: CostAllocationDto[];
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  clientName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Budget must be a valid number' })
  budget?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  employeeIds?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CostAllocationDto)
  costAllocations?: CostAllocationDto[];
}
