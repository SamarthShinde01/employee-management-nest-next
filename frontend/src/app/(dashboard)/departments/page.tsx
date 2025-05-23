"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
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
	ColumnDef,
	flexRender,
	useReactTable,
	getCoreRowModel,
	ColumnFiltersState,
	getFilteredRowModel,
} from "@tanstack/react-table";
import DashboardHeader from "@/components/dashboard-header";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
	createDepartment,
	deleteDepartment,
	getDepartments,
	updateDepartment,
} from "@/lib/api";
import queryClient from "@/config/queryClient";
import { toast } from "sonner";
import { ChevronDown, DownloadIcon } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDownloadExcel } from "react-export-table-to-excel";
import { formatDate } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/DatePicker";

export default function DepartmentsPage() {
	const exportTableRef = useRef(null);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const [editSheetOpen, setEditSheetOpen] = useState(false);
	const [addSheetOpen, setAddSheetOpen] = useState(false);
	const [editDeptName, setEditDeptName] = useState("");
	const [editingId, setEditingId] = useState("");
	const [department, setDepartment] = useState("");
	const [dateRange, setDateRange] = useState<DateRange | undefined>();
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);

	const { onDownload } = useDownloadExcel({
		currentTableRef: exportTableRef.current,
		filename: "Departments table",
		sheet: "Departments",
	});

	const { data: departments = [], isLoading } = useQuery({
		queryKey: ["departments"],
		queryFn: getDepartments,
	});

	const { mutate: createDepartmentFunction } = useMutation({
		mutationFn: createDepartment,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["departments"] });
			toast.success("Department created successfully!");
			setAddSheetOpen(false);
			setDepartment("");
		},
		onError: () => toast.error("Failed to create department"),
	});

	const { mutate: updateDepartmentFunction } = useMutation({
		mutationFn: ({ id, name }: { id: string; name: string }) =>
			updateDepartment({ departmentId: id, data: { name } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["departments"] });
			toast.success("Department updated successfully!");
			setEditSheetOpen(false);
		},
		onError: () => toast.error("Failed to update department"),
	});

	const { mutate: deleteDepartmentFunction } = useMutation({
		mutationFn: deleteDepartment,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["departments"] });
			toast.success("Department deleted successfully!");
		},
		onError: () => toast.error("Failed to delete department"),
	});

	const submitDepartment = (e: React.FormEvent) => {
		e.preventDefault();
		if (!department.trim())
			return toast.error("Department name cannot be empty");
		createDepartmentFunction({ name: department });
	};

	const handleSaveEdit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!editDeptName.trim())
			return toast.error("Department name cannot be empty");
		updateDepartmentFunction({ id: editingId, name: editDeptName });
	};

	const handleEdit = useCallback((dept: { id: string; name: string }) => {
		setEditingId(dept.id);
		setEditDeptName(dept.name);
		setEditSheetOpen(true);
	}, []);

	const columns: ColumnDef<any>[] = useMemo(
		() => [
			{
				header: "Sr No",
				cell: ({ row }) => (currentPage - 1) * itemsPerPage + row.index + 1,
			},
			{
				accessorKey: "name",
				header: "Department",
				cell: ({ row }) => row.original.name,
			},
			{
				accessorKey: "createdAt",
				header: "Created Date",
				cell: ({ row }) => formatDate(row.original.createdAt),
			},
			{
				header: "Actions",
				cell: ({ row }) => (
					<div className="flex gap-2">
						<Button variant="outline" onClick={() => handleEdit(row.original)}>
							Edit
						</Button>
						<Button
							variant="destructive"
							onClick={() => {
								if (
									window.confirm(
										"Are you sure you want to delete this department?"
									)
								) {
									deleteDepartmentFunction(row.original.id);
								}
							}}
						>
							Delete
						</Button>
					</div>
				),
			},
		],
		[currentPage, handleEdit, deleteDepartmentFunction]
	);

	// Filter products by date range
	const filteredData = useMemo(() => {
		if (!dateRange?.from || !dateRange?.to) return departments;

		const from = new Date(dateRange.from);
		const to = new Date(dateRange.to);
		to.setUTCHours(23, 59, 59, 999); // Ensure we include entire day
		// @ts-ignore
		return departments?.filter((department: any) => {
			const createdAt = new Date(department.createdAt);
			return createdAt >= from && createdAt <= to;
		});
	}, [departments, dateRange]);

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
		data: paginatedData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			columnFilters,
		},
	});

	if (isLoading) {
		return (
			<div className="flex justify-center p-8">Loading departments...</div>
		);
	}

	return (
		<>
			<DashboardHeader
				title="Departments"
				link="/departments"
				pageName="Manage Departments"
			/>

			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				{/* Page Top Bar */}
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-bold">Departments</h1>
					<Sheet open={addSheetOpen} onOpenChange={setAddSheetOpen}>
						<SheetTrigger asChild>
							<Button variant="default">Create Department</Button>
						</SheetTrigger>
						<SheetContent>
							<form onSubmit={submitDepartment}>
								<SheetHeader>
									<SheetTitle>Create Department</SheetTitle>
									<SheetDescription>
										Enter department name below.
									</SheetDescription>
								</SheetHeader>
								<div className="py-4 grid grid-cols-4 items-center gap-4">
									<Label htmlFor="new-dept" className="text-right">
										Name
									</Label>
									<Input
										id="new-dept"
										value={department}
										onChange={(e) => setDepartment(e.target.value)}
										className="col-span-3"
										placeholder="New Department"
										required
									/>
								</div>
								<SheetFooter>
									<Button type="submit">Save</Button>
								</SheetFooter>
							</form>
						</SheetContent>
					</Sheet>
				</div>

				{/* Table */}
				<div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4">
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-4">
						<div className="flex-1">
							<Input
								placeholder="Filter department name..."
								value={
									(table.getColumn("name")?.getFilterValue() as string) ?? ""
								}
								onChange={(event) => {
									table.getColumn("name")?.setFilterValue(event.target.value);
								}}
								className="max-w-sm"
							/>
						</div>

						<div className="flex items-center gap-2 mt-2 md:mt-0">
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
							{table.getRowModel().rows.length ? (
								table.getRowModel().rows.map((row) => (
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
										No departments found
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
					{/* Pagination */}
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

			{/* Edit Sheet */}
			<Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
				<SheetContent>
					<form onSubmit={handleSaveEdit}>
						<SheetHeader>
							<SheetTitle>Edit Department</SheetTitle>
							<SheetDescription>Change department name.</SheetDescription>
						</SheetHeader>
						<div className="py-4 grid grid-cols-4 items-center gap-4">
							<Label htmlFor="edit-name" className="text-right">
								Name
							</Label>
							<Input
								id="edit-name"
								value={editDeptName}
								onChange={(e) => setEditDeptName(e.target.value)}
								className="col-span-3"
								required
							/>
						</div>
						<SheetFooter>
							<Button type="submit">Save Changes</Button>
						</SheetFooter>
					</form>
				</SheetContent>
			</Sheet>

			<table ref={exportTableRef} className="hidden">
				<thead>
					<tr>
						<th>Sr No</th>
						<th>Department Name</th>
						<th>Created At</th>
					</tr>
				</thead>
				<tbody>
					{paginatedData?.map((row: any, index: number) => (
						<tr key={row.id}>
							<td>{index + 1}</td>
							<td>{row.name}</td>
							<td>{formatDate(row.createdAt)}</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
}
