"use client";

import { z } from "zod";
import DashboardHeader from "@/components/dashboard-header";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	createExpense,
	getDepartments,
	getExpenseCategories,
	getProducts,
	getUsers,
} from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

const addExpenseSchema = z.object({
	departmentId: z.string().min(1, "Department Id is required"),
	employeeId: z.string().min(1, "Employee is required"),
	expenseCatId: z.string().min(1, "Expense category is required"),
	productId: z.string().min(1, "Product is required").optional(),
	productName: z.string().min(1, "Product Name is required").optional(),
	amount: z
		.number({ invalid_type_error: "Amount must be a number" })
		.min(0, "Amount must be greater than or equal to 0"),
	quantity: z
		.number({ invalid_type_error: "Quantity must be a number" })
		.min(1, "Quantity must be at least 1"),
	total: z
		.number({ invalid_type_error: "Total must be a number" })
		.min(0, "Total must be greater than or equal to 0"),
	date: z.string().min(1, "Date is required"),
	notes: z.string().min(1, "Notes are required"),
});

type AddExpenseFormData = z.infer<typeof addExpenseSchema>;

export default function ExpenseAddPage() {
	const [departId, setDepartId] = useState<string>("all");
	const [expCatId, setExpCatId] = useState<string>("all");
	const [otherSelected, setOtherSelected] = useState<boolean>(false);
	const {
		register,
		handleSubmit,
		control,
		setValue,
		watch,
		formState: { errors },
	} = useForm<AddExpenseFormData>({
		resolver: zodResolver(addExpenseSchema),
	});

	const amount = watch("amount");
	const quantity = watch("quantity");

	useEffect(() => {
		const total = (amount || 0) * (quantity || 0);
		setValue("total", total);
	}, [amount, quantity, setValue]);

	const { data: depeartments = [] } = useQuery({
		queryKey: ["depeartments"],
		queryFn: getDepartments,
	});

	const { data: allEmployees } = useQuery({
		queryKey: ["employees"],
		queryFn: getUsers,
	});

	const filteredEmployees =
		departId === "all"
			? allEmployees // @ts-ignore
			: allEmployees?.filter(
					(employee: any) => employee.departmentId === departId
			  );

	const { data: expenseCatData } = useQuery({
		queryKey: ["expenseCat"],
		queryFn: getExpenseCategories,
	});

	const { data: productsData } = useQuery({
		queryKey: ["products"],
		queryFn: getProducts,
	});

	// @ts-ignore
	const allProducts = productsData?.products || [];

	const filteredProducts =
		expCatId === "all"
			? allProducts
			: allProducts.filter((product: any) => product.categoryId === expCatId);

	const searchparams = useSearchParams();
	const router = useRouter();
	const redirectUrl = searchparams.get("redirectUrl") || "/expense-manage";

	const {
		mutate: createExpenseFunction,
		isPending,
		isError,
	} = useMutation({
		mutationFn: createExpense,
		onSuccess: () => {
			toast.success("Expense added successfully");
			router.replace(redirectUrl);
		},
	});

	const onSubmit = (data: AddExpenseFormData) => {
		try {
			const formattedData = {
				...data,
				date: new Date(data?.date).toISOString(),
			};
			createExpenseFunction(formattedData);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			<DashboardHeader
				title="Expense Manage"
				link="/expense-manage"
				pageName="Expense add"
			/>
			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				<h1 className="text-xl font-bold">Expense Create</h1>
				<div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
					{isError ?? <>Error occured on form submission</>}

					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-8 p-6 md:p-8"
					>
						<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
							<div className="flex items-start gap-4">
								<Label htmlFor="employee" className="w-32 text-right pt-2">
									Department
								</Label>
								<div className="flex-1 space-y-1">
									<Controller
										control={control}
										name="departmentId"
										render={({ field }) => (
											<Select
												// onValueChange={field.onChange}
												onValueChange={(value) => {
													field.onChange(value);
													setDepartId(value);
												}}
												value={field.value}
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select Department" />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														<SelectItem value="all">All</SelectItem>
														{
															// @ts-ignore
															depeartments?.map((department: any) => (
																<SelectItem
																	key={department.id}
																	value={department.id}
																>
																	{department.name}
																</SelectItem>
															))
														}
													</SelectGroup>
												</SelectContent>
											</Select>
										)}
									/>
									{errors?.departmentId && (
										<p className="text-sm text-red-500">
											{errors?.departmentId?.message}
										</p>
									)}
								</div>
							</div>

							{/* Employee Select */}
							<div className="flex items-start gap-4">
								<Label htmlFor="employeeId" className="w-32 text-right pt-2">
									Employee
								</Label>
								<div className="flex-1 space-y-1">
									<Controller
										control={control}
										name="employeeId"
										render={({ field }) => (
											<Select onValueChange={field.onChange}>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select Employee" />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														{filteredEmployees?.map((e: any) => (
															<SelectItem key={e.id} value={e.id}>
																{e.firstName} {e.lastName}
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

							<div className="flex items-start gap-4">
								<Label htmlFor="expenseCatId" className="w-32 text-right pt-2">
									Expense Category
								</Label>
								<div className="flex-1 space-y-1">
									<Controller
										control={control}
										name="expenseCatId"
										render={({ field }) => (
											<Select
												// onValueChange={field.onChange}
												onValueChange={(value) => {
													field.onChange(value);
													setExpCatId(value);
													value === "other"
														? setOtherSelected(true)
														: setOtherSelected(false);
												}}
												value={field.value}
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select Expense Category" />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														<SelectItem value="all">All</SelectItem>
														{
															// @ts-ignore
															expenseCatData?.map((product: any) => (
																<SelectItem
																	key={product?.id}
																	value={product?.id}
																>
																	{product?.name}
																</SelectItem>
															))
														}
														<SelectItem value="other">Other</SelectItem>
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
							{otherSelected ? (
								<div className="flex items-start gap-4">
									<Label htmlFor="productName" className="w-32 text-right pt-2">
										Product Name
									</Label>
									<div className="flex-1 space-y-1">
										<Input type="text" {...register("productName")} />
										{errors.productName && (
											<p className="text-sm text-red-500">
												{errors.productName.message}
											</p>
										)}
									</div>
								</div>
							) : (
								<div className="flex items-start gap-4">
									<Label htmlFor="productId" className="w-32 text-right pt-2">
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
												>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Select Product" />
													</SelectTrigger>
													<SelectContent>
														<SelectGroup>
															{filteredProducts?.map((product: any) => (
																<SelectItem
																	key={product?.id}
																	value={product?.id}
																>
																	{product?.name}
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
							)}

							{/* Amount */}
							<div className="flex items-start gap-4">
								<Label htmlFor="amount" className="w-32 text-right pt-2">
									Amount
								</Label>
								<div className="flex-1 space-y-1">
									<Input
										type="number"
										step="0.01"
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
								<Label htmlFor="quantity" className="w-32 text-right pt-2">
									Quantity
								</Label>
								<div className="flex-1 space-y-1">
									<Input
										type="number"
										{...register("quantity", { valueAsNumber: true })}
									/>
									{errors.quantity && (
										<p className="text-sm text-red-500">
											{errors.quantity.message}
										</p>
									)}
								</div>
							</div>

							{/* Total */}
							<div className="flex items-start gap-4">
								<Label htmlFor="total" className="w-32 text-right pt-2">
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
								<Label htmlFor="date" className="w-32 text-right pt-2">
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

							{/* Notes */}
							<div className="flex items-start gap-4 md:col-span-2">
								<Label htmlFor="notes" className="w-32 text-right pt-2">
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
							{isPending ? "Submitting" : "Submit"}
						</Button>
					</form>
				</div>
			</div>
		</>
	);
}
