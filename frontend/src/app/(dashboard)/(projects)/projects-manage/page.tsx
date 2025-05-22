"use client";

import { useMemo, useRef, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
	useReactTable,
	getCoreRowModel,
	getPaginationRowModel,
	flexRender,
	ColumnDef,
	ColumnFiltersState,
	getFilteredRowModel,
} from "@tanstack/react-table";
import DashboardHeader from "@/components/dashboard-header";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, DownloadIcon, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import DeleteAlertDialog from "@/components/delete-alert-dialog";
import { getProjects, deleteProject } from "@/lib/api";
import queryClient from "@/config/queryClient";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useDownloadExcel } from "react-export-table-to-excel";
import { formatDate } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/DatePicker";
import { useRouter } from "next/navigation";

export default function ProjectsManagePage() {
	const exportTableRef = useRef(null);
	const router = useRouter();
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
	const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
	const [globalFilterValue, setGlobalFilterValue] = useState("");
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [dateRange, setDateRange] = useState<DateRange | undefined>();

	const {
		data: projectsData = [],
		isPending,
		isError,
	} = useQuery({
		queryKey: ["projects"],
		queryFn: getProjects,
	});

	const { onDownload } = useDownloadExcel({
		currentTableRef: exportTableRef.current,
		filename: "Project table",
		sheet: "Project",
	});

	const { mutate: deleteProjectById } = useMutation({
		mutationFn: deleteProject,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["projects"] });
			toast.success("User deleted successfully!");
			setDeleteProjectId(null);
			setConfirmDeleteOpen(false);
		},
		onError: (error) => {
			console.error("Delete failed:", error);
			toast.error("Failed to delete user.");
		},
	});

	const handleEdit = (project: any) =>
		router.push(`/projects-edit/${project.id}`);

	const handleDelete = (userId: string) => {
		setDeleteProjectId(userId);
		setConfirmDeleteOpen(true);
	};

	const handleConfirmDelete = () => {
		if (deleteProjectId) deleteProjectById(deleteProjectId);
	};

	const columns = useMemo<ColumnDef<any>[]>(
		() => [
			{
				header: "Sr No",
				cell: ({ row }) => (currentPage - 1) * itemsPerPage + row.index + 1,
			},
			{
				accessorKey: "name",
				header: "Project Name",
			},
			{
				header: "Start Date",
				cell: ({ row }) => formatDate(row.original.startDate),
			},
			{
				header: "End Date",
				cell: ({ row }) => formatDate(row.original.endDate),
			},
			{
				accessorKey: "status",
				header: "Status",
				cell: ({ row }) => (
					<Badge
						variant={
							row.original.status === "ACTIVE" ? "default" : "destructive"
						}
					>
						{row.original.status}
					</Badge>
				),
			},
			{
				header: "Info",
				cell: ({ row }) => (
					<Button
						variant="outline"
						onClick={() => router.replace(`/project-view/${row.original.id}`)}
					>
						View
					</Button>
				),
			},
			{
				header: "Created At",
				cell: ({ row }) => formatDate(row.original.createdAt),
			},
			{
				header: "Actions",
				cell: ({ row }) => (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => handleEdit(row.original)}>
								Edit
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => handleDelete(row.original.id)}
								className="text-red-600"
							>
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				),
			},
		],
		[currentPage]
	);

	const filteredData = useMemo(() => {
		let filtered = [...projectsData];

		if (dateRange?.from && dateRange?.to) {
			const from = new Date(dateRange.from);
			const to = new Date(dateRange.to);
			to.setUTCHours(23, 59, 59, 999);

			filtered = filtered.filter((project: any) => {
				const createdAt = new Date(project.createdAt);
				return createdAt >= from && createdAt <= to;
			});
		}

		if (globalFilterValue) {
			const lower = globalFilterValue.toLowerCase();
			filtered = filtered.filter((project: any) =>
				project.name.toLowerCase().includes(lower)
			);
		}

		return filtered;
	}, [projectsData, dateRange, globalFilterValue]);

	const totalPages = Math.ceil(filteredData.length / itemsPerPage);

	const paginatedData = useMemo(() => {
		const start = (currentPage - 1) * itemsPerPage;
		return filteredData.slice(start, start + itemsPerPage);
	}, [filteredData, currentPage]);

	const table = useReactTable({
		columns,
		data: paginatedData,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: { columnFilters },
	});

	const renderPagination = () => (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						href="#"
						onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
					/>
				</PaginationItem>
				{Array.from({ length: totalPages }, (_, idx) => (
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
	);

	if (isPending) return <>Loading...</>;
	if (isError) return <>Error loading projects.</>;

	return (
		<>
			<DashboardHeader title="Projects" link="/" pageName="Projects Manage" />
			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				<h1 className="text-xl font-bold">Projects Manage</h1>
				<div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4">
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-4">
						<Input
							placeholder="Search by project name..."
							value={globalFilterValue}
							onChange={(e) => setGlobalFilterValue(e.target.value)}
							className="max-w-sm"
						/>

						<div className="flex items-center gap-2 mt-2 md:mt-0">
							<DatePickerWithRange onChange={setDateRange} />
							<Button variant="outline" onClick={onDownload}>
								<DownloadIcon className="mr-2 h-4 w-4" />
								Export
							</Button>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" className="ml-auto">
										Columns <ChevronDown />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									{table
										.getAllColumns()
										.filter((col) => col.getCanHide())
										.map((col) => (
											<DropdownMenuCheckboxItem
												key={col.id}
												className="capitalize"
												checked={col.getIsVisible()}
												onCheckedChange={(value) =>
													col.toggleVisibility(!!value)
												}
											>
												{col.id}
											</DropdownMenuCheckboxItem>
										))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((group) => (
								<TableRow key={group.id}>
									{group.headers.map((header) => (
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
							{table.getRowModel().rows.map((row) => (
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
							))}
						</TableBody>
					</Table>
					{totalPages > 1 && renderPagination()}
				</div>
			</div>

			<table ref={exportTableRef} className="hidden">
				<thead>
					<tr>
						<th>Sr No</th>
						<th>Project Name</th>
						<th>Client Name</th>
						<th>Description</th>
						<th>Start Date</th>
						<th>End Date</th>
						<th>Budget</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					{paginatedData.map((project: any, index: number) => (
						<tr key={project.id}>
							<td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
							<td>{project.name}</td>
							<td>{project.clientName}</td>
							<td>{project.description}</td>
							<td>{formatDate(project.startDate)}</td>
							<td>{formatDate(project.endDate)}</td>
							<td>{project.budget}</td>
							<td>{project.status}</td>
						</tr>
					))}
				</tbody>
			</table>

			<DeleteAlertDialog
				open={confirmDeleteOpen}
				setOpen={setConfirmDeleteOpen}
				onConfirm={handleConfirmDelete}
				title="Delete this User?"
				description="This will permanently remove the user from the list."
			/>
		</>
	);
}
