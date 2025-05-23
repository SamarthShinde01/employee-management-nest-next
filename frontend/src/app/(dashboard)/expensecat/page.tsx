"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetDescription,
	SheetClose,
} from "@/components/ui/sheet";
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableHead,
	TableRow,
} from "@/components/ui/table";
import {
	Pagination,
	PaginationItem,
	PaginationLink,
	PaginationPrevious,
	PaginationNext,
	PaginationContent,
} from "@/components/ui/pagination";
import {
	flexRender,
	useReactTable,
	getCoreRowModel,
	getFilteredRowModel,
	ColumnFiltersState,
} from "@tanstack/react-table";

import DashboardHeader from "@/components/dashboard-header";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
	createExpenseCategory,
	deleteExpenseCategory,
	getExpenseCategories,
	updateExpenseCategory,
} from "@/lib/api";
import queryClient from "@/config/queryClient";
import { toast } from "sonner";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, DownloadIcon } from "lucide-react";
import { useDownloadExcel } from "react-export-table-to-excel";
import { formatDate } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/DatePicker";

// Zod schema
const schema = z.object({
	name: z.string().min(1, "Name is required"),
});

type FormData = z.infer<typeof schema>;

export default function ExpenseCategoryPage() {
	const exportTableRef = useRef(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [editSheetOpen, setEditSheetOpen] = useState(false);
	const [addSheetOpen, setAddSheetOpen] = useState(false);
	const [editingId, setEditingId] = useState("");
	const [dateRange, setDateRange] = useState<DateRange | undefined>();
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);

	const { onDownload } = useDownloadExcel({
		currentTableRef: exportTableRef.current,
		filename: "Expense Category table",
		sheet: "Expense Category",
	});

	const itemsPerPage = 10;

	const { data: expenseCat = [] } = useQuery({
		queryKey: ["expenseCategory"],
		queryFn: getExpenseCategories,
	});

	const { mutate: createExpenseCatFunction } = useMutation({
		mutationFn: createExpenseCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["expenseCategory"] });
			toast.success("Expense category created successfully!");
			setAddSheetOpen(false);
			addForm.reset();
		},
		onError: () => {
			toast.error("Failed to create expense category.");
		},
	});

	const { mutate: updateExpenseCatFunction } = useMutation({
		mutationFn: updateExpenseCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["expenseCategory"] });
			toast.success("Expense category updated successfully!");
			setEditSheetOpen(false);
			editForm.reset();
		},
		onError: () => {
			toast.error("Failed to updated expense category.");
		},
	});

	const { mutate: deleteExpenseCategoryFunction } = useMutation({
		mutationFn: deleteExpenseCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["expenseCategory"] });
			toast.success("Expense category deleted successfully!");
		},
		onError: () => {
			toast.error("Failed to delete expense category.");
		},
	});

	// Add Form
	const addForm = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: { name: "" },
	});

	const onSubmitAdd: SubmitHandler<FormData> = useCallback(
		(data) => {
			createExpenseCatFunction(data);
		},
		[createExpenseCatFunction]
	);

	// Edit Form
	const editForm = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: { name: "" },
	});

	const handleEdit = useCallback(
		(expCat: any) => {
			setEditingId(expCat.id);
			editForm.setValue("name", expCat.name);
			setEditSheetOpen(true);
		},
		[editForm]
	);

	const handleSaveEdit = useCallback(() => {
		const values = editForm.getValues();
		updateExpenseCatFunction({
			data: values,
			expenseCatId: editingId,
		});

		setEditSheetOpen(false);
	}, [editForm, editingId]);

	const columns = useMemo(
		() => [
			{
				header: "Sr No", // @ts-ignore
				cell: ({ row }) => (currentPage - 1) * itemsPerPage + row.index + 1,
			},
			{
				accessorKey: "name",
				header: "Expense Cat Name",
			},
			{
				accessorKey: "createdAt",
				header: "Created Date",
				cell: ({ row }: any) => formatDate(row.original.createdAt),
			},
			{
				header: "Actions",
				cell: ({ row }: any) => (
					<div className="flex gap-2">
						<Button variant="outline" onClick={() => handleEdit(row.original)}>
							Edit
						</Button>
						<Button
							variant="destructive"
							onClick={() => deleteExpenseCategoryFunction(row.original.id)}
						>
							Delete
						</Button>
					</div>
				),
			},
		],
		[handleEdit, deleteExpenseCategoryFunction, currentPage, itemsPerPage]
	);

	// Filter products by date range
	const filteredData = useMemo(() => {
		if (!dateRange?.from || !dateRange?.to) return expenseCat;

		const from = new Date(dateRange.from);
		const to = new Date(dateRange.to);
		to.setUTCHours(23, 59, 59, 999); // Ensure we include entire day
		// @ts-ignore
		return expenseCat?.filter((category: any) => {
			const createdAt = new Date(category.createdAt);
			return createdAt >= from && createdAt <= to;
		});
	}, [expenseCat, dateRange]);

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

	const currentRows = table
		.getRowModel()
		.rows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	return (
		<>
			<DashboardHeader
				title="Expense Categories"
				link="/expense-categories"
				pageName="Add Expense Category"
			/>

			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-bold">Expense Category</h1>
					<Sheet open={addSheetOpen} onOpenChange={setAddSheetOpen}>
						<SheetTrigger asChild>
							<Button variant="default">Create Expense Category</Button>
						</SheetTrigger>
						<SheetContent>
							<form onSubmit={addForm.handleSubmit(onSubmitAdd)}>
								<SheetHeader>
									<SheetTitle>Create Expense Category</SheetTitle>
									<SheetDescription>
										Enter Expense Category name below.
									</SheetDescription>
								</SheetHeader>
								<div className="py-4">
									<div className="grid grid-cols-4 items-center gap-4">
										<Label htmlFor="name" className="text-right">
											Name
										</Label>
										<Input
											id="name"
											{...addForm.register("name")}
											className="col-span-3"
											placeholder="New Expense Cat"
										/>
									</div>
									{addForm.formState.errors.name && (
										<p className="text-red-500 text-sm mt-1">
											{addForm.formState.errors.name.message}
										</p>
									)}
								</div>
								<SheetFooter>
									<Button type="submit">Save</Button>
								</SheetFooter>
							</form>
						</SheetContent>
					</Sheet>
				</div>
				<div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4">
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-4">
						<div className="flex-1">
							<Input
								placeholder="Filter category name..."
								value={
									(table.getColumn("name")?.getFilterValue() as string) ?? ""
								}
								onChange={(event) =>
									table.getColumn("name")?.setFilterValue(event.target.value)
								}
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

			<Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
				<SheetContent>
					<form onSubmit={(e) => e.preventDefault()}>
						<SheetHeader>
							<SheetTitle>Edit Expense Category</SheetTitle>
							<SheetDescription>Change Expense Category name.</SheetDescription>
						</SheetHeader>
						<div className="py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="edit-name" className="text-right">
									Name
								</Label>
								<Input
									id="edit-name"
									{...editForm.register("name")}
									className="col-span-3"
								/>
							</div>
							{editForm.formState.errors.name && (
								<p className="text-red-500 text-sm mt-1">
									{editForm.formState.errors.name.message}
								</p>
							)}
						</div>
						<SheetFooter>
							<SheetClose asChild>
								<Button type="button" onClick={handleSaveEdit}>
									Update Changes
								</Button>
							</SheetClose>
						</SheetFooter>
					</form>
				</SheetContent>
			</Sheet>

			<table ref={exportTableRef} className="hidden">
				<thead>
					<tr>
						<th>Sr No</th>
						<th>Category Name</th>
						<th>Created At</th>
					</tr>
				</thead>
				<tbody>
					{paginatedData?.map((row: any, index: number) => (
						<tr key={row.id}>
							<td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
							<td>{row.name}</td>
							<td>{formatDate(row.createdAt)}</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
}
