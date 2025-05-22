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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ProjectView = () => {
	const router = useRouter();
	const { projectId } = useParams<{ projectId: string }>();
	const contentRef = useRef<HTMLDivElement>(null);

	const { data: project, isLoading } = useQuery({
		queryKey: ["project", projectId],
		queryFn: () => getProjectById(projectId!),
		enabled: !!projectId,
	});

	if (isLoading) return <div>Loading...</div>;
	if (!project) return <div>Project not found</div>;

	const handleDownloadPDF = async () => {
		if (!contentRef.current) return;

		// Create a clone to modify
		const node = contentRef.current.cloneNode(true) as HTMLElement;
		node.classList.add("force-fallbacks");

		document.body.appendChild(node);

		try {
			const canvas = await html2canvas(node, {
				backgroundColor: "#ffffff",
				scale: 2, //For better quality
				useCORS: true,
			});

			const pdf = new jsPDF("p", "mm", "a4");
			const imgData = canvas.toDataURL("image/png");
			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

			pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
			pdf.save("project-details.pdf");
		} finally {
			document.body.removeChild(node);
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
						<Button variant="outline" onClick={handleDownloadPDF}>
							<Printer className="mr-2 h-4 w-4" />
							Print
						</Button>
						<Button variant="outline">
							<Download className="mr-2 h-4 w-4" />
							Export PDF
						</Button>
					</div>
				</div>

				<div ref={contentRef} className="bg-muted/50 p-6 rounded-lg shadow-sm">
					{/* Project Header */}
					<div className="border-b pb-6 mb-6 print-section">
						<div className="flex justify-between items-start">
							<div>
								<h1 className="text-3xl font-bold">{project.name}</h1>
								<p className="text-muted-foreground mt-1">
									{project.clientName}
								</p>
							</div>
							<Badge
								variant={
									project.status === "ACTIVE" ? "default" : "destructive"
								}
							>
								{project.status}
							</Badge>
						</div>
						<p className="mt-4 text-gray-700">{project.description}</p>
					</div>

					{/* Project Details Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 print-section">
						<div className="bg-gray-900 p-4 rounded-lg">
							<h3 className="text-sm font-medium text-gray-500">Start Date</h3>
							<p className="mt-1 font-medium">
								{formatDate(project.startDate)}
							</p>
						</div>
						<div className="bg-gray-900 p-4 rounded-lg">
							<h3 className="text-sm font-medium text-gray-500">End Date</h3>
							<p className="mt-1 font-medium">{formatDate(project.endDate)}</p>
						</div>
						<div className="bg-gray-900 p-4 rounded-lg">
							<h3 className="text-sm font-medium text-gray-500">Budget</h3>
							<p className="mt-1 font-medium">
								{formatINR(Number(project.budget))}
							</p>
						</div>
						<div className="bg-gray-900 p-4 rounded-lg">
							<h3 className="text-sm font-medium text-gray-500">Created At</h3>
							<p className="mt-1 font-medium">
								{formatDate(project.createdAt)}
							</p>
						</div>
					</div>

					{/* Team Members */}
					<div className="mb-8 print-section">
						<h2 className="text-xl font-semibold mb-4">Team Members</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{project.projectAssignments?.map((assignment: any) => (
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
												className="object-cover"
											/>
										</div>
									)}
									<div>
										<h3 className="font-medium">
											{assignment.employee.firstName}{" "}
											{assignment.employee.lastName}
										</h3>
										<p className="text-sm text-gray-600">
											{assignment.employee.jobTitle}
										</p>
										<p className="text-xs text-gray-500 mt-1">
											Assigned: {formatDate(assignment.assignedAt)}
										</p>
									</div>
								</div>
							))}
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
									{project?.costAllocations?.map((allocation: any) => (
										<tr key={allocation.id}>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-400">
												{allocation.category.name}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												{formatINR(Number(allocation.allocatedAmount))}
											</td>
											<td className="px-6 py-4 text-sm text-gray-500">
												{allocation.description}
											</td>
										</tr>
									))}
									<tr className="bg-gray-900">
										<td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
											Total
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
											{formatINR(
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
					{project.milestones?.length > 0 && (
						<div className="print-section">
							<h2 className="text-xl font-semibold mb-4">Project Milestones</h2>
							<div className="space-y-4">
								{project?.milestones.map((milestone: any) => (
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
										<p className="text-sm text-gray-600">
											Target: {formatDate(milestone.targetDate)}
										</p>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Project Footer */}
					<div className="mt-8 pt-6 border-t text-sm text-gray-500 print-section">
						<p>Project ID: {project.id}</p>
						<p>Last updated: {formatDate(project.updatedAt)}</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default ProjectView;
