"use client";

import { z } from "zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import DashboardHeader from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
	getDepartments,
	getExpense,
	getExpenseCategories,
	getProducts,
	getUsers,
	updateExpense,
} from "@/lib/api";

type UpdateExpenseFormData = z.infer<typeof updateExpenseSchema>;

const updateExpenseSchema = z.object({
	departmentId: z.string().min(1, "Department is required"),
	employeeId: z.string().min(1, "Employee is required"),
	expenseCatId: z.string().min(1, "Expense category is required"),
	productId: z.string().min(1, "Product is required"),
	amount: z
		.number({ invalid_type_error: "Amount must be a number" })
		.min(0.01, "Amount must be greater than 0"),
	quantity: z
		.number({ invalid_type_error: "Quantity must be a number" })
		.min(1, "Quantity must be at least 1"),
	total: z
		.number({ invalid_type_error: "Total must be a number" })
		.min(0.01, "Total must be greater than 0"),
	date: z.string().min(1, "Date is required"),
	notes: z.string().min(1, "Notes are required"),
});

export default function ExpenseUpdatePage() {
	const { expenseId } = useParams<{ expenseId: string }>();
	const router = useRouter();
	const searchParams = useSearchParams();
	const redirectUrl = searchParams.get("redirectUrl") || "/expense-manage";

	const [departmentFilter, setDepartmentFilter] = useState<string>("");
	const [categoryFilter, setCategoryFilter] = useState<string>("");

	const {
		register,
		handleSubmit,
		control,
		setValue,
		watch,
		reset,
		formState: { errors },
	} = useForm<UpdateExpenseFormData>({
		resolver: zodResolver(updateExpenseSchema),
	});

	const amount = watch("amount");
	const quantity = watch("quantity");

	// Calculate total whenever amount or quantity changes
	useEffect(() => {
		const total = (amount || 0) * (quantity || 0);
		setValue("total", total);
	}, [amount, quantity, setValue]);

	// Fetch expense data
	const { data: expenseData } = useQuery({
		queryKey: ["expense", expenseId],
		queryFn: () => getExpense(expenseId!),
		enabled: !!expenseId,
		onError: (error: Error) => {
			toast.error(error.message || "Failed to fetch expense");
		},
	});

	// Fetch other necessary data
	const { data: departments = [] } = useQuery({
		queryKey: ["departments"],
		queryFn: getDepartments,
	});

	const { data: employees = [] } = useQuery({
		queryKey: ["employees"],
		queryFn: getUsers,
	});

	const { data: expenseCategories = [] } = useQuery({
		queryKey: ["expenseCategories"],
		queryFn: getExpenseCategories,
	});

	const { data: productsData } = useQuery({
		queryKey: ["products"],
		queryFn: getProducts,
	});

	// Filter employees and products based on selections
	const filteredEmployees = departmentFilter
		? employees.filter((e: any) => e.departmentId === departmentFilter)
		: employees;

	const filteredProducts = categoryFilter
		? productsData?.products?.filter(
				(p: any) => p.categoryId === categoryFilter
		  )
		: productsData?.products;

	// Reset form with expense data when loaded
	useEffect(() => {
		if (expenseData) {
			reset({
				departmentId: expenseData.departmentId,
				employeeId: expenseData.employeeId,
				expenseCatId: expenseData.expenseCatId,
				productId: expenseData.productId,
				amount: Number(expenseData.amount),
				quantity: expenseData.quantity,
				total: Number(expenseData.total),
				date: expenseData.date.split("T")[0],
				notes: expenseData.notes,
			});
			setDepartmentFilter(expenseData.departmentId);
			setCategoryFilter(expenseData.expenseCatId);
		}
	}, [expenseData, reset]);

	// Mutation for updating expense
	const { mutate: updateExpenseMutation, isPending } = useMutation({
		mutationFn: updateExpense,
		onSuccess: () => {
			toast.success("Expense updated successfully");
			router.replace(redirectUrl);
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update expense");
		},
	});

	const onSubmit = (data) => {
		updateExpenseMutation({
			expenseId: expenseId!,
			data,
		});
	};

	return (
		<>
			<DashboardHeader
				title="Expense Manage"
				link="/expense-manage"
				pageName="Expense Update"
			/>
			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				<h1 className="text-xl font-bold">Expense Update</h1>
				<div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-8 p-6 md:p-8"
					>
						<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
							{/* Department Select */}
							<div className="flex items-start gap-4">
								<Label
									htmlFor="departmentId"
									className="w-32 pt-2 text-right text-xs"
								>
									Department
								</Label>
								<div className="flex-1 space-y-1">
									<Controller
										control={control}
										name="departmentId"
										render={({ field }) => (
											<Select
												onValueChange={(value) => {
													field.onChange(value);
													setDepartmentFilter(value);
													setValue("employeeId", ""); // Reset employee when department changes
												}}
												value={field.value}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select Department" />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														{departments.map((department) => (
															<SelectItem
																key={department.id}
																value={department.id}
															>
																{department.name}
															</SelectItem>
														))}
													</SelectGroup>
												</SelectContent>
											</Select>
										)}
									/>
									{errors.departmentId && (
										<p className="text-sm text-red-500">
											{errors.departmentId.message}
										</p>
									)}
								</div>
							</div>

							{/* Employee Select */}
							<div className="flex items-start gap-4">
								<Label htmlFor="employeeId" className="w-32 pt-2 text-right">
									Employee
								</Label>
								<div className="flex-1 space-y-1">
									<Controller
										control={control}
										name="employeeId"
										render={({ field }) => (
											<Select
												onValueChange={field.onChange}
												value={field.value}
												disabled={!departmentFilter}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select Employee" />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														{filteredEmployees?.map((employee) => (
															<SelectItem key={employee.id} value={employee.id}>
																{employee.firstName} {employee.lastName}
															</SelectItem>
														))}
													</SelectGroup>
												</SelectContent>
											</Select>
										)}
									/>
									{errors.employeeId && (
										<p className="text-sm text-red-500">
											{errors.employeeId.message}
										</p>
									)}
								</div>
							</div>

							{/* Expense Category Select */}
							<div className="flex items-start gap-4">
								<Label htmlFor="expenseCatId" className="w-32 pt-2 text-right">
									Expense Category
								</Label>
								<div className="flex-1 space-y-1">
									<Controller
										control={control}
										name="expenseCatId"
										render={({ field }) => (
											<Select
												onValueChange={(value) => {
													field.onChange(value);
													setCategoryFilter(value);
													setValue("productId", ""); // Reset product when category changes
												}}
												value={field.value}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select Category" />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														{expenseCategories.map((category) => (
															<SelectItem key={category.id} value={category.id}>
																{category.name}
															</SelectItem>
														))}
													</SelectGroup>
												</SelectContent>
											</Select>
										)}
									/>
									{errors.expenseCatId && (
										<p className="text-sm text-red-500">
											{errors.expenseCatId.message}
										</p>
									)}
								</div>
							</div>

							{/* Product Select */}
							<div className="flex items-start gap-4">
								<Label htmlFor="productId" className="w-32 pt-2 text-right">
									Product
								</Label>
								<div className="flex-1 space-y-1">
									<Controller
										control={control}
										name="productId"
										render={({ field }) => (
											<Select
												onValueChange={field.onChange}
												value={field.value}
												disabled={!categoryFilter}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select Product" />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														{filteredProducts?.map((product) => (
															<SelectItem key={product.id} value={product.id}>
																{product.name}
															</SelectItem>
														))}
													</SelectGroup>
												</SelectContent>
											</Select>
										)}
									/>
									{errors.productId && (
										<p className="text-sm text-red-500">
											{errors.productId.message}
										</p>
									)}
								</div>
							</div>

							{/* Amount */}
							<div className="flex items-start gap-4">
								<Label htmlFor="amount" className="w-32 pt-2 text-right">
									Amount
								</Label>
								<div className="flex-1 space-y-1">
									<Input
										type="number"
										step="0.01"
										min="0.01"
										{...register("amount", { valueAsNumber: true })}
									/>
									{errors.amount && (
										<p className="text-sm text-red-500">
											{errors.amount.message}
										</p>
									)}
								</div>
							</div>

							{/* Quantity */}
							<div className="flex items-start gap-4">
								<Label htmlFor="quantity" className="w-32 pt-2 text-right">
									Quantity
								</Label>
								<div className="flex-1 space-y-1">
									<Input
										type="number"
										min="1"
										{...register("quantity", { valueAsNumber: true })}
									/>
									{errors.quantity && (
										<p className="text-sm text-red-500">
											{errors.quantity.message}
										</p>
									)}
								</div>
							</div>

							{/* Total (readonly) */}
							<div className="flex items-start gap-4">
								<Label htmlFor="total" className="w-32 pt-2 text-right">
									Total
								</Label>
								<div className="flex-1 space-y-1">
									<Input
										type="number"
										readOnly
										{...register("total", { valueAsNumber: true })}
									/>
									{errors.total && (
										<p className="text-sm text-red-500">
											{errors.total.message}
										</p>
									)}
								</div>
							</div>

							{/* Date */}
							<div className="flex items-start gap-4">
								<Label htmlFor="date" className="w-32 pt-2 text-right">
									Date
								</Label>
								<div className="flex-1 space-y-1">
									<Input type="date" {...register("date")} />
									{errors.date && (
										<p className="text-sm text-red-500">
											{errors.date.message}
										</p>
									)}
								</div>
							</div>

							{/* Notes (full width) */}
							<div className="flex items-start gap-4 md:col-span-2">
								<Label htmlFor="notes" className="w-32 pt-2 text-right">
									Notes
								</Label>
								<div className="flex-1 space-y-1">
									<Textarea {...register("notes")} />
									{errors.notes && (
										<p className="text-sm text-red-500">
											{errors.notes.message}
										</p>
									)}
								</div>
							</div>
						</div>

						<Button type="submit" disabled={isPending} className="ml-auto">
							{isPending ? "Updating..." : "Update Expense"}
						</Button>
					</form>
				</div>
			</div>
		</>
	);
}
