import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ExpenseCategoryService } from './expense-category.service';

@Controller('api/expense-cat')
export class ExpenseCategoryController {
  constructor(private expenseCategoryService: ExpenseCategoryService) {}

  @Get()
  async findAll() {
    return this.expenseCategoryService.findAllExpenseCat();
  }

  @Get(':expenseId')
  async findOne(@Param('expenseId') expenseId: string) {
    return this.expenseCategoryService.findOneExpenseCat(expenseId);
  }

  @Post('/create')
  async create(@Body() data: { name: string }) {
    return this.expenseCategoryService.createExpenseCat(data);
  }

  @Put('/update/:expenseId')
  async update(
    @Param('expenseId') expenseId: string,
    @Body() data: { name: string },
  ) {
    return this.expenseCategoryService.updateeExpenseCat(expenseId, data);
  }

  @Delete('/delete/:expenseId')
  async remove(@Param('expenseId') expenseId: string) {
    return this.expenseCategoryService.deleteExpenseCat(expenseId);
  }
}
