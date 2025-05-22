import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsDateString,
  IsNumber,
  IsUUID,
  IsIn,
  IsPostalCode,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Samarth' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Shinde' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: 'samarth@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'newStrongPassword123' })
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({ example: '9898989898' })
  @IsOptional()
  @IsString()
  @IsPhoneNumber('IN')
  phone?: string;

  @ApiPropertyOptional({ example: '2000-01-01' })
  @IsOptional()
  @IsDateString()
  dob?: string;

  @ApiPropertyOptional({ example: 'Software Developer' })
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @ApiPropertyOptional({ example: 50000 })
  @IsOptional()
  @IsNumber()
  salary?: number;

  @ApiPropertyOptional({ example: '2023-10-01' })
  @IsOptional()
  @IsDateString()
  hireDate?: string;

  @ApiPropertyOptional({ example: '123 Street, Area' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Maharashtra' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: 'Nashik' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: '422101' })
  @IsOptional()
  @IsPostalCode('IN')
  pincode?: string;

  @ApiPropertyOptional({ enum: ['USER', 'ADMIN'], example: 'USER' })
  @IsOptional()
  @IsIn(['USER', 'ADMIN'])
  role?: 'USER' | 'ADMIN';

  @ApiPropertyOptional({
    format: 'uuid',
    example: 'a65fa2c0-5c63-4d2f-a649-b9e3ad74f874',
  })
  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @ApiPropertyOptional({ example: 'https://example.com/profile.jpg' })
  @IsOptional()
  @IsString()
  profileImage?: string;
}
