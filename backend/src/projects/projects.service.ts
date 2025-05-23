import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import puppeteer from 'puppeteer';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAllProjects() {
    const projects = await this.prisma.project.findMany({
      where: { isDeleted: false },
      include: {
        projectAssignments: {
          select: {
            employeeId: true,
            role: true,
          },
        },
      },
    });

    const projectsWithMilestoneData = await Promise.all(
      projects.map(async (project) => {
        const milestones = await this.prisma.milestone.findMany({
          where: { projectId: project.id, isDeleted: false },
          select: {
            percentage: true,
            achievedDate: true,
          },
        });

        const totalMilestonePercentage = milestones.reduce(
          (acc, m) => acc + (m.percentage || 0),
          0,
        );

        const totalAchievedPercentage = milestones.reduce(
          (acc, m) => acc + (m.achievedDate ? m.percentage || 0 : 0),
          0,
        );

        const totalRemainingPercentage = Math.max(
          0,
          100 - totalAchievedPercentage,
        );

        return {
          ...project,
          totalMilestonePercentage,
          totalAchievedPercentage,
          totalRemainingPercentage,
        };
      }),
    );

    return projectsWithMilestoneData;
  }

  async findOne(projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, isDeleted: false },
      include: {
        projectAssignments: {
          select: {
            employeeId: true,
            role: true,
            assignedAt: true,
            employee: {
              select: {
                firstName: true,
                lastName: true,
                jobTitle: true,
                profileImage: true,
              },
            },
          },
        },
        costAllocations: {
          select: {
            id: true,
            category: {
              select: {
                id: true,
                name: true,
              },
            },
            allocatedAmount: true,
            description: true,
          },
        },
        milestones: {
          select: {
            id: true,
            name: true,
            targetDate: true,
            achievedDate: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project does not exists');
    }

    return project;
  }

  async createProject(data: any) {
    const {
      name,
      clientName,
      description,
      startDate,
      endDate,
      budget,
      status,
      employeeIds,
      costAllocations,
    } = data as {
      name: string;
      clientName?: string;
      description?: string;
      startDate: string;
      endDate: string;
      budget: number;
      status?: string;
      employeeIds: string[];
      costAllocations: {
        categoryId: string;
        allocatedAmount: number;
        description?: string;
      }[];
    };

    if (!Array.isArray(employeeIds) || employeeIds.length === 0) {
      throw new BadRequestException('At least one employee must be assigned');
    }

    if (!Array.isArray(costAllocations) || costAllocations.length === 0) {
      throw new BadRequestException(
        'At least one cost allocation must be assigned',
      );
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          name,
          clientName,
          description,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          budget,
          status,
        },
      });

      const assignedEmployees = await Promise.all(
        employeeIds.map((employeeId) =>
          tx.projectAssignment.create({
            data: {
              projectId: project.id,
              employeeId,
            },
          }),
        ),
      );

      const allocations = await Promise.all(
        costAllocations.map((alloc) =>
          tx.costAllocation.create({
            data: {
              projectId: project.id,
              categoryId: alloc.categoryId,
              allocatedAmount: alloc.allocatedAmount,
              description: alloc.description || '',
            },
          }),
        ),
      );

      return { project, assignedEmployees, allocations };
    });

    return result;
  }

  async updateProject(projectId: string, data: any) {
    const {
      name,
      clientName,
      description,
      startDate,
      endDate,
      budget,
      status,
      employeeIds,
      costAllocations,
    } = data as {
      name?: string;
      clientName?: string;
      description?: string;
      startDate?: string;
      endDate?: string;
      budget?: number;
      status?: string;
      employeeIds?: string[];
      costAllocations?: {
        categoryId?: string;
        allocatedAmount?: string | number | undefined;
        description?: string;
      }[];
    };

    const project = await this.prisma.project.findFirst({
      where: { id: projectId, isDeleted: false },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedProject = await tx.project.update({
        where: { id: projectId },
        data: {
          name: name ?? project.name,
          clientName: clientName ?? project.clientName,
          description: description ?? project.description,
          startDate: startDate ? new Date(startDate) : project.startDate,
          endDate: endDate ? new Date(endDate) : project.endDate,
          budget: budget ?? project.budget,
          status: status ?? project.status,
        },
      });

      let updatedAssignments: any[] = [];

      if (Array.isArray(employeeIds)) {
        await tx.projectAssignment.deleteMany({ where: { projectId } });

        updatedAssignments = await Promise.all(
          employeeIds.map((employeeId) =>
            tx.projectAssignment.create({
              data: {
                projectId,
                employeeId,
              },
            }),
          ),
        );
      }

      let updatedCostAllocations: any[] = [];

      if (Array.isArray(costAllocations)) {
        await tx.costAllocation.deleteMany({ where: { projectId } });

        updatedCostAllocations = await Promise.all(
          costAllocations.map((costAllocation) =>
            tx.costAllocation.create({
              data: {
                projectId: project.id,
                categoryId: costAllocation.categoryId,
                // @ts-expect-error: allocatedAmount is validated to always exist
                allocatedAmount: costAllocation.allocatedAmount,
                description: costAllocation.description || '',
              },
            }),
          ),
        );
      }

      return { updatedProject, updatedAssignments, updatedCostAllocations };
    });

    return result;
  }

  async deleteProject(projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, isDeleted: false },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.prisma.$transaction(async (tx) => {
      const projectDeleted = await tx.project.update({
        where: { id: projectId },
        data: { isDeleted: true },
      });
      const assignedEmployeesDeleted = await tx.projectAssignment.updateMany({
        where: { projectId },
        data: { isDeleted: true },
      });
      const costAllocationsDeleted = await tx.costAllocation.updateMany({
        where: { projectId },
        data: { isDeleted: true },
      });

      return {
        projectDeleted,
        assignedEmployeesDeleted,
        costAllocationsDeleted,
      };
    });

    return { menubar: 'Project deleted successfully' };
  }

  async projectStatus(projectId: string, data: { status: string }) {
    const { status } = data;

    const project = await this.prisma.project.findFirst({
      where: { id: projectId, isDeleted: false },
    });
    if (!projectId || !project) {
      throw new NotFoundException('project does not exists');
    }

    const updateStatus = await this.prisma.project.update({
      where: { id: projectId, isDeleted: false },
      data: { status },
    });

    return { message: `Status updated to ${updateStatus.status}` };
  }

  async generatePdf(data: { html: any }, res) {
    const { html } = data;

    if (!html) {
      return res.status(400).send('No HTML provided');
    }

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // Set content from HTML string
    await page.setContent(html, {
      waitUntil: 'networkidle0', // wait until fully loaded
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=project-info.pdf',
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  }
}
