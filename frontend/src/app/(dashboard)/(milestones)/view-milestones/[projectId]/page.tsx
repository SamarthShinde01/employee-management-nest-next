"use client";

import { use, useMemo, useState } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
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
	flexRender,
	getCoreRowModel,
	useReactTable,
	ColumnDef,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/dashboard-header";
import { getMistoneById, deleteMilestone } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

const itemsPerPage = 10;

type typeParams = {
	params: Promise<{
		projectId: string;
	}>;
};

export default function ViewProjectMilestones({ params }: typeParams) {
	const { projectId } = use(params);

	const router = useRouter();
	const queryClient = useQueryClient();
	const [currentPage, setCurrentPage] = useState(1);

	const { data: milestonesData = [] } = useQuery({
		queryKey: ["milestones", projectId],
		queryFn: () => getMistoneById(projectId!),
		enabled: !!projectId,
	});

	console.log(milestonesData);

	const { mutate: removeMilestone } = useMutation({
		mutationFn: deleteMilestone,
		onSuccess: () => {
			toast.success("Milestone deleted");
			queryClient.invalidateQueries(["milestones"]);
		},
		onError: () => toast.error("Failed to delete milestone"),
	});

	const columns = useMemo<ColumnDef<any>[]>(
		() => [
			{
				header: "Sr No",
				cell: ({ row }) => (currentPage - 1) * itemsPerPage + row.index + 1,
			},
			{ accessorKey: "name", header: "Milestone Name" },
			{ accessorKey: "project.name", header: "Project Name" },
			{ accessorKey: "percentage", header: "Progress %" },
			{
				header: "Target Date",
				cell: ({ row }) => formatDate(row.original.targetDate),
			},
			{
				header: "Achieved Date",
				cell: ({ row }) =>
					row.original.achievedDate
						? formatDate(row.original.achievedDate)
						: "-",
			},
			{
				header: "Actions",
				cell: ({ row }) => (
					<div className="flex gap-2">
						<Button
							variant="outline"
							onClick={() => router.push(`/milestones-edit/${row.original.id}`)}
						>
							Edit
						</Button>
						<Button
							variant="destructive"
							onClick={() => removeMilestone(row.original.id)}
						>
							Delete
						</Button>
					</div>
				),
			},
		],
		[currentPage, removeMilestone]
	);

	const table = useReactTable({
		data: milestonesData,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const totalPages = Math.ceil(milestonesData?.length / itemsPerPage);
	const currentRows = table
		.getRowModel()
		.rows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	return (
		<>
			<DashboardHeader
				title="Milestones"
				pageName="Add Milestone"
				link="/milestones/add"
			/>

			<div className="p-4">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold">Milestones</h2>
				</div>

				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{flexRender(
											header.column.columnDef.header,
											header.getContext()
										)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{currentRows.length > 0 ? (
							currentRows.map((row) => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>

				{totalPages > 1 && (
					<Pagination className="mt-4">
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									href="#"
									onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
								/>
							</PaginationItem>
							{Array.from({ length: totalPages }, (_, i) => (
								<PaginationItem key={i}>
									<PaginationLink
										href="#"
										isActive={currentPage === i + 1}
										onClick={() => setCurrentPage(i + 1)}
									>
										{i + 1}
									</PaginationLink>
								</PaginationItem>
							))}
							<PaginationItem>
								<PaginationNext
									href="#"
									onClick={() =>
										setCurrentPage((p) => Math.min(p + 1, totalPages))
									}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				)}
			</div>
		</>
	);
}
