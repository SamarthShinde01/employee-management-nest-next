"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DashboardHeader from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import InputField from "@/components/InputFields";
import { MultiSelect } from "@/components/multi-select";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
	updateProject,
	getUsers,
	getProjectById,
	getExpenseCategories,
} from "@/lib/api";
import { useEffect } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { PlusIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const updateProjectSchema = z.object({
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

type UpdateProjectFormData = z.infer<typeof updateProjectSchema>;

export default function ProjectsEditPage({
	params,
}: {
	params: {
		projectId: string;
	};
}) {
	const projectId = params.projectId;
	const router = useRouter();
	const redirectUrl = "/projects-manage";

	const { data: project } = useQuery({
		queryKey: ["project", projectId],
		queryFn: ({ queryKey }) => getProjectById(queryKey[1]),
		enabled: !!projectId,
	});

	const { data: employeesData = [] } = useQuery({
		queryKey: ["employees"],
		queryFn: getUsers,
	});

	const { data: expenseCategoryData = [] } = useQuery({
		queryKey: ["expenseCategory"],
		queryFn: getExpenseCategories,
	});

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		reset,
	} = useForm<UpdateProjectFormData>({
		resolver: zodResolver(updateProjectSchema),
		defaultValues: {
			employeeIds: [],
			costAllocations: [],
		},
	});

	const { fields, append, remove, replace } = useFieldArray({
		control,
		name: "costAllocations",
	});

	useEffect(() => {
		if (project && employeesData) {
			const selectedEmployeeIds =
				project?.projectAssignments?.map(
					(assignment: any) => assignment.employeeId
				) || [];

			const allocations =
				project.costAllocations?.map((alloc: any) => ({
					categoryId: alloc.categoryId,
					allocatedAmount: alloc.allocatedAmount.toString(),
					description: alloc.description || "",
				})) || [];

			reset({
				name: project.name || "",
				clientName: project.clientName || "",
				description: project.description || "",
				startDate: project.startDate?.slice(0, 10) || "",
				endDate: project.endDate?.slice(0, 10) || "",
				budget: project.budget?.toString() || "",
				employeeIds: selectedEmployeeIds,
				costAllocations: allocations.length > 0 ? allocations : [],
			});

			replace(allocations.length > 0 ? allocations : []);
		}
	}, [project, employeesData, reset, replace]);

	const { mutate: updateProjectFunction, isPending } = useMutation({
		mutationFn: (data: UpdateProjectFormData) =>
			updateProject({ data, projectId: projectId! }),
		onSuccess: () => {
			toast.success("Project updated successfully");
			router.replace(redirectUrl);
		},
		onError: () => {
			toast.error("Error occurred while updating");
		},
	});

	const onSubmit = (data: UpdateProjectFormData) => {
		updateProjectFunction(data);
	};

	return (
		<>
			<DashboardHeader
				title="Projects"
				link="/projects-manage"
				pageName="Edit Project"
			/>

			<div className="flex flex-col gap-4 p-4">
				<h1 className="text-xl font-bold">Update Project</h1>
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
								type="date"
								register={register}
								error={errors.startDate?.message}
							/>
							<InputField
								label="End Date"
								id="endDate"
								type="date"
								register={register}
								error={errors.endDate?.message}
							/>
							<InputField
								label="Budget"
								id="budget"
								type="number"
								register={register}
								error={errors.budget?.message}
							/>

							{/* Employees MultiSelect */}
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
									render={({ field }) => (
										<MultiSelect
											id="employeeIds"
											options={employeesData.map((emp: any) => ({
												label: `${emp.firstName} ${emp.lastName}`,
												value: emp.id,
											}))}
											placeholder="Select Employees"
											variant="inverted"
											maxCount={4}
											onValueChange={field.onChange}
											value={field.value}
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

						{/* Cost Allocations Section */}
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
																	{expenseCategoryData.map((cat: any) => (
																		<SelectItem key={cat.id} value={cat.id}>
																			{cat.name}
																		</SelectItem>
																	))}
																</SelectGroup>
															</SelectContent>
														</Select>
													)}
												/>

												{errors.costAllocations?.[index]?.categoryId && (
													<p className="text-xs text-red-500">
														{errors.costAllocations[index]?.categoryId?.message}
													</p>
												)}
											</div>

											{/* Allocated Amount */}
											<div className="space-y-1">
												<Label className="text-sm font-medium">Amount</Label>
												<InputField
													id={`costAllocations.${index}.allocatedAmount`}
													register={register}
													type="number"
													className="pl-8"
													error={undefined}
												/>
												{errors.costAllocations?.[index]?.allocatedAmount && (
													<p className="text-xs text-red-500">
														{
															errors.costAllocations[index]?.allocatedAmount
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
							{isPending ? "Updating..." : "Update"}
						</Button>
					</form>
				</div>
			</div>
		</>
	);
}
