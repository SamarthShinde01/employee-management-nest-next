import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<any> {
    const departments = await this.prisma.department.findMany({
      where: { isDeleted: false },
    });

    return departments;
  }

  async findOneDepartment(departmentId: string): Promise<any> {
    const department = await this.prisma.department.findFirst({
      where: { id: departmentId, isDeleted: false },
    });

    if (!department) {
      throw new NotFoundException('Department does not exists');
    }

    return department;
  }

  async createDepartment(data: any): Promise<any> {
    const { name } = data;

    const departmentExist = await this.prisma.department.findUnique({
      where: { name },
    });

    if (departmentExist) {
      throw new BadRequestException('Department with this name already exists');
    }

    const department = await this.prisma.department.create({ data: { name } });

    return { message: 'Department created successfully', department };
  }

  async updateDepartment(
    departmentId: string,
    data: { name: string },
  ): Promise<any> {
    const { name } = data;

    const departmentExist = await this.prisma.department.findUnique({
      where: { isDeleted: false, id: departmentId },
    });

    if (!name) {
      throw new BadRequestException('Insert the department name to update');
    }

    if (!departmentExist) {
      throw new BadRequestException(
        'Department with this name does not exists',
      );
    }

    const department = await this.prisma.department.update({
      where: { id: departmentId, isDeleted: false },
      data: { name },
    });

    return { message: 'Department created successfully', department };
  }

  async deleteDepartment(departmentId: string): Promise<any> {
    const departmentExist = await this.prisma.department.findFirst({
      where: { id: departmentId, isDeleted: false },
    });

    if (!departmentExist) {
      throw new BadRequestException(
        'Department with this name does not exists',
      );
    }

    await this.prisma.department.update({
      where: { id: departmentId },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    return { message: 'Department deleted successfully' };
  }
}
