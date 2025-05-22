import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ExpenseCategory } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExpenseCategoryService {
  constructor(private prisma: PrismaService) {}

  async findAllExpenseCat(): Promise<ExpenseCategory[]> {
    const expenseCategories = await this.prisma.expenseCategory.findMany({
      where: { isDeleted: false },
    });

    return expenseCategories;
  }

  async findOneExpenseCat(expenseId: string): Promise<ExpenseCategory> {
    const expenseCat = await this.prisma.expenseCategory.findFirst({
      where: { id: expenseId, isDeleted: false },
    });

    if (!expenseCat) {
      throw new BadRequestException('Expense category does not exist');
    }

    return expenseCat;
  }

  async createExpenseCat(data: { name: string }): Promise<ExpenseCategory> {
    const { name } = data;

    const expenseCategoryExist = await this.prisma.expenseCategory.findFirst({
      where: { isDeleted: false, name },
    });

    if (expenseCategoryExist) {
      throw new BadRequestException(
        'Expense Category with this name already exists',
      );
    }

    const expenseCategory = await this.prisma.expenseCategory.create({
      data: { name },
    });

    return expenseCategory;
  }

  async updateeExpenseCat(
    expenseId: string,
    data: { name: string },
  ): Promise<ExpenseCategory> {
    const { name } = data;

    const expenseCategoryExist = await this.prisma.expenseCategory.findFirst({
      where: { isDeleted: false, id: expenseId },
    });

    if (!name) {
      throw new BadRequestException(
        'Insert the Expense Category name to update',
      );
    }

    if (!expenseCategoryExist) {
      throw new NotFoundException('Expense category does not exists');
    }

    const expenseCat = await this.prisma.expenseCategory.update({
      where: { id: expenseId },
      data: { name },
    });

    return expenseCat;
  }

  async deleteExpenseCat(expenseId: string) {
    const expenseCategoryExist = await this.prisma.expenseCategory.findFirst({
      where: { isDeleted: false, id: expenseId },
    });

    if (!expenseCategoryExist) {
      throw new NotFoundException('Expense category does not exists');
    }

    await this.prisma.expenseCategory.update({
      where: { isDeleted: false, id: expenseId },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    return { message: 'Expense Category deleted successfully' };
  }
}
