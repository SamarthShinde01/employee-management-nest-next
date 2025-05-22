import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { MilestonesService } from './milestones.service';
import { CreateMilestoneDto, UpdateMilestoneDto } from './dto/milestone.dto';

@Controller('api/milestones')
export class MilestonesController {
  constructor(private milestonesService: MilestonesService) {}

  @Get()
  async findAll() {
    return this.milestonesService.findAllMilestones();
  }

  @Get('/milestone-by-milestoneId/:milestoneId')
  async findByMilestoneId(@Param('milestoneId') milestoneId: string) {
    return this.milestonesService.findOneByMilestoneId(milestoneId);
  }

  @Get(':projectId')
  async findByProjectId(@Param('projectId') projectId: string) {
    return this.milestonesService.findAllByProjectId(projectId);
  }

  @Post()
  async create(@Body() data: CreateMilestoneDto) {
    return this.milestonesService.createMilestone(data);
  }

  @Put('/update/:milestoneId')
  async update(
    @Param('milestoneId') milestoneId: string,
    @Body()
    data: UpdateMilestoneDto,
  ) {
    return this.milestonesService.updateMilestone(milestoneId, data);
  }

  @Delete(':milestoneId')
  async remove(@Param('milestoneId') milestoneId: string) {
    return this.milestonesService.deleteMilestone(milestoneId);
  }

  @Get('/charts/radial-chart')
  async radialChart() {
    return this.milestonesService.radialChartMilestones();
  }
}
