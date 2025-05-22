import { IsString, IsOptional, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'basePrice must be a valid number' })
  basePrice?: number;

  @IsString()
  categoryId: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
