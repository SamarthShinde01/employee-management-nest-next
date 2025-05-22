import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';

@Controller('api/departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  async findAll() {
    return this.departmentsService.findAll();
  }

  @Get(':departmentId')
  async findOne(@Param('departmentId') departmentId: string) {
    return this.departmentsService.findOneDepartment(departmentId);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post('/create')
  async create(@Body() data: { name: string }) {
    return this.departmentsService.createDepartment(data);
  }

  @Put('/update/:departmentId')
  async update(
    @Param('departmentId') departmentId: string,
    @Body() data: { name: string },
  ) {
    return this.departmentsService.updateDepartment(departmentId, data);
  }

  @Delete('/delete/:departmentId')
  async remove(@Param('departmentId') departmentId: string) {
    return this.departmentsService.deleteDepartment(departmentId);
  }
}
