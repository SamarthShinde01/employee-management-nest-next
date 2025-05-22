import { Module } from '@nestjs/common';
import { ExpenseCategoryService } from './expense-category.service';
import { ExpenseCategoryController } from './expense-category.controller';

@Module({
  providers: [ExpenseCategoryService],
  controllers: [ExpenseCategoryController]
})
export class ExpenseCategoryModule {}
