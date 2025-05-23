"use client";

import DashboardHeader from "@/components/dashboard-header";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUser, updateStatus, viewEmployeeTasks } from "@/lib/api";
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
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { DownloadIcon, TimerOffIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import queryClient from "@/config/queryClient";
import { useRef, useState } from "react";
import DOMPurify from "dompurify";
import { useDownloadExcel } from "react-export-table-to-excel";
import { formatDate } from "@/lib/utils";

export const AUTH_QUERY_KEY = "auth";

const useAuth = (options = {}) => {
	const { data: user, ...rest } = useQuery({
		queryKey: [AUTH_QUERY_KEY],
		queryFn: getUser,
		staleTime: Infinity,
		...options,
	});

	return { user, ...rest };
};

export default function EmployeeTasksPage() {
	const exportTableRef = useRef(null);
	const [dialogOpenChange, setDialogOpenChange] = useState(false);
	const [updatedStatusName, setUpdatedStatusName] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 15;
	const { user } = useAuth(); // @ts-ignore
	const userId = user?.id;

	const { onDownload } = useDownloadExcel({
		currentTableRef: exportTableRef.current,
		filename: "Tasks table",
		sheet: "Tasks",
	});

	const {
		data: tasksData,
		isLoading,
		isError, // @ts-ignore
	} = useQuery({
		queryKey: ["tasks", userId],
		queryFn: () => (userId ? viewEmployeeTasks(userId) : []),
		enabled: !!user,
	});

	const { control, handleSubmit, setValue } = useForm();

	const { mutate: updateTaskStatus } = useMutation({
		mutationFn: updateStatus,
		onSuccess: () => {
			queryClient.invalidateQueries({
				// @ts-ignore
				queryKey: ["tasks", user?.id],
			});

			toast.success(
				`Task status updated to ${updatedStatusName.toLowerCase()}`
			);
			setDialogOpenChange(false);
		},
	});

	const onSubmit = (data: any) => {
		// @ts-ignore
		updateTaskStatus({ data, employeeId: user?.id });
	};

	if (isLoading) {
		return <div>Loading tasks...</div>;
	}

	if (isError) {
		return <div>Error loading tasks.</div>;
	}
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

			<div className="min-h-[100vh] p-4">
				<div className="p-4 bg-muted/50 rounded-lg shadow-md">
					<h3 className="text-lg font-semibold mb-4">Assigned Tasks</h3>

					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-4">
						<div className="flex-1">
							<Input placeholder="Search ..." className="max-w-sm" />
						</div>
						<div className="flex items-center gap-2 mt-2 md:mt-0">
							<Button variant="outline" onClick={onDownload}>
								<DownloadIcon />
								Export
							</Button>
						</div>
					</div>

					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Sr No</TableHead>
								<TableHead>Project Name</TableHead>
								<TableHead>Task Name</TableHead>
								<TableHead>Assigned Date</TableHead>
								<TableHead>Completed Date</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{
								// @ts-ignore
								tasksData?.length === 0 ? (
									<TableRow>
										<TableCell colSpan={4} className="text-center">
											No tasks assigned to this employee.
										</TableCell>
									</TableRow>
								) : (
									paginatedData?.map((task: any, index: any) => (
										<TableRow key={task.id}>
											<TableCell>{index + 1}</TableCell>
											<TableCell>{task?.project?.name}</TableCell>
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
											<TableCell>
												<Dialog
													open={dialogOpenChange}
													onOpenChange={setDialogOpenChange}
												>
													<DialogTrigger asChild>
														<Button
															variant="outline"
															className="text-blue-600 bg-slate-200"
															onClick={() => setValue("status", task.status)}
														>
															Update Status
														</Button>
													</DialogTrigger>

													<DialogContent className="sm:max-w-[425px]">
														<DialogHeader>
															<DialogTitle>Update Task Status</DialogTitle>
														</DialogHeader>

														<form onSubmit={handleSubmit(onSubmit)}>
															<Controller
																name="taskId"
																control={control}
																defaultValue={task?.id}
																render={({ field }) => (
																	<Input
																		type="hidden" // @ts-ignore
																		value={field.value}
																		{...field}
																	/>
																)}
															/>
															<div className="grid gap-4 py-4">
																<div className="grid grid-cols-4 items-center gap-4">
																	<Label
																		htmlFor="status"
																		className="w-32 text-right pt-2"
																	>
																		Status
																	</Label>

																	<div className="flex-1 space-y-1">
																		<Controller
																			control={control}
																			name="status"
																			render={({ field }) => (
																				<Select
																					// onValueChange={field.onChange}
																					onValueChange={(value) => {
																						field.onChange(value);
																						setUpdatedStatusName(value);
																					}}
																					value={field.value}
																				>
																					<SelectTrigger>
																						<SelectValue placeholder="Select Status" />
																					</SelectTrigger>
																					<SelectContent>
																						<SelectGroup>
																							<SelectItem
																								value="PENDING"
																								className="bg-red-500"
																							>
																								PENDING
																							</SelectItem>
																							<SelectItem
																								value="IN_PROGRESS"
																								className="bg-yellow-300 text-black"
																							>
																								IN_PROGRESS
																							</SelectItem>
																							<SelectItem
																								value="COMPLETED"
																								className="bg-green-300 text-black"
																							>
																								COMPLETED
																							</SelectItem>
																						</SelectGroup>
																					</SelectContent>
																				</Select>
																			)}
																		/>
																	</div>
																</div>
															</div>

															<DialogFooter className="w-full">
																<Button className="w-full" type="submit">
																	Update Status
																</Button>
															</DialogFooter>
														</form>
													</DialogContent>
												</Dialog>
											</TableCell>
										</TableRow>
									))
								)
							}
						</TableBody>
					</Table>
					{totalPages > 1 && (
						<Pagination>
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

			<table ref={exportTableRef} className="hidden">
				<thead>
					<tr>
						<th>Sr No</th>
						<th>Task Name</th>
						<th>Assigned Date</th>
						<th>Completed Date</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					{
						// @ts-ignore
						tasksData?.tasks?.map((row: any, index: number) => (
							<tr key={row.id}>
								<td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
								<td>{row.name}</td>
								<td>{formatDate(row.createdAt)}</td>
								<td>{formatDate(row.completedAt) || ""}</td>
								<td>{row.status}</td>
							</tr>
						))
					}
				</tbody>
			</table>
		</>
	);
}
