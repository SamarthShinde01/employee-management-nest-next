"use client";

import DashboardHeader from "@/components/dashboard-header";
import {
	Controller,
	useFieldArray,
	useForm,
	FormProvider,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { assignTask, getProjects, getUsers } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useRouter, useSearchParams } from "next/navigation";

// Schema for validation
const addUserSchema = z.object({
	employeeId: z.string().min(1, "employee id is required"),
	tasks: z.array(z.object({ name: z.string().min(1, "Task name required") })),
	projectId: z.string().min(1, "Project Id is required"),
});

type AddUserFormData = z.infer<typeof addUserSchema>;

export default function AssignTaskPage() {
	const [projId, setProjId] = useState<string>("all");

	const methods = useForm<AddUserFormData>({
		resolver: zodResolver(addUserSchema),
		defaultValues: {
			employeeId: "",
			tasks: [{ name: "" }],
			projectId: "",
		},
	});

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = methods;

	const { fields, append, remove } = useFieldArray({
		control,
		name: "tasks",
	});

	const { data: projectsData = [] } = useQuery({
		queryKey: ["projects"],
		queryFn: getProjects,
	});

	const { data: allEmployees = [] } = useQuery({
		queryKey: ["employees"],
		queryFn: getUsers,
	});

	const filteredEmployees =
		projId === "all"
			? allEmployees
			: allEmployees?.filter((employee: any) =>
					employee.projectAssignments.some(
						(assignment: any) => assignment.projectId === projId
					)
			  );

	const searchparams = useSearchParams();
	const router = useRouter();
	const redirectUrl = searchparams.get("redirectUrl") || "/task-manage";

	const { mutate: assignTaskFuction, isError } = useMutation({
		mutationFn: assignTask,
		onSuccess: () => {
			router.replace(redirectUrl);
		},
	});

	const onSubmit = (data: AddUserFormData) => {
		try {
			assignTaskFuction(data);
		} catch (error: any) {
			toast(error?.message || "Something went wrong");
			console.error(error);
		}
	};

	return (
		<>
			{isError && toast("Invalid data submitted")}

			<DashboardHeader
				title="Assign Task"
				link="/task-manage"
				pageName="Assign Task"
			/>

			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				<h1 className="text-xl font-bold">Task Assign</h1>
				<div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
					<FormProvider {...methods}>
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="space-y-8 p-6 md:p-8"
						>
							<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
								<div className="flex items-start gap-4">
									<Label htmlFor="employee" className="w-32 text-right pt-2">
										Projects
									</Label>
									<div className="flex-1 space-y-1">
										<Controller
											control={control}
											name="projectId"
											render={({ field }) => (
												<Select
													// onValueChange={field.onChange}
													onValueChange={(value) => {
														field.onChange(value);
														setProjId(value);
													}}
													value={field.value}
												>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Select Project" />
													</SelectTrigger>
													<SelectContent>
														<SelectGroup>
															<SelectItem value="all">All</SelectItem>
															{projectsData.map((project) => (
																<SelectItem key={project.id} value={project.id}>
																	{project.name}
																</SelectItem>
															))}
														</SelectGroup>
													</SelectContent>
												</Select>
											)}
										/>
										{errors?.projectId && (
											<p className="text-sm text-red-500">
												{errors?.departmentId?.message}
											</p>
										)}
									</div>
								</div>

								{/* Select employee */}
								<div className="flex items-start gap-4">
									<Label htmlFor="employee" className="w-32 text-right pt-2">
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
												>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Select Employee" />
													</SelectTrigger>
													<SelectContent>
														<SelectGroup>
															{/* Dynamically generate SelectItem for each employee */}
															{filteredEmployees.map((employee: any) => (
																<SelectItem
																	key={employee.id}
																	value={employee.id}
																>
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

								{/* Dynamic task inputs */}
								<div className="col-span-2">
									<Label className="block mb-2">Tasks</Label>
									{fields.map((field, index) => (
										<div
											key={field.id}
											className="flex items-center gap-2 mb-2"
										>
											<Controller
												control={control}
												name={`tasks.${index}.name`}
												render={({ field }) => (
													<ReactQuill
														theme="snow"
														value={field.value}
														onChange={field.onChange}
														className="w-full"
														placeholder={`Task ${index + 1}`}
													/>
												)}
											/>
											<Button
												type="button"
												variant="destructive"
												onClick={() => remove(index)}
											>
												Remove
											</Button>
										</div>
									))}
									<Button
										type="button"
										variant="secondary"
										onClick={() => append({ name: "" })}
									>
										Add Task
									</Button>
									{errors.tasks && (
										<p className="text-sm text-red-500 mt-1">
											{errors.tasks.message as string}
										</p>
									)}
								</div>
							</div>

							<Button type="submit" className="ml-auto block">
								Assign Task
							</Button>
						</form>
					</FormProvider>
				</div>
			</div>
		</>
	);
}
