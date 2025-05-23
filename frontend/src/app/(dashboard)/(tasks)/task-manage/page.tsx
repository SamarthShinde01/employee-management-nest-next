"use client";

import React, { useState, useMemo, useRef } from "react";
import {
	useReactTable,
	getCoreRowModel,
	getPaginationRowModel,
	ColumnDef,
	flexRender,
	ColumnFiltersState,
	getFilteredRowModel,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
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
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { getDepartments, getUsers } from "@/lib/api";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, DownloadIcon } from "lucide-react";
import { useDownloadExcel } from "react-export-table-to-excel";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/DatePicker";
import { formatDate } from "@/lib/utils";
import FilterCombobox from "@/components/FilterCombobox";
import { useRouter } from "next/navigation";

export default function TaskManagePage() {
	const exportTableRef = useRef(null);
	const router = useRouter();
	const itemsPerPage = 5;
	const [currentPage, setCurrentPage] = useState(1);
	const [globalFilterValue, setGlobalFilterValue] = useState("");
	const [dateRange, setDateRange] = useState<DateRange | undefined>();
	const [selectedDapartmentValue, setSelectedDepartmentValue] =
		useState<string>("");
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);

	const { onDownload } = useDownloadExcel({
		currentTableRef: exportTableRef.current,
		filename: "Tasks table",
		sheet: "Tasks",
	});

	const { data: departmentsData } = useQuery({
		queryKey: ["departments"],
		queryFn: getDepartments,
	});

	const {
		data: employees = [],
		isPending,
		isError,
	} = useQuery({ queryKey: ["employeesData"], queryFn: getUsers });

	const handleViewTasks = (userId: string) => {
		router.push(`/view-tasks/${userId}`);
	};

	const columns: ColumnDef<any>[] = [
		{
			header: "Sr No",
			cell: ({ row }) => row.index + 1,
		},
		{
			accessorKey: "empId",
			header: "Emp ID",
		},
		{
			header: "Employee Name",
			cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
		},
		{
			accessorKey: "email",
			header: "Employee Email",
		},
		{
			header: "Phone No",
			cell: ({ row }) => row.original.phone,
		},
		{
			header: "Department",
			cell: ({ row }) => row.original.department?.name || "-",
		},
		{
			header: "Created At",
			cell: ({ row }) => formatDate(row.original.createdAt),
		},
		{
			header: "Actions",
			cell: ({ row }) => (
				<Button
					variant="outline"
					className="text-blue-600"
					onClick={() => handleViewTasks(row.original.id)}
				>
					View Tasks
				</Button>
			),
		},
	];

	const filteredData = useMemo(() => {
		if (!employees) return [];
		// @ts-ignore
		let filtered = [...employees];

		// 🔹 Filter by department
		if (selectedDapartmentValue) {
			filtered = filtered.filter(
				(employee: any) => employee.departmentId === selectedDapartmentValue
			);
		}

		// 🔹 Filter by date range
		if (dateRange?.from && dateRange?.to) {
			const from = new Date(dateRange.from);
			const to = new Date(dateRange.to);
			to.setUTCHours(23, 59, 59, 999); // End of day

			filtered = filtered.filter((employee: any) => {
				const createdAt = new Date(employee.createdAt);
				return createdAt >= from && createdAt <= to;
			});
		}

		// 🔹 Filter by search value
		const search = globalFilterValue.toLowerCase();
		if (search) {
			filtered = filtered.filter((employee: any) => {
				const values = [
					employee.empId,
					`${employee.firstName} ${employee.lastName})`,
					employee.email,
					employee.phone,
					employee.department?.name,
					employee.jobTitle,
					employee.status,
				];

				return values.join(" ").toLowerCase().includes(search);
			});
		}

		return filtered;
	}, [employees, selectedDapartmentValue, dateRange, globalFilterValue]);

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

	if (isPending) return <>Loading...</>;
	if (isError) return <>Error loading employees.</>;

	return (
		<>
			<DashboardHeader
				title="Tasks"
				link="/task-manage"
				pageName="Manage Tasks"
			/>

			<div className="flex flex-col gap-4 p-4 pt-0">
				<h1 className="text-xl font-bold">Task Manage</h1>
				<div className="rounded-xl bg-muted/50 p-4 min-h-[100vh] md:min-h-min">
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
								dropwdownLabel="Select Department" // @ts-ignore
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

					{totalPages > 1 && (
						<Pagination>
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
			</div>

			<table ref={exportTableRef} className="hidden">
				<thead>
					<tr>
						<th>Sr No</th>
						<th>Emp ID</th>
						<th>Employee Name</th>
						<th>Email</th>
						<th>Phone Number</th>
						<th>Department</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					{paginatedData.map((row: any, index: number) => (
						<tr key={row.id}>
							<td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
							<td>{row.empId}</td>
							<td>
								{row.firstName} {row.lastName}
							</td>
							<td>{row.email}</td>
							<td>{row.phone}</td>
							<td>{row.jobTitle}</td>
							<td>{row.status}</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
}
