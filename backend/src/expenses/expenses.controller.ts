import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/expense.dto';

@Controller('api/expenses')
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Get('/chart-data')
  async chartData() {
    return this.expensesService.chartDataExpenses();
  }

  @Get('/pie-data')
  async pieData() {
    return this.expensesService.pieChartData();
  }

  @Get()
  async findAll() {
    return this.expensesService.findAllExpenses();
  }

  @Get(':expenseId')
  async findOne(@Param('expenseId') expenseId: string) {
    return this.expensesService.findOneExpense(expenseId);
  }

  @Get('/employee/:employeeId')
  async allEmployeeExpenses(@Param('employeeId') employeeId: string) {
    return this.expensesService.allEmployeeExpenses(employeeId);
  }

  @Post('/create')
  async create(@Body() data: CreateExpenseDto) {
    return this.expensesService.createExpense(data);
  }

  @Put('/update/:expenseId')
  async update(@Param('expenseId') expenseId: string, @Body() data: any) {
    return this.expensesService.updateExpense(expenseId, data);
  }

  @Delete('/delete/:expenseId')
  async remove(@Param('expenseId') expenseId: string) {
    return this.expensesService.deleteExpense(expenseId);
  }
}
