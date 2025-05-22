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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	ChevronDown,
	DownloadIcon,
	MoreHorizontal,
	UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import DeleteAlertDialog from "@/components/delete-alert-dialog";
import ViewUserDialog from "@/components/ViewUserDialog";
import {
	getUsers,
	deleteUser as deleteEmployeeApi,
	getDepartments,
} from "@/lib/api";
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
import FilterCombobox from "@/components/FilterCombobox";
import { useRouter } from "next/navigation";

export default function EmployeesManagePage() {
	const exportTableRef = useRef(null);
	const router = useRouter();
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedDapartmentValue, setSelectedDepartmentValue] =
		useState<string>("");
	const itemsPerPage = 10;
	const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
	const [selectedUser, setSelectedUser] = useState<any>(null);
	const [viewOpen, setViewOpen] = useState(false);
	const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
	const [globalFilterValue, setGlobalFilterValue] = useState("");
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [dateRange, setDateRange] = useState<DateRange | undefined>();

	const { data: departmentsData } = useQuery({
		queryKey: ["departments"],
		queryFn: getDepartments,
	});

	const { onDownload } = useDownloadExcel({
		currentTableRef: exportTableRef.current,
		filename: "Employees table",
		sheet: "Employees",
	});

	const {
		data: employees = [],
		isPending,
		isError,
	} = useQuery({ queryKey: ["employees"], queryFn: getUsers });

	const { mutate: deleteEmployee } = useMutation({
		mutationFn: deleteEmployeeApi,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["employees"] });
			toast.success("User deleted successfully!");
			setDeleteUserId(null);
			setConfirmDeleteOpen(false);
		},
		onError: (error) => {
			console.error("Delete failed:", error);
			toast.error("Failed to delete user.");
		},
	});

	const handleEdit = (user: any) => router.push(`/employees-edit/${user.id}`);

	const handleDelete = (userId: string) => {
		setDeleteUserId(userId);
		setConfirmDeleteOpen(true);
	};

	const handleConfirmDelete = () => {
		if (deleteUserId) deleteEmployee(deleteUserId);
	};

	const columns = useMemo<ColumnDef<any>[]>(
		() => [
			{
				header: "Sr No",
				cell: ({ row }) => (currentPage - 1) * itemsPerPage + row.index + 1,
			},
			{
				accessorKey: "empId",
				header: "Emp ID",
			},
			{
				accessorKey: "profileImage",
				header: "Profile",
				cell: ({ row }) => {
					const { profileImage, firstName, lastName } = row.original;
					return (
						<Avatar className="h-10 w-10">
							<AvatarImage
								src={
									`${process.env.NEXT_PUBLIC_API_URL}/uploads/images/${profileImage}` ||
									"https://github.com/shadcn.png"
								}
								alt={`${firstName} ${lastName}`}
								className="object-cover"
							/>
							<AvatarFallback>
								{firstName?.[0]}
								{lastName?.[0]}
							</AvatarFallback>
						</Avatar>
					);
				},
			},
			{
				header: "Full Name",
				cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
			},
			{
				accessorKey: "email",
				header: "Email",
			},
			{
				accessorKey: "phone",
				header: "Phone Number",
			},
			{
				header: "Department",
				cell: ({ row }) => row.original.department?.name || "-",
			},
			{
				accessorKey: "jobTitle",
				header: "Job Title",
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
				id: "search",
				accessorFn: (row) =>
					`${row.firstName} ${row.lastName} ${row.email} ${row.phone} ${row.jobTitle} ${row.status}`.toLowerCase(),
				enableColumnFilter: true,
				header: () => null,
				cell: () => null,
				enableHiding: false,
			},
			{
				accessorKey: "View Info",
				cell: ({ row }) => (
					<Button
						variant="outline"
						className="text-blue-600 bg-slate-200"
						onClick={() => {
							setSelectedUser(row.original);
							setViewOpen(true);
						}}
					>
						<UserIcon />
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
		[currentPage, itemsPerPage]
	);

	const filteredData = useMemo(() => {
		let filtered = [...employees];

		// Filter by department
		if (selectedDapartmentValue) {
			filtered = filtered.filter(
				(employee: any) => employee.departmentId === selectedDapartmentValue
			);
		}

		// Filter by date range
		if (dateRange?.from && dateRange?.to) {
			const from = new Date(dateRange.from);
			const to = new Date(dateRange.to);
			to.setUTCHours(23, 59, 59, 999);

			filtered = filtered.filter((employee: any) => {
				const createdAt = new Date(employee.createdAt);
				return createdAt >= from && createdAt <= to;
			});
		}

		return filtered;
	}, [employees, selectedDapartmentValue, dateRange]);

	const totalPages = useMemo(
		() => Math.ceil(filteredData.length / itemsPerPage),
		[filteredData, itemsPerPage]
	);

	const paginatedData = useMemo(() => {
		const start = (currentPage - 1) * itemsPerPage;
		const end = start + itemsPerPage;
		return filteredData.slice(start, end);
	}, [filteredData, currentPage, itemsPerPage]);

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
	if (isError) return <>Error loading employees.</>;

	return (
		<>
			<DashboardHeader
				title="Employees"
				link="/employees-manage"
				pageName="Manage Employees"
			/>
			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				<h1 className="text-xl font-bold">Employees Manage</h1>
				<div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4">
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-4">
						<div className="flex-1">
							<Input
								placeholder="Search ..."
								value={globalFilterValue}
								onChange={(event) => {
									const value = event.target.value.toLowerCase();
									setGlobalFilterValue(value);
									table.getColumn("search")?.setFilterValue(value);
								}}
								className="max-w-sm"
							/>
						</div>

						<div className="flex items-center gap-2 mt-2 md:mt-0">
							<FilterCombobox
								dropdownName="Department"
								dropwdownLabel="Select Department"
								items={departmentsData}
								value={selectedDapartmentValue}
								onValueChange={setSelectedDepartmentValue}
							/>
							<DatePickerWithRange onChange={(range) => setDateRange(range)} />
							<Button variant="outline" onClick={onDownload}>
								<DownloadIcon />
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
										.filter((column) => column.getCanHide())
										.map((column) => (
											<DropdownMenuCheckboxItem
												key={column.id}
												className="capitalize"
												checked={column.getIsVisible()}
												onCheckedChange={(value) =>
													column.toggleVisibility(!!value)
												}
											>
												{column.id}
											</DropdownMenuCheckboxItem>
										))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
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
						<th>Emp ID</th>
						<th>Full Name</th>
						<th>Email</th>
						<th>Phone Number</th>
						<th>Job Title</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					{paginatedData.map((employee: any, index: number) => (
						<tr key={employee.id}>
							<td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
							<td>{employee.empId}</td>
							<td>
								{employee.firstName} {employee.lastName}
							</td>
							<td>{employee.email}</td>
							<td>{employee.phone}</td>
							<td>{employee.jobTitle}</td>
							<td>{employee.status}</td>
						</tr>
					))}
				</tbody>
			</table>

			<ViewUserDialog
				selectedUser={selectedUser}
				isViewModalOpen={viewOpen}
				setIsViewModalOpen={setViewOpen}
			/>

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
