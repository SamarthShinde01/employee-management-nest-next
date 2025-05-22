import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  dob: string;

  @ApiProperty()
  jobTitle: string;

  @ApiProperty()
  salary: number;

  @ApiProperty()
  hireDate: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  pincode: string;

  @ApiProperty({ enum: ['USER', 'ADMIN'] })
  role: 'USER' | 'ADMIN';

  @ApiProperty({ required: false })
  departmentId?: string;

  @ApiProperty({ required: false })
  profileImage?: string;
}
