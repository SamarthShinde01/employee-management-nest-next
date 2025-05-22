import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, Role, TaskStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  AssignTaskDto,
  TaskStatusCountDto,
  UpdateTaskStatusDto,
} from './dto/task-dto.dto';
import { DashboardCountsDto } from './dto/all-counts.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { DeleteUserResponseDto } from './dto/delete-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) throw new Error('User already exists');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const count = await this.prisma.user.count({
      where: {
        empId: {
          not: null,
        },
      },
    });
    const newEmpId = `EMP-${1111 + count}`;

    return this.prisma.user.create({
      data: {
        empId: newEmpId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dob: new Date(data.dob),
        jobTitle: data.jobTitle,
        salary: data.salary,
        hireDate: new Date(data.hireDate),
        address: data.address,
        state: data.state,
        city: data.city,
        pincode: data.pincode,
        password: hashedPassword,
        profileImage: data.profileImage || undefined,
        departmentId: data.departmentId || undefined,
        role: data.role || Role.USER,
      },
    });
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { isDeleted: false, role: 'USER' },
      include: {
        department: {
          select: { name: true },
        },
        projectAssignments: {
          select: {
            projectId: true,
          },
        },
      },
    });
    return users;
  }

  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { isDeleted: false, id },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    const existingUser = await this.prisma.user.findFirst({
      where: { id, isDeleted: false },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Handle field updates with fallback to existing values
    const updatedData: any = {
      empId: existingUser.empId,
      firstName: data.firstName ?? existingUser.firstName,
      lastName: data.lastName ?? existingUser.lastName,
      email: data.email ?? existingUser.email,
      phone: data.phone ?? existingUser.phone,
      dob: data.dob ? new Date(data.dob) : existingUser.dob,
      departmentId: data.departmentId ?? existingUser.departmentId,
      jobTitle: data.jobTitle ?? existingUser.jobTitle,
      salary: data.salary ?? existingUser.salary,
      hireDate: data.hireDate ? new Date(data.hireDate) : existingUser.hireDate,
      address: data.address ?? existingUser.address,
      state: data.state ?? existingUser.state,
      city: data.city ?? existingUser.city,
      pincode: data.pincode ?? existingUser.pincode,
      role: data.role ?? existingUser.role,
      password: data.password
        ? await bcrypt.hash(data.password, 10)
        : existingUser.password,
    };

    return this.prisma.user.update({
      where: { id },
      data: updatedData,
    });
  }

  async deleteUser(id: string): Promise<DeleteUserResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: { id, isDeleted: false },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return { message: 'User deleted successfully' };
  }

  /****** Assign task services ****** */

  async assignTask(data: AssignTaskDto) {
    const { employeeId, tasks, projectId } = data;

    if (!employeeId || !Array.isArray(tasks) || tasks.length === 0) {
      throw new BadRequestException('employeeId and tasks are required');
    }

    const user = await this.prisma.user.findFirst({
      where: { id: employeeId, isDeleted: false },
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const taskData = tasks.map((task) => ({
      employeeId,
      name: task.name,
      status: TaskStatus.PENDING,
      projectId: projectId || null,
    }));

    const createdTasks = await this.prisma.task.createMany({
      data: taskData,
    });

    return {
      message: 'Tasks assigned successfully',
      count: createdTasks.count,
    };
  }

  async viewAssignedTask(employeeId: string): Promise<any> {
    const tasks = await this.prisma.task.findMany({
      where: { isDeleted: false, employeeId },
      include: {
        project: {
          select: { name: true },
        },
      },
    });

    if (!tasks) {
      throw new NotFoundException('tasks for this user does not exist');
    }

    const [pendingCount, inProgressCount, completedCount] = await Promise.all([
      this.prisma.task.count({
        where: {
          isDeleted: false,
          employeeId,
          status: 'PENDING',
        },
      }),
      this.prisma.task.count({
        where: {
          isDeleted: false,
          employeeId,
          status: 'IN_PROGRESS',
        },
      }),
      this.prisma.task.count({
        where: {
          isDeleted: false,
          employeeId,
          status: 'COMPLETED',
        },
      }),
    ]);

    return {
      tasks,
      taskStatusCounts: {
        PENDING: pendingCount,
        IN_PROGRESS: inProgressCount,
        COMPLETED: completedCount,
      },
    };
  }

  async updateTaskStatus(
    employeeId: string,
    data: UpdateTaskStatusDto,
  ): Promise<any> {
    const { taskId, status } = data;

    const user = await this.prisma.user.findUnique({
      where: { isDeleted: false, id: employeeId },
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const existingTask = await this.prisma.task.findFirst({
      where: {
        isDeleted: false,
        id: taskId,
        employeeId,
      },
    });

    if (!existingTask) {
      throw new NotFoundException('Task not found for the employee');
    }

    const statusEnum = status as any;
    const statusUpdated = await this.prisma.task.update({
      where: { id: taskId, isDeleted: false },
      data:
        status === TaskStatus.COMPLETED
          ? {
              status: statusEnum,
              completedAt: new Date(),
            }
          : {
              status: statusEnum,
              completedAt: null,
            },
    });

    return statusUpdated;
  }

  async taskStatusCount(employeeId: string): Promise<any> {
    const grouped = await this.prisma.task.groupBy({
      by: ['status'],
      where: { isDeleted: false, employeeId },
      _count: {
        status: true,
      },
    });

    const statusCounts = {
      PENDING: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
    };

    grouped.forEach((item: any) => {
      statusCounts[item.status] = item._count.status;
    });

    return statusCounts;
  }

  async getAllCounts(): Promise<DashboardCountsDto> {
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(`${currentYear}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${currentYear}-12-31T23:59:59.999Z`);

    const [
      taskGrouped,
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      annualRevenueResult,
      totalProjects,
      totalDepartments,
    ] = await Promise.all([
      this.prisma.task.groupBy({
        by: ['status'],
        _count: {
          status: true,
        },
        where: {
          isDeleted: false,
        },
      }),
      this.prisma.user.count({ where: { isDeleted: false, role: 'USER' } }),
      this.prisma.user.count({
        where: { isDeleted: false, role: 'USER', status: 'ACTIVE' },
      }),
      this.prisma.user.count({
        where: { isDeleted: false, role: 'USER', status: 'INACTIVE' },
      }),
      this.prisma.expense.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          createdAt: {
            gte: startOfYear,
            lte: endOfYear,
          },
        },
      }),
      this.prisma.project.count({ where: { isDeleted: false } }),
      this.prisma.department.count({ where: { isDeleted: false } }),
    ]);

    // Initialize with 0 in case any status is missing
    const statusCounts: Record<
      'PENDING' | 'IN_PROGRESS' | 'COMPLETED',
      number
    > = {
      PENDING: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
    };

    taskGrouped.forEach(
      ({
        status,
        _count,
      }: {
        status: TaskStatus;
        _count: { status: number };
      }) => {
        if (status in statusCounts) {
          statusCounts[status] = _count.status;
        }
      },
    );

    return {
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      taskStatusCounts: statusCounts,
      // @ts-expect-error: allocatedAmount is validated to always exist
      totalAnnualRevenue: annualRevenueResult._sum.amount ?? 0,
      totalProjects,
      totalDepartments,
    };
  }
}
