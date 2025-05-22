import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DepartmentsModule } from './departments/departments.module';
import { ExpenseCategoryModule } from './expense-category/expense-category.module';
import { ProductsModule } from './products/products.module';
import { MilestonesModule } from './milestones/milestones.module';
import { ProjectsModule } from './projects/projects.module';
import { ExpensesModule } from './expenses/expenses.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    DepartmentsModule,
    ExpenseCategoryModule,
    ProductsModule,
    MilestonesModule,
    ProjectsModule,
    ExpensesModule,
  ],
})
export class AppModule {}
