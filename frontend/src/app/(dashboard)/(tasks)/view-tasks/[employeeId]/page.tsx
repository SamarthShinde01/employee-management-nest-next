"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import DashboardHeader from "@/components/dashboard-header";
import { useQuery } from "@tanstack/react-query";
import { getUserById, viewEmployeeTasks } from "@/lib/api";
import { CheckCircle, Hourglass, Loader, TimerOffIcon } from "lucide-react";
import { format } from "date-fns";
import DOMPurify from "dompurify";
import { useRouter } from "next/navigation";

export default function ViewTasksPage({
	params,
}: {
	params: { employeeId: string };
}) {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 15;
	const employeeId = params.employeeId;
	const router = useRouter();

	const { data: employee, isLoading: employeeLoading } = useQuery({
		queryKey: ["employee", employeeId],
		queryFn: () => getUserById(employeeId!),
		enabled: !!employeeId,
	});

	const { data: tasksData } = useQuery({
		queryKey: ["tasks", employeeId],
		queryFn: () => viewEmployeeTasks(employeeId!),
	});

	const [isEmployeeLoading] = useState(false);
	const [isTasksLoading] = useState(false);

	const [isEmployeeError] = useState(false);
	const [isTasksError] = useState(false);

	if (isEmployeeLoading || isTasksLoading) {
		return <>Loading...</>;
	}

	if (isEmployeeError) {
		return <>Error loading employee details.</>;
	}

	if (isTasksError) {
		return <>Error loading tasks.</>;
	}

	const handleBack = () => {
		router.push("/task-manage");
	};
	// @ts-ignore
	const paginatedData = tasksData?.tasks?.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	); // @ts-ignore
	const totalPages = Math.ceil(tasksData?.tasks?.length / itemsPerPage);

	return (
		<>
			<DashboardHeader
				title="Task Details"
				link="/task-manage"
				pageName="Tasks Overview"
			/>

			<div className="flex flex-col p-6 gap-6">
				<div className="flex flex-col md:flex-row p-6 gap-6 bg-muted/50 rounded-lg shadow-md border">
					{/* Profile Section */}
					<div className="flex-shrink-0">
						<Avatar className="h-20 w-20">
							<AvatarImage
								src={
									// @ts-ignore
									`${process.env.NEXT_PUBLIC_API_URL}/uploads/images/${employee?.profileImage}` ||
									"https://github.com/shadcn.png"
								} // @ts-ignore
								alt={`${employee?.firstName} ${employee?.lastName}`}
							/>
							<AvatarFallback>
								{
									// @ts-ignore
									employee?.firstName?.[0]
								}
								{
									// @ts-ignore
									employee?.lastName?.[0]
								}
							</AvatarFallback>
						</Avatar>
					</div>

					{/* Info and Cards Section */}
					<div className="flex-grow flex flex-col gap-4">
						{employeeLoading ? (
							<h2 className="text-2xl font-semibold">Loading...</h2>
						) : (
							<>
								<div>
									<h2 className="text-2xl font-semibold">
										{
											// @ts-ignore
											employee?.firstName
										}
										{
											// @ts-ignore
											employee?.lastName
										}
									</h2>
									<p className="text-lg text-white">
										{
											// @ts-ignore
											employee?.email
										}
									</p>
									<p className="text-white">
										{
											// @ts-ignore
											employee?.phone
										}
									</p>
									<p className="text-white">
										{
											// @ts-ignore
											employee?.jobTitle
										}
									</p>
								</div>

								{/* Task Status Cards */}
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
									{/* Pending Tasks */}
									<div className="bg-muted/50 rounded-xl shadow-md p-6 flex items-center gap-4 border border-yellow-300">
										<div className="p-3 bg-yellow-100 rounded-full">
											<Hourglass className="h-6 w-6 text-yellow-600" />
										</div>
										<div>
											<h3 className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
												Tasks Pending
											</h3>
											<p className="text-2xl font-bold text-yellow-700">
												{
													// @ts-ignore
													tasksData?.taskStatusCounts?.PENDING ?? 0
												}
											</p>
										</div>
									</div>

									{/* In Progress Tasks */}
									<div className="bg-muted/50 rounded-xl shadow-md p-6 flex items-center gap-4 border border-blue-300">
										<div className="p-3 bg-blue-100 rounded-full">
											<Loader className="h-6 w-6 text-blue-600" />
										</div>
										<div>
											<h3 className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
												In Progress
											</h3>
											<p className="text-2xl font-bold text-blue-700">
												{
													// @ts-ignore
													tasksData?.taskStatusCounts?.IN_PROGRESS ?? 0
												}
											</p>
										</div>
									</div>

									{/* Completed Tasks */}
									<div className="bg-muted/50 rounded-xl shadow-md p-6 flex items-center gap-4 border border-green-300">
										<div className="p-3 bg-green-100 rounded-full">
											<CheckCircle className="h-6 w-6 text-green-600" />
										</div>
										<div>
											<h3 className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
												Completed
											</h3>
											<p className="text-2xl font-bold text-green-700">
												{
													// @ts-ignore
													tasksData?.taskStatusCounts?.COMPLETED ?? 0
												}
											</p>
										</div>
									</div>
								</div>
							</>
						)}
					</div>

					{/* Back Button */}
					<Button
						variant="outline"
						onClick={handleBack}
						className="self-center md:self-start"
					>
						Back to Employees
					</Button>
				</div>

				<div className="p-6 bg-muted/50  rounded-lg shadow-md">
					<h3 className="text-xl font-semibold mb-4">Assigned Tasks</h3>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Sr No</TableHead>
								<TableHead>Project Name</TableHead>
								<TableHead>Task Name</TableHead>
								<TableHead>Assigned Date/Time</TableHead>
								<TableHead>Completed Date/Time</TableHead>
								<TableHead>Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{paginatedData?.length === 0 ? (
								<TableRow>
									<TableCell colSpan={2} className="text-center">
										No tasks assigned to this employee.
									</TableCell>
								</TableRow>
							) : (
								// @ts-ignore
								paginatedData?.map((task: any, index: number) => (
									<TableRow key={task.id}>
										<TableCell>{index + 1}</TableCell>
										<TableCell>{task?.project?.name || "-"}</TableCell>
										<TableCell>
											<div
												className="prose max-w-none"
												dangerouslySetInnerHTML={{
													__html: DOMPurify.sanitize(task.name),
												}}
											/>
										</TableCell>
										<TableCell>
											{format(
												new Date(task.createdAt),
												"MMM dd, yyyy - hh:mm a"
											)}
										</TableCell>
										<TableCell>
											{task.completedAt ? (
												format(
													new Date(task.completedAt),
													"MMM dd, yyyy - hh:mm a"
												)
											) : (
												<div className="flex items-center pl-15">
													<TimerOffIcon width={15} height={15} />
												</div>
											)}
										</TableCell>
										<TableCell>
											<Badge // @ts-ignore
												variant={
													task.status === "COMPLETED"
														? "success"
														: task.status === "PENDING"
														? "info"
														: "danger"
												}
											>
												{task.status}
											</Badge>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
					{totalPages > 1 && (
						<Pagination className="mt-4">
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										href="#"
										onClick={() =>
											setCurrentPage((prev) => Math.max(prev - 1, 1))
										}
									/>
								</PaginationItem>

								{Array.from({ length: totalPages }).map((_, idx) => (
									<PaginationItem key={idx}>
										<PaginationLink
											href="#"
											isActive={currentPage === idx + 1}
											onClick={() => setCurrentPage(idx + 1)}
										>
											{idx + 1}
										</PaginationLink>
									</PaginationItem>
								))}

								<PaginationItem>
									<PaginationNext
										href="#"
										onClick={() =>
											setCurrentPage((prev) => Math.min(prev + 1, totalPages))
										}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					)}
				</div>
			</div>
		</>
	);
}
