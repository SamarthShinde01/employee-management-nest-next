import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Milestone } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMilestoneDto, UpdateMilestoneDto } from './dto/milestone.dto';

@Injectable()
export class MilestonesService {
  constructor(private prisma: PrismaService) {}

  async findAllMilestones(): Promise<Milestone[]> {
    const milestones = await this.prisma.milestone.findMany({
      where: { isDeleted: false },
      include: {
        project: {
          select: { id: true, name: true },
        },
      },
    });

    return milestones;
  }

  async findOneByMilestoneId(milestoneId: string): Promise<Milestone> {
    const milestone = await this.prisma.milestone.findFirst({
      where: { id: milestoneId, isDeleted: false },
      include: { project: true },
    });

    if (!milestone) {
      throw new NotFoundException('Milestone does not exist');
    }

    return milestone;
  }

  async findAllByProjectId(projectId: string): Promise<Milestone[]> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, isDeleted: false },
    });

    if (!project) {
      throw new NotFoundException('Project does not exist');
    }

    const milestones = await this.prisma.milestone.findMany({
      where: { projectId, isDeleted: false },
      include: { project: { select: { name: true } } },
    });

    if (milestones.length === 0) {
      throw new NotFoundException('No milestones found for this project');
    }

    return milestones;
  }

  async createMilestone(data: CreateMilestoneDto): Promise<Milestone> {
    const {
      projectId,
      name,
      percentage,
      description,
      targetDate,
      achievedDate,
    } = data;

    const milestoneExist = await this.prisma.milestone.findFirst({
      where: { name, projectId, isDeleted: false },
    });

    if (milestoneExist) {
      throw new BadRequestException(
        'Milestone with this name already exists in the project',
      );
    }

    // Check total percentage constraint
    const existingMilestones = await this.prisma.milestone.findMany({
      where: { projectId, isDeleted: false },
    });

    const totalPercentage = existingMilestones.reduce(
      (acc, m) => acc + m.percentage,
      0,
    );

    if (totalPercentage + percentage > 100) {
      throw new BadRequestException(
        `Cannot create milestone. Total milestone percentage for this project will exceed 100%. Currently used: ${totalPercentage}%.`,
      );
    }

    const milestone = await this.prisma.milestone.create({
      data: {
        projectId,
        name,
        percentage,
        description,
        targetDate,
        achievedDate,
      },
    });

    return milestone;
  }

  async updateMilestone(
    milestoneId: string,
    data: UpdateMilestoneDto,
  ): Promise<Milestone> {
    const request = data;

    const milestone = await this.prisma.milestone.findFirst({
      where: { id: milestoneId, isDeleted: false },
    });

    if (!milestone) {
      throw new NotFoundException('Milestone does not exist');
    }

    const newPercentage = request.percentage ?? milestone.percentage;

    // Get other milestones for this project excluding current
    const otherMilestones = await this.prisma.milestone.findMany({
      where: {
        projectId: milestone.projectId,
        isDeleted: false,
        NOT: { id: milestoneId },
      },
    });

    const totalOtherPercentage = otherMilestones.reduce(
      (acc, m) => acc + m.percentage,
      0,
    );

    if (totalOtherPercentage + newPercentage > 100) {
      throw new BadRequestException(
        `Cannot update milestone. Total percentage will exceed 100%. Used by other milestones: ${totalOtherPercentage}%.`,
      );
    }

    const updatedMilestone = await this.prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        projectId: request.projectId || milestone.projectId,
        name: request.name || milestone.name,
        percentage: newPercentage,
        description: request.description || milestone.description,
        targetDate: request.targetDate || milestone.targetDate,
        achievedDate: request.achievedDate || milestone.achievedDate,
      },
    });

    return updatedMilestone;
  }

  async deleteMilestone(milestoneId: string) {
    const milestone = await this.prisma.milestone.findFirst({
      where: { id: milestoneId, isDeleted: false },
    });

    if (!milestone) {
      throw new NotFoundException('Milestone does not exist');
    }

    await this.prisma.milestone.update({
      where: { id: milestoneId },
      data: { isDeleted: true },
    });

    return { message: 'Milestone deleted successfully' };
  }

  async radialChartMilestones() {
    // Get all projects that are not deleted
    const projects = await this.prisma.project.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        name: true,
        milestones: {
          where: { isDeleted: false },
          select: {
            percentage: true,
            achievedDate: true,
          },
        },
      },
    });

    // Map over projects to calculate achieved and remaining percentages
    const result = projects.map((project) => {
      const achievedPercentage = project.milestones
        .filter((m) => m.achievedDate !== null)
        .reduce((sum, m) => sum + m.percentage, 0);

      return {
        projectId: project.id,
        projectName: project.name,
        achievedPercentage,
        remainingPercentage: 100 - achievedPercentage,
      };
    });

    return result;
  }
}
