"use client";

import { useState, useMemo, useRef } from "react";
import {
	useReactTable,
	getCoreRowModel,
	getPaginationRowModel,
	flexRender,
	ColumnDef,
	ColumnFiltersState,
	getFilteredRowModel,
} from "@tanstack/react-table";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import { ChevronDown, DownloadIcon, Edit2Icon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import DashboardHeader from "@/components/dashboard-header";
import { deleteExpense, getExpenseCategories, getExpenses } from "@/lib/api";
import queryClient from "@/config/queryClient";
import { formatDate } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDownloadExcel } from "react-export-table-to-excel";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/DatePicker";
import FilterCombobox from "@/components/FilterCombobox";
import { useRouter } from "next/navigation";

const getFullName = (emp: any) =>
	`${emp?.firstName ?? ""} ${emp?.lastName ?? ""}`;
const safe = (value: any, fallback = "-") => value ?? fallback;

export default function ExpenseManagePage() {
	const exportTableRef = useRef(null);
	const router = useRouter();
	const [globalFilterValue, setGlobalFilterValue] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const [dateRange, setDateRange] = useState<DateRange | undefined>();
	const [selectedCategoryValue, setSelectedCategoryValue] =
		useState<string>("");
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const { onDownload } = useDownloadExcel({
		currentTableRef: exportTableRef.current,
		filename: "Expense table",
		sheet: "Expense",
	});

	const { data: expenseCategoryData } = useQuery({
		queryKey: ["expenseCategories"],
		queryFn: getExpenseCategories,
	});

	const { data: expenses = [] } = useQuery({
		queryKey: ["expenses"],
		queryFn: getExpenses,
	});

	const deleteMutation = useMutation({
		mutationFn: deleteExpense,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["expenses"] });
			toast.success("Expense deleted successfully!");
		},
		onError: () => {
			toast.error("Failed to delete expense.");
		},
	});

	const handleEdit = (expense: any) => {
		router.replace(`/expense-edit/${expense.id}`);
	};

	const renderActions = (row: any) => (
		<div className="flex gap-2">
			<Button
				title="Edit Expense"
				variant="outline"
				className="text-blue-600"
				onClick={() => handleEdit(row.original)}
			>
				<Edit2Icon />
			</Button>
			<Button
				variant="outline"
				className="text-red-600"
				onClick={() => deleteMutation.mutate(row.original.id)}
			>
				<Trash2Icon />
			</Button>
		</div>
	);

	const columns = useMemo<ColumnDef<any>[]>(
		() => [
			{
				header: "Sr No",
				cell: ({ row }) => (currentPage - 1) * itemsPerPage + row.index + 1,
			},
			{
				header: "Employee Name",
				cell: ({ row }) => getFullName(row.original.employee),
			},
			{
				header: "Department",
				cell: ({ row }) => safe(row.original.department?.name),
			},
			{
				header: "Category",
				cell: ({ row }) => safe(row.original.expenseCategory?.name || "Other"),
			},
			{
				header: "Product",
				cell: ({ row }) =>
					safe(row.original.product?.name || row.original?.productName),
			},
			{
				accessorKey: "amount",
				header: "Amount (₹)",
				cell: ({ row }) => `₹${row.original.amount}`,
			},
			{
				accessorKey: "quantity",
				header: "Quantity",
			},
			{
				accessorKey: "total",
				header: "Total Amount (₹)",
				cell: ({ row }) => `₹${row.original.total}`,
			},
			{
				accessorKey: "date",
				header: "Date/Time",
				cell: ({ row }) => formatDate(row.original.date),
			},
			{
				header: "Actions",
				cell: ({ row }) => renderActions(row),
			},
		],
		[currentPage, itemsPerPage]
	);

	const filteredData = useMemo(() => {
		if (!expenses) return [];

		let filtered = [...expenses];

		// 🔹 Filter by category
		if (selectedCategoryValue) {
			filtered = filtered.filter(
				(expense: any) => expense.expenseCatId === selectedCategoryValue
			);
		}

		// 🔹 Filter by date range
		if (dateRange?.from && dateRange?.to) {
			const from = new Date(dateRange.from);
			const to = new Date(dateRange.to);
			to.setUTCHours(23, 59, 59, 999); // End of the day

			filtered = filtered.filter((expense: any) => {
				const createdAt = new Date(expense.createdAt);
				return createdAt >= from && createdAt <= to;
			});
		}

		// 🔹 Filter by global search
		const search = globalFilterValue.toLowerCase();
		if (search) {
			filtered = filtered.filter((expense: any) => {
				const values = [
					getFullName(expense.employee),
					expense.department?.name,
					expense.expenseCategory?.name || "Other",
					expense.product?.name || expense.productName,
					expense.amount?.toString(),
					formatDate(expense.date),
				];

				return values.join(" ").toLowerCase().includes(search);
			});
		}

		return filtered;
	}, [expenses, selectedCategoryValue, dateRange, globalFilterValue]);

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

	return (
		<>
			<DashboardHeader
				title="Expense Manage"
				link="/expense-manage"
				pageName="Expense Manage"
			/>
			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				<h1 className="text-xl font-bold">Expense Manage</h1>
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
								dropdownName="Expense Category"
								dropwdownLabel="Select Expense Category"
								items={expenseCategoryData}
								value={selectedCategoryValue}
								onValueChange={setSelectedCategoryValue}
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
					{totalPages > 1 && renderPagination()}
				</div>
			</div>

			<table ref={exportTableRef} className="hidden">
				<thead>
					<tr>
						<th>Sr No</th>
						<th>Emp ID</th>
						<th>Employee Name</th>
						<th>Email</th>
						<th>Department</th>
						<th>Category</th>
						<th>Product</th>
						<th>Amount</th>
						<th>Date/Time</th>
					</tr>
				</thead>
				<tbody>
					{paginatedData.map((row: any, index: number) => (
						<tr key={row.id}>
							<td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
							<td>{row.employee.empId}</td>
							<td>
								{row.employee.firstName} {row.employee.lastName}
							</td>
							<td>{row.employee.email}</td>
							<td>{row.department?.name || ""}</td>
							<td>{row.expenseCategory?.name || "Other"}</td>
							<td>{row.product?.name || row.productName}</td>
							<td>{row.amount || ""}</td>
							<td>{formatDate(row.createdAt)}</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
}
