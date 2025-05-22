"use client";

import { useMemo, useRef, useState } from "react";
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
	createProducts,
	deleteProduct,
	getExpenseCategories,
	getProducts,
} from "@/lib/api";
import { Controller, useForm } from "react-hook-form";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import queryClient from "@/config/queryClient";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, DownloadIcon } from "lucide-react";
import { useDownloadExcel } from "react-export-table-to-excel";
import { formatDate } from "@/lib/utils";
import { DatePickerWithRange } from "@/components/DatePicker";
import { DateRange } from "react-day-picker";
import FilterCombobox from "@/components/FilterComboBox";

// === TYPES ===
type Product = {
	id: string;
	name: string;
	basePrice: number;
	categoryName: string;
	createdAt: string;
};

type Category = {
	id: string;
	name: string;
};

type ProductFormData = {
	name: string;
	description: string;
	basePrice: number;
	categoryId: string;
};

export default function ProductsPage() {
	const exportTableRef = useRef(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [editSheetOpen, setEditSheetOpen] = useState(false);
	const [addSheetOpen, setAddSheetOpen] = useState(false);
	const [globalFilterValue, setGlobalFilterValue] = useState("");
	const [selectedCategoryValue, setSelectedCategoryValue] =
		useState<string>("");
	const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(
		null
	);
	const [dateRange, setDateRange] = useState<DateRange | undefined>();
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const itemsPerPage = 10;

	const { onDownload } = useDownloadExcel({
		currentTableRef: exportTableRef.current,
		filename: "Product table",
		sheet: "Users",
	});

	const { data } = useQuery({
		queryKey: ["products"],
		queryFn: getProducts,
	});

	const { data: expenseCat = [] } = useQuery({
		queryKey: ["expenseCat"],
		queryFn: getExpenseCategories,
	});

	const products: Product[] = data?.products ?? [];

	const filteredData = useMemo(() => {
		let filtered = [...products];

		// Filter by department
		if (selectedCategoryValue) {
			filtered = filtered.filter(
				(product: any) => product.categoryId === selectedCategoryValue
			);
		}

		// Filter by date range
		if (dateRange?.from && dateRange?.to) {
			const from = new Date(dateRange.from);
			const to = new Date(dateRange.to);
			to.setUTCHours(23, 59, 59, 999);

			filtered = filtered.filter((product: any) => {
				const createdAt = new Date(product.createdAt);
				return createdAt >= from && createdAt <= to;
			});
		}

		return filtered;
	}, [products, selectedCategoryValue, dateRange]);

	const { control, handleSubmit, reset } = useForm<ProductFormData>({
		defaultValues: {
			name: "",
			description: "",
			basePrice: 0,
			categoryId: "",
		},
	});

	const { mutate: createProduct, isError } = useMutation({
		mutationFn: createProducts,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
			toast.success("Product created successfully!");
			setAddSheetOpen(false);
			reset();
		},
		onError: (error: any) => {
			const message =
				error?.response?.data?.message ||
				error?.message ||
				"Failed to create product";
			toast.error(message);
		},
	});

	const onsubmit = (data: ProductFormData) => {
		try {
			createProduct(data);
		} catch (error: any) {
			toast.error("error creating product");
		}
	};

	const { mutate: removeProduct } = useMutation({
		mutationFn: deleteProduct,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
			toast.success("Product deleted successfully!");
		},
		onError: () => toast.error("Failed to delete product."),
	});

	const handleEdit = (product: Product) => {
		setEditingProduct(product);
		setEditSheetOpen(true);
	};

	const handleSaveEdit = () => {
		console.log("Saving edit for:", editingProduct);
		setEditSheetOpen(false);
	};

	const columns: ColumnDef<Product>[] = useMemo(
		() => [
			{
				header: "Sr No",
				cell: ({ row }) => (currentPage - 1) * itemsPerPage + row.index + 1,
			},
			{ accessorKey: "name", header: "Product Name" },
			{ accessorKey: "categoryName", header: "Category" },
			{
				header: "Created At",
				cell: ({ row }) => formatDate(row.original?.createdAt),
			},
			{
				id: "search",
				accessorFn: (row) => `${row.name} ${row.categoryName}`.toLowerCase(),
				enableColumnFilter: true,
				header: "",
				cell: () => null,
				enableHiding: false,
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
							onClick={() => removeProduct(row.original.id)}
						>
							Delete
						</Button>
					</div>
				),
			},
		],
		[removeProduct, currentPage, itemsPerPage]
	);

	const totalPages = Math.ceil(filteredData.length / itemsPerPage);

	const table = useReactTable({
		data: filteredData,
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
				title="Products"
				link="/products-manage"
				pageName="Add Product"
			/>

			<div className="flex flex-col gap-4 p-4 pt-0">
				<div className="flex justify-between items-center">
					<h1 className="text-xl font-bold">Products</h1>
					<Sheet open={addSheetOpen} onOpenChange={setAddSheetOpen}>
						<SheetTrigger asChild>
							<Button>Create Product</Button>
						</SheetTrigger>
						<SheetContent className="space-y-6 px-4">
							<form onSubmit={handleSubmit(onsubmit)} className="space-y-8">
								<SheetHeader>
									<SheetTitle>Create Product</SheetTitle>
									<SheetDescription>
										Enter product details and select a category.
									</SheetDescription>
								</SheetHeader>

								<ProductFormFields control={control} categories={expenseCat} />

								<SheetFooter>
									<Button type="submit">Save</Button>
								</SheetFooter>
							</form>
						</SheetContent>
					</Sheet>
				</div>
				<div className="min-h-[100vh] rounded-xl bg-muted/50 md:min-h-min p-4">
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
								items={expenseCat}
								value={selectedCategoryValue}
								onValueChange={setSelectedCategoryValue}
							/>
							<DatePickerWithRange
								onChange={(range: any) => setDateRange(range)}
							/>
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
										.getFilteredRowModel()
										.rows.slice(
											(currentPage - 1) * itemsPerPage,
											currentPage * itemsPerPage
										)
										.map((row) => (
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
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					<Table className="border-separate border-spacing-y-2">
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
							{currentRows.map((row) => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<td key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</td>
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

			{/* Edit Sheet */}
			<Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleSaveEdit();
					}}
					className="h-full flex flex-col"
				>
					<SheetContent className="space-y-6 px-4">
						<SheetHeader>
							<SheetTitle>Edit Product</SheetTitle>
							<SheetDescription>
								Modify the product details below.
							</SheetDescription>
						</SheetHeader>
						<div className="space-y-6">
							<Label htmlFor="edit-name">Product Name</Label>
							<Input
								id="edit-name"
								value={editingProduct?.name ?? ""}
								onChange={(e) =>
									setEditingProduct({
										...editingProduct!,
										name: e.target.value,
									})
								}
							/>
						</div>
						<SheetFooter>
							<Button type="submit">Update</Button>
						</SheetFooter>
					</SheetContent>
				</form>
			</Sheet>

			<table ref={exportTableRef} className="hidden">
				<thead>
					<tr>
						<th>Sr No</th>
						<th>Product Name</th>
						<th>Category</th>
						<th>Price</th>
						<th>Description</th>
						<th>Created At</th>
					</tr>
				</thead>
				<tbody>
					{products?.map((row: any, index: number) => (
						<tr key={row.id}>
							<td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
							<td>{row.name}</td>
							<td>{row.category?.name || ""}</td>
							<td>{row.basePrice || ""}</td>
							<td>{row.description}</td>
							<td>{formatDate(row.createdAt)}</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
}

function ProductFormFields({
	control,
	categories,
}: {
	control: any;
	categories: Category[];
}) {
	return (
		<>
			<div className="grid gap-2">
				<Label htmlFor="name">Product Name</Label>
				<Controller
					name="name"
					control={control}
					defaultValue=""
					render={({ field }) => (
						<Input id="name" placeholder="Enter product name" {...field} />
					)}
				/>
			</div>

			<div className="grid gap-2">
				<Label htmlFor="description">Product Description</Label>
				<Controller
					name="description"
					control={control}
					defaultValue=""
					render={({ field }) => (
						<Textarea
							id="description"
							placeholder="Enter description"
							{...field}
						/>
					)}
				/>
			</div>

			<div className="grid gap-2">
				<Label htmlFor="categoryId">Category</Label>
				<Controller
					name="categoryId"
					control={control}
					render={({ field }) => (
						<Select onValueChange={field.onChange} value={field.value}>
							<SelectTrigger id="categoryId">
								<SelectValue placeholder="Select Category" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{categories.map((cat) => (
										<SelectItem key={cat.id} value={cat.id}>
											{cat.name}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					)}
				/>
			</div>
		</>
	);
}
