import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('api/projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  async findAll() {
    return this.projectsService.findAllProjects();
  }

  @Get(':projectId')
  async findOne(@Param('projectId') projectId: string) {
    return this.projectsService.findOne(projectId);
  }

  @Post('/create')
  async create(@Body() data: any) {
    return this.projectsService.createProject(data);
  }

  @Put('/update/:projectId')
  async update(@Param('projectId') projectId: string, @Body() data: any) {
    return this.projectsService.updateProject(projectId, data);
  }

  @Delete('/delete/:projectId')
  async remove(@Param('projectId') projectId: string) {
    return this.projectsService.deleteProject(projectId);
  }

  @Put('/status/:projectId')
  async status(
    @Param('projectId') projectId: string,
    data: { status: string },
  ) {
    return this.projectsService.projectStatus(projectId, data);
  }
}
