import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';
import { format, startOfDay } from 'date-fns';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async findAllExpenses() {
    const expenses = await this.prisma.expense.findMany({
      where: { isDeleted: false },
      include: {
        department: { select: { name: true } },
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            empId: true,
            email: true,
          },
        },
        expenseCategory: { select: { name: true } },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return expenses;
  }

  async findOneExpense(expenseId: string) {
    const expense = await this.prisma.expense.findFirst({
      where: { isDeleted: false, id: expenseId },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        product: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!expense) {
      throw new NotFoundException('Expense does not exists');
    }

    return expense;
  }

  async createExpense(data: CreateExpenseDto) {
    const {
      departmentId,
      employeeId,
      expenseCatId,
      productId,
      amount,
      quantity,
      total,
      date,
      notes,
      productName,
    } = data;

    const finalExpenseCatId = expenseCatId === 'other' ? null : expenseCatId;

    const expense = await this.prisma.expense.create({
      data: {
        departmentId,
        employeeId,
        expenseCatId: finalExpenseCatId,
        productId,
        amount,
        quantity,
        total,
        date,
        notes,
        productName,
      },
    });

    return expense;
  }

  async updateExpense(expenseId: string, data: any) {
    const request = data;

    const expense = await this.prisma.expense.findUnique({
      where: { isDeleted: false, id: expenseId },
    });

    if (!expense) {
      throw new NotFoundException('Expense does not exists');
    }

    const updatedExpense = await this.prisma.expense.update({
      where: { id: expenseId },
      data: {
        departmentId: request.departmentId || expense.departmentId,
        employeeId: request.employeeId || expense.employeeId,
        expenseCatId: request.expenseCatId || expense.expenseCatId,
        productId: request.productId || expense.productId,
        amount: request.amount || expense.amount,
        quantity: request.quantity || expense.quantity,
        total: request.total || expense.total,
        date: new Date(request.date) || expense.date,
        notes: request.notes || expense.notes,
      },
    });

    if (!updatedExpense) {
      throw new BadRequestException('Expense is not updated');
    }

    return updatedExpense;
  }

  async deleteExpense(expenseId: string) {
    const expense = await this.prisma.expense.findFirst({
      where: { isDeleted: false, id: expenseId },
    });

    if (!expense) {
      throw new NotFoundException('Expense does not exists');
    }

    await this.prisma.expense.update({
      where: { isDeleted: false, id: expenseId },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    return { message: 'Expense deleted successfully' };
  }

  async allEmployeeExpenses(employeeId: string) {
    const expenses = await this.prisma.expense.findMany({
      where: { isDeleted: false, employeeId },
      include: {
        department: { select: { name: true } },
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        expenseCategory: { select: { name: true } },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return expenses;
  }

  async chartDataExpenses() {
    const expenses = await this.prisma.expense.findMany({
      where: { isDeleted: false, productName: null },
      select: {
        date: true,
        total: true,
        product: {
          select: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const groupedData: Record<string, Record<string, number>> = {};

    for (const expense of expenses) {
      const dateKey = format(startOfDay(expense.date), 'yyyy-MM-dd');
      const category = expense.product?.category?.name ?? 'Uncategorized';

      if (!groupedData[dateKey]) {
        groupedData[dateKey] = {};
      }

      if (!groupedData[dateKey][category]) {
        groupedData[dateKey][category] = 0;
      }

      groupedData[dateKey][category] += parseFloat(expense.total as any); // if total is Decimal
    }

    const chartData = Object.entries(groupedData).map(([date, categories]) => ({
      date,
      ...categories,
    }));

    return chartData;
  }

  async pieChartData() {
    const expenses = await this.prisma.expense.findMany({
      where: {
        isDeleted: false,
        department: {
          isDeleted: false,
        },
      },
      select: {
        total: true,
        department: {
          select: {
            name: true,
          },
        },
      },
    });

    const totalsByDepartment = {};

    for (const expense of expenses) {
      const deptName = expense.department.name;

      if (!totalsByDepartment[deptName]) {
        totalsByDepartment[deptName] = 0;
      }
      // @ts-expect-error
      totalsByDepartment[deptName] += parseFloat(expense.total);
    }

    const chartData = Object.entries(totalsByDepartment).map(
      ([department, total]) => ({
        department,
        total,
      }),
    );

    return chartData;
  }
}
