// expense.dto.ts

import {
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  IsDateString,
  IsEnum,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

enum ExpenseStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class CreateExpenseDto {
  @IsString()
  departmentId: string;

  @IsString()
  employeeId: string;

  @IsOptional()
  @IsString()
  expenseCatId?: string;

  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsString()
  productName?: string;

  @IsNumber({}, { message: 'amount must be a valid number' })
  @Type(() => Number)
  amount: number;

  @IsInt()
  @Type(() => Number)
  quantity: number;

  @IsNumber({}, { message: 'total must be a valid number' })
  @Type(() => Number)
  total: number;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUrl({}, { message: 'receiptUrl must be a valid URL' })
  receiptUrl?: string;

  @IsOptional()
  @IsEnum(ExpenseStatus)
  status?: ExpenseStatus;

  @IsOptional()
  @IsString()
  projectId?: string;
}

export class UpdateExpenseDto {
  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @IsString()
  employeeId?: string;

  @IsOptional()
  @IsString()
  expenseCatId?: string;

  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  amount?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  quantity?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  total?: number;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUrl()
  receiptUrl?: string;

  @IsOptional()
  @IsEnum(ExpenseStatus)
  status?: ExpenseStatus;

  @IsOptional()
  @IsString()
  projectId?: string;
}
