"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatINR } from "@/lib/utils";
import { Download, Printer } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { getProjectById } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import DashboardHeader from "@/components/dashboard-header";
import { useRef } from "react";
import axios from "axios";

const ProjectView = () => {
	const router = useRouter();
	const { projectId } = useParams<{ projectId: string }>();
	const printRef = useRef(null);

	const { data: project, isLoading } = useQuery({
		queryKey: ["project", projectId],
		queryFn: () => getProjectById(projectId!),
		enabled: !!projectId,
	});

	if (isLoading) return <div>Loading...</div>;
	if (!project) return <div>Project not found</div>;

	const handleDownloadPdf = async () => {
		if (!printRef.current) return;

		const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Project Report - ${project.name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
    
    body {
      font-family: 'Inter', sans-serif;
      color: #333;
      padding: 1.2rem;
      line-height: 1.4;
      font-size: 12px;
      background-color: #fff;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.8rem;
      padding-bottom: 0.8rem;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .project-title {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 0.2rem;
    }
    
    .client-name {
      font-size: 11px;
      color: #6b7280;
    }
    
    .status-badge {
      display: inline-block;
      padding: 0.2rem 0.5rem;
      border-radius: 9999px;
      font-size: 10px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .status-active {
      background-color: #ecfdf5;
      color: #059669;
    }
    
    .status-inactive {
      background-color: #fee2e2;
      color: #dc2626;
    }
    
    .project-description {
      margin: 0.8rem 0;
      color: #4b5563;
      font-size: 11px;
    }
    
    .details-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.6rem;
      margin-bottom: 1rem;
    }
    
    .detail-card {
      padding: 0.6rem;
      border-radius: 0.3rem;
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
    }
    
    .detail-label {
      font-size: 10px;
      color: #6b7280;
      margin-bottom: 0.2rem;
    }
    
    .detail-value {
      font-size: 12px;
      font-weight: 500;
      color: #111827;
    }
    
    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: #111827;
      margin: 0.8rem 0 0.6rem 0;
      padding-bottom: 0.3rem;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .team-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.6rem;
      margin-bottom: 1rem;
    }
    
    .team-member {
      display: flex;
      align-items: center;
      padding: 0.6rem;
      border-radius: 0.3rem;
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      min-height: 40px;
    }
    
    .member-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 0.6rem;
      background-color: #e5e7eb;
    }
    
    .member-name {
      font-weight: 500;
      font-size: 11px;
      margin-bottom: 0.1rem;
    }
    
    .member-role {
      font-size: 10px;
      color: #6b7280;
    }
    
    .member-assigned {
      font-size: 9px;
      color: #9ca3af;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1rem;
      font-size: 11px;
    }
    
    th {
      text-align: left;
      padding: 0.4rem 0.6rem;
      background-color: #f3f4f6;
      color: #374151;
      font-weight: 600;
      font-size: 10px;
    }
    
    td {
      padding: 0.4rem 0.6rem;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .total-row {
      background-color: #f3f4f6;
      font-weight: 600;
    }
    
    .milestone {
      margin-bottom: 0.6rem;
      padding-left: 0.6rem;
      border-left: 2px solid #3b82f6;
      font-size: 11px;
    }
    
    .milestone-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.1rem;
    }
    
    .milestone-name {
      font-weight: 500;
    }
    
    .milestone-status {
      font-size: 9px;
      padding: 0.15rem 0.4rem;
      border-radius: 9999px;
      font-weight: 500;
    }
    
    .status-achieved {
      background-color: #ecfdf5;
      color: #059669;
    }
    
    .status-pending {
      background-color: #eff6ff;
      color: #1d4ed8;
    }
    
    .milestone-date {
      color: #6b7280;
      font-size: 10px;
    }
    
    .footer {
      margin-top: 1rem;
      padding-top: 0.8rem;
      border-top: 1px solid #e5e7eb;
      font-size: 10px;
      color: #6b7280;
    }
    
    .compact-view {
      display: flex;
      gap: 1rem;
    }
    
    .left-column {
      flex: 2;
    }
    
    .right-column {
      flex: 1;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="project-title">${project.name}</h1>
      <p class="client-name">${project.clientName || "No client specified"}</p>
    </div>
    <span class="status-badge ${
			project.status === "ACTIVE" ? "status-active" : "status-inactive"
		}">
      ${project.status}
    </span>
  </div>
  
  ${
		project.description
			? `
    <div class="project-description">
      <p>${project.description}</p>
    </div>
  `
			: ""
	}
  
  <div class="details-grid">
    <div class="detail-card">
      <div class="detail-label">Start Date</div>
      <div class="detail-value">${formatDate(project.startDate)}</div>
    </div>
    <div class="detail-card">
      <div class="detail-label">End Date</div>
      <div class="detail-value">${formatDate(project.endDate)}</div>
    </div>
    <div class="detail-card">
      <div class="detail-label">Budget</div>
      <div class="detail-value">${formatINR(Number(project.budget))}</div>
    </div>
    <div class="detail-card">
      <div class="detail-label">Created At</div>
      <div class="detail-value">${formatDate(project.createdAt)}</div>
    </div>
  </div>
  
  <div class="compact-view">
    <div class="left-column">
      <h2 class="section-title">Team Members</h2>
      <div class="team-grid">
        ${project.projectAssignments
					?.map(
						(assignment: any) => `
          <div class="team-member">
            ${
							assignment.employee.profileImage
								? `
              <img 
                src="${process.env.NEXT_PUBLIC_API_URL}/uploads/images/${assignment.employee.profileImage}" 
                class="member-avatar"
                alt="${assignment.employee.firstName} ${assignment.employee.lastName}"
              />
            `
								: `
              <div class="member-avatar"></div>
            `
						}
            <div>
              <div class="member-name">${assignment.employee.firstName} ${
							assignment.employee.lastName
						}</div>
              <div class="member-role">${assignment.employee.jobTitle}</div>
              <div class="member-assigned">${formatDate(
								assignment.assignedAt
							)}</div>
            </div>
          </div>
        `
					)
					.join("")}
      </div>
      
      <h2 class="section-title">Budget Allocation</h2>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          ${project.costAllocations
						?.map(
							(allocation: any) => `
            <tr>
              <td>${allocation.category.name}</td>
              <td>${formatINR(Number(allocation.allocatedAmount))}</td>
              <td>${allocation.description || "-"}</td>
            </tr>
          `
						)
						.join("")}
          <tr class="total-row">
            <td>Total</td>
            <td>${formatINR(
							project.costAllocations?.reduce(
								(sum: number, item: any) => sum + Number(item.allocatedAmount),
								0
							) || 0
						)}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="right-column">
      ${
				project.milestones?.length > 0
					? `
        <h2 class="section-title">Milestones</h2>
        <div>
          ${project.milestones
						.map(
							(milestone: any) => `
            <div class="milestone">
              <div class="milestone-header">
                <div class="milestone-name">${milestone.name}</div>
                <span class="milestone-status ${
									milestone.achievedDate ? "status-achieved" : "status-pending"
								}">
                  ${milestone.achievedDate ? "✓" : "◯"}
                </span>
              </div>
              <div class="milestone-date">
                ${formatDate(milestone.targetDate)}
                ${
									milestone.achievedDate
										? `<br>Achieved: ${formatDate(milestone.achievedDate)}`
										: ""
								}
              </div>
            </div>
          `
						)
						.join("")}
        </div>
      `
					: ""
			}
    </div>
  </div>
  
  <div class="footer">
    <p>Project ID: ${project.id} | Last updated: ${formatDate(
			project.updatedAt
		)} | Generated: ${formatDate(new Date().toISOString())}</p>
  </div>
</body>
</html>
`;

		try {
			const response = await axios.post(
				"http://localhost:5001/api/projects/generate-pdf",
				{ html: htmlContent },
				{ responseType: "blob" }
			);

			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute(
				"download",
				`${project.name.replace(/\s+/g, "_")}_Summary.pdf`
			);
			document.body.appendChild(link);
			link.click();
			link.remove();
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Failed to download PDF:", error);
			alert("Failed to download PDF");
		}
	};

	return (
		<>
			<DashboardHeader
				title="Project Manage"
				pageName="View Project"
				link="/projects-manage"
			/>

			<div className="container mx-auto px-4">
				<div className="no-print flex justify-between items-center mb-6">
					<Button variant="outline" onClick={() => router.back()}>
						Back to Projects
					</Button>
					<div className="flex gap-2">
						<Button variant="outline" onClick={() => window.print()}>
							<Printer className="mr-2 h-4 w-4" />
							Print
						</Button>
						<Button variant="outline" onClick={handleDownloadPdf}>
							<Download className="mr-2 h-4 w-4" />
							Download PDF
						</Button>
					</div>
				</div>

				<div ref={printRef} className="bg-muted/50 p-6 rounded-lg shadow-sm">
					{/* Project Header */}
					<div className="border-b pb-6 mb-6 print-section">
						<div className="flex justify-between items-start">
							<div>
								<h1 className="text-3xl font-bold">
									{
										// @ts-ignore
										project.name
									}
								</h1>
								<p className="text-muted-foreground mt-1">
									{
										// @ts-ignore
										project.clientName
									}
								</p>
							</div>
							<Badge
								variant={
									// @ts-ignore
									project.status === "ACTIVE" ? "default" : "destructive"
								}
							>
								{project.status}
							</Badge>
						</div>
						<p className="mt-4 text-muted-foreground">
							{
								// @ts-ignore
								project.description
							}
						</p>
					</div>

					{/* Project Details Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 print-section">
						<div className="bg-gray-900 p-4 rounded-lg">
							<h3 className="text-sm font-medium text-gray-500">Start Date</h3>
							<p className="mt-1 font-medium">
								{
									// @ts-ignore
									formatDate(project.startDate)
								}
							</p>
						</div>
						<div className="bg-gray-900 p-4 rounded-lg">
							<h3 className="text-sm font-medium text-gray-500">End Date</h3>
							<p className="mt-1 font-medium">
								{
									// @ts-ignore
									formatDate(project.endDate)
								}
							</p>
						</div>
						<div className="bg-gray-900 p-4 rounded-lg">
							<h3 className="text-sm font-medium text-gray-500">Budget</h3>
							<p className="mt-1 font-medium">
								{
									// @ts-ignore
									formatINR(Number(project.budget))
								}
							</p>
						</div>
						<div className="bg-gray-900 p-4 rounded-lg">
							<h3 className="text-sm font-medium text-gray-500">Created At</h3>
							<p className="mt-1 font-medium">
								{
									// @ts-ignore
									formatDate(project.createdAt)
								}
							</p>
						</div>
					</div>

					{/* Team Members */}
					<div className="mb-8 print-section">
						<h2 className="text-xl font-semibold mb-4">Team Members</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{
								// @ts-ignore
								project.projectAssignments?.map((assignment: any) => (
									<div
										key={assignment.employeeId}
										className="border rounded-lg p-4 flex items-center"
									>
										{assignment.employee.profileImage && (
											<div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
												<Image
													src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/images/${assignment.employee.profileImage}`}
													alt={`${assignment.employee.firstName} ${assignment.employee.lastName}`}
													fill
													sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
													className="object-cover"
												/>
											</div>
										)}
										<div>
											<h3 className="font-medium">
												{assignment.employee.firstName}{" "}
												{assignment.employee.lastName}
											</h3>
											<p className="text-sm text-muted-foreground">
												{assignment.employee.jobTitle}
											</p>
											<p className="text-xs text-gray-500 mt-1">
												Assigned: {formatDate(assignment.assignedAt)}
											</p>
										</div>
									</div>
								))
							}
						</div>
					</div>

					{/* Cost Allocations */}
					<div className="mb-8 print-section">
						<h2 className="text-xl font-semibold mb-4">Budget Allocation</h2>
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-900">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-slate-100 uppercase tracking-wider">
											Category
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-slate-100 uppercase tracking-wider">
											Amount
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-slate-100 uppercase tracking-wider">
											Description
										</th>
									</tr>
								</thead>
								<tbody className="bg-muted/50 divide-y divide-gray-200">
									{
										// @ts-ignore
										project?.costAllocations?.map((allocation: any) => (
											<tr key={allocation.id}>
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-muted-foreground">
													{allocation.category.name}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
													{formatINR(Number(allocation.allocatedAmount))}
												</td>
												<td className="px-6 py-4 text-sm text-muted-foreground">
													{allocation.description}
												</td>
											</tr>
										))
									}
									<tr className="bg-gray-900">
										<td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
											Total
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
											{formatINR(
												// @ts-ignore
												project.costAllocations?.reduce(
													(sum: number, item: any) =>
														sum + Number(item.allocatedAmount),
													0
												) || 0
											)}
										</td>
										<td className="px-6 py-4 text-sm text-gray-500"></td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					{/* Milestones - Only show if there are milestones */}
					{
						// @ts-ignore
						project.milestones?.length > 0 && (
							<div className="print-section">
								<h2 className="text-xl font-semibold mb-4">
									Project Milestones
								</h2>
								<div className="space-y-4">
									{
										// @ts-ignore
										project?.milestones.map((milestone: any) => (
											<div
												key={milestone.id}
												className="border-l-4 border-blue-500 pl-4 py-2"
											>
												<div className="flex justify-between items-center">
													<h3 className="font-medium">{milestone.name}</h3>
													<Badge
														variant={
															milestone.achievedDate ? "default" : "secondary"
														}
													>
														{milestone.achievedDate ? "ACHIEVED" : "PENDING"}
													</Badge>
												</div>
												<p className="text-sm text-muted-foreground">
													Target: {formatDate(milestone.targetDate)}
												</p>
											</div>
										))
									}
								</div>
							</div>
						)
					}

					{/* Project Footer */}
					<div className="mt-8 pt-6 border-t text-sm text-gray-500 print-section">
						<p>
							Project ID:{" "}
							{
								// @ts-ignore
								project.id
							}
						</p>
						<p>
							Last updated:
							{
								// @ts-ignore
								formatDate(project.updatedAt)
							}
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default ProjectView;
