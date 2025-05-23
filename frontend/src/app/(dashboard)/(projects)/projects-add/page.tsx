"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DashboardHeader from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import InputField from "@/components/InputFields";
import { MultiSelect } from "@/components/multi-select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createProject, getExpenseCategories, getUsers } from "@/lib/api";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { PlusIcon, XIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

// Zod schema with employeeIds as array of strings and min length 1
const addProjectSchema = z.object({
	name: z.string().min(1, "Project name is required"),
	clientName: z.string().min(1, "Client name is required"),
	description: z.string().min(1, "Description is required"),
	startDate: z.string().min(1, "Start date is required"),
	endDate: z.string().min(1, "End date is required"),
	budget: z.string().min(1, "Budget is required"),
	employeeIds: z
		.array(z.string())
		.min(1, "At least one employee must be selected"),
	costAllocations: z
		.array(
			z.object({
				categoryId: z.string().min(1, "Select a category"),
				allocatedAmount: z.string().min(1, "Enter amount"),
				description: z.string().optional(),
			})
		)
		.optional(),
});

type AddProjectFormData = z.infer<typeof addProjectSchema>;

export default function ProjectsAddPage() {
	const { data: employeesData } = useQuery({
		queryKey: ["employees"],
		queryFn: getUsers,
	});

	const { data: expenseCategoryData } = useQuery({
		queryKey: ["expenseCategory"],
		queryFn: getExpenseCategories,
	});

	const searchparams = useSearchParams();
	const router = useRouter();
	const redirectUrl = searchparams.get("redirectUrl") || "/projects-manage";

	const { mutate: createProjectFunction, isPending } = useMutation({
		mutationFn: createProject,
		onSuccess: () => {
			toast.success("Project created successfully");
			router.push(redirectUrl);
		},
		onError: () => {
			toast.error("Error occurred while submitting");
		},
	});

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<AddProjectFormData>({
		resolver: zodResolver(addProjectSchema),
		defaultValues: {
			employeeIds: [],
			costAllocations: [
				{
					categoryId: "",
					allocatedAmount: "",
					description: "",
				},
			],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "costAllocations",
	});

	const onSubmit = (data: AddProjectFormData) => {
		createProjectFunction(data);
	};

	return (
		<>
			<DashboardHeader
				title="Projects"
				link="/projects-manage"
				pageName="Add Project"
			/>

			<div className="flex flex-col gap-4 p-4">
				<h1 className="text-xl font-bold">Create New Project</h1>
				<div className="rounded-xl bg-muted/50 p-6">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<InputField
								label="Project Name"
								id="name"
								register={register}
								error={errors.name?.message}
							/>
							<InputField
								label="Client Name"
								id="clientName"
								register={register}
								error={errors.clientName?.message}
							/>
							<InputField
								label="Description"
								id="description"
								register={register}
								error={errors.description?.message}
							/>
							<InputField
								label="Start Date"
								id="startDate"
								register={register}
								type="date"
								error={errors.startDate?.message}
							/>
							<InputField
								label="End Date"
								id="endDate"
								register={register}
								type="date"
								error={errors.endDate?.message}
							/>
							<InputField
								label="Budget"
								id="budget"
								register={register}
								type="number"
								error={errors.budget?.message}
							/>

							{/* Employee MultiSelect with Controller */}
							<div className="flex items-start gap-4">
								<label
									htmlFor="employeeIds"
									className="w-32 flex text-right pt-2 text-sm font-semibold"
								>
									Employees
								</label>
								<Controller
									control={control}
									name="employeeIds"
									defaultValue={[]}
									render={({ field }) => (
										<MultiSelect
											id="employeeIds"
											options={
												// @ts-ignore
												employeesData?.map((emp: any) => ({
													label: `${emp.firstName} ${emp.lastName}`,
													value: emp.id,
												})) || []
											}
											placeholder="Select Employees"
											variant="inverted"
											maxCount={4}
											onValueChange={field.onChange}
											value={field.value} // controlled value
											className="w-1/2"
										/>
									)}
								/>
							</div>
							{errors.employeeIds && (
								<p className="text-sm text-red-600 col-span-2 pl-36">
									{errors.employeeIds.message}
								</p>
							)}
						</div>

						<div className="col-span-2 border-b border-slate-400" />

						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold text-white">
									Cost Allocations
								</h3>
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="gap-1"
									onClick={() =>
										append({
											categoryId: "",
											allocatedAmount: "",
											description: "",
										})
									}
								>
									<PlusIcon className="h-4 w-4" />
									Add Allocation
								</Button>
							</div>

							<div className="space-y-3">
								{fields.map((field, index) => (
									<div
										key={field.id}
										className="relative rounded-lg border bg-muted/50 p-4 shadow-sm transition-all hover:shadow-md"
									>
										{fields.length > 1 && (
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="absolute -right-2 -top-2 h-6 w-6 rounded-full border bg-muted/50 text-red-500 shadow-sm hover:bg-red-50 hover:text-red-700"
												onClick={() => remove(index)}
											>
												<XIcon className="h-3 w-3" />
											</Button>
										)}

										<div className="grid gap-4 md:grid-cols-3">
											{/* Category Select */}
											<div className="space-y-1">
												<Label className="text-sm font-medium">
													Expense Category
												</Label>
												<Controller
													control={control}
													name={`costAllocations.${index}.categoryId`}
													render={({ field }) => (
														<Select
															onValueChange={field.onChange}
															value={field.value}
														>
															<SelectTrigger className="w-full">
																<SelectValue placeholder="Select category" />
															</SelectTrigger>
															<SelectContent>
																<SelectGroup>
																	{
																		// @ts-ignore
																		expenseCategoryData?.map((cat: any) => (
																			<SelectItem key={cat.id} value={cat.id}>
																				{cat.name}
																			</SelectItem>
																		))
																	}
																</SelectGroup>
															</SelectContent>
														</Select>
													)}
												/>
												{errors.costAllocations?.[index]?.categoryId && (
													<p className="text-xs text-red-500">
														{errors.costAllocations[index].categoryId?.message}
													</p>
												)}
											</div>

											{/* Allocated Amount */}
											<div className="space-y-1">
												<Label className="text-sm font-medium">Amount</Label>
												<div className="relative">
													<InputField
														id={`costAllocations.${index}.allocatedAmount`}
														register={register}
														type="number" // @ts-ignore
														className="pl-8"
														error={undefined} // Handle error separately
													/>
												</div>
												{errors.costAllocations?.[index]?.allocatedAmount && (
													<p className="text-xs text-red-500">
														{
															errors.costAllocations[index].allocatedAmount
																?.message
														}
													</p>
												)}
											</div>

											{/* Description */}
											<div className="space-y-1">
												<Label className="text-sm font-medium">
													Description (Optional)
												</Label>
												<textarea
													{...register(`costAllocations.${index}.description`)}
													rows={2}
													className="w-full rounded-md border border-gray-200 bg-muted/50 p-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
													placeholder="Brief description of this allocation"
												/>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
						<Button
							type="submit"
							disabled={isPending}
							className="ml-auto block"
						>
							{isPending ? "Submitting" : "Submit"}
						</Button>
					</form>
				</div>
			</div>
		</>
	);
}
