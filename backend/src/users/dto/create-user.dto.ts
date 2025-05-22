import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsIn,
  IsString,
  IsPhoneNumber,
  IsDateString,
  IsNumber,
  IsUUID,
  IsPostalCode,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Samarth', required: true })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Shinde', required: true })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'rehmat.sayani@gmail.com', required: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '9898989898', required: true })
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('IN') // Country code
  phone: string;

  @ApiProperty({ example: '2000-01-01', required: true })
  @IsDateString()
  dob: string;

  @ApiProperty({ example: 'Software Developer', required: true })
  @IsNotEmpty()
  @IsString()
  jobTitle: string;

  @ApiProperty({ example: 50000, required: true })
  @IsNotEmpty()
  @IsNumber()
  salary: number;

  @ApiProperty({ example: '2023-10-01', required: true })
  @IsNotEmpty()
  @IsDateString()
  hireDate: string;

  @ApiProperty({ example: '123 Street, Area', required: true })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: 'Maharashtra', required: true })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({ example: 'Nashik', required: true })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ example: '422101', required: true })
  @IsNotEmpty()
  @IsPostalCode('IN')
  pincode: string;

  @ApiProperty({ example: 'strongpassword123', required: true })
  @IsNotEmpty()
  password: string;

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
