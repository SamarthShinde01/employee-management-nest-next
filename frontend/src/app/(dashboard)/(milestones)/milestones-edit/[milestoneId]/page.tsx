"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import * as z from "zod";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardHeader from "@/components/dashboard-header";
import {
	getMistoneByMilestoneId,
	getProjects,
	updateMilestone,
} from "@/lib/api";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

const milestoneSchema = z.object({
	projectId: z.string().min(1, "Project must be selected"),
	name: z.string().min(1, "Milestone name is required"),
	percentage: z
		.number({ invalid_type_error: "Percentage must be a number" })
		.min(1, "Percentage must be at least 1"),
	description: z.string().min(1, "Description is required"),
	targetDate: z
		.string()
		.min(1, "Target date is required")
		.transform((val) => new Date(val)),
	achievedDate: z
		.string()
		.optional()
		.transform((val) => (val ? new Date(val) : undefined)),
});

type MilestoneFormData = z.infer<typeof milestoneSchema>;

type typeParams = {
	params: {
		milestoneId: string;
	};
};

export default function MilestoneEditPage() {
	const { milestoneId } = useParams<{ milestoneId: string }>();

	const router = useRouter();
	const searchparams = useSearchParams();
	const redirectUrl = searchparams.get("redirectUrl") || "/milestones";

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		control,
	} = useForm<MilestoneFormData>({
		resolver: zodResolver(milestoneSchema),
		defaultValues: {
			percentage: 1,
			projectId: "",
			name: "",
			description: "",
		},
	});

	const { data: projectsData } = useQuery({
		queryKey: ["projects"],
		queryFn: getProjects,
	});

	const { data: milestoneData, isError } = useQuery({
		queryKey: ["milestone", milestoneId],
		queryFn: () => getMistoneByMilestoneId(milestoneId!),
		enabled: !!milestoneId,
	});

	useEffect(() => {
		if (milestoneData) {
			reset({
				projectId: milestoneData.projectId || "",
				name: milestoneData?.name || "",
				description: milestoneData?.description || "",
				percentage: milestoneData?.percentage || 1,
				targetDate: milestoneData.targetDate?.split("T")[0] || "",
				achievedDate: milestoneData.achievedDate?.split("T")[0] || "",
			});
		}
	}, [milestoneData, reset]);

	useEffect(() => {
		if (isError) {
			toast.error("Invalid data submitted");
		}
	}, [isError]);

	const { mutate: updateMilestoneFunction, isPending } = useMutation({
		mutationFn: updateMilestone,
		onSuccess: () => {
			toast.success("Milestone updated successfully");
			router.replace(redirectUrl);
			reset();
		},
		onError: (error: any) => {
			toast.error(error.message || "Failed to update milestone");
		},
	});

	const onSubmit = (data: MilestoneFormData) => {
		try {
			updateMilestoneFunction({ data, milestoneId });
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			<DashboardHeader
				title="Milestones"
				link="/milestones-manage"
				pageName="Edit Milestone"
			/>

			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				<h1 className="text-xl font-bold">Edit Milestone</h1>
				<div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-8 p-6 md:p-8"
					>
						<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
							{/* Project Selector */}
							<div className="flex items-start gap-4">
								<Label htmlFor="projectId" className="w-32 text-right pt-2">
									Projects
								</Label>
								<div className="flex-1 space-y-1">
									<Controller
										control={control}
										name="projectId"
										render={({ field }) => (
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select Project" />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														{projectsData?.map((project: any) => (
															<SelectItem key={project.id} value={project.id}>
																{project.name}
															</SelectItem>
														))}
													</SelectGroup>
												</SelectContent>
											</Select>
										)}
									/>
									{errors.projectId && (
										<p className="text-sm text-red-500">
											{errors.projectId.message}
										</p>
									)}
								</div>
							</div>

							{/* Milestone Name */}
							<div className="flex items-start gap-4">
								<Label htmlFor="name" className="w-32 text-right pt-2">
									Name
								</Label>
								<div className="flex-1 space-y-1">
									<Input id="name" {...register("name")} />
									{errors.name && (
										<p className="text-sm text-red-500">
											{errors.name.message}
										</p>
									)}
								</div>
							</div>

							{/* Percentage */}
							<div className="flex items-start gap-4">
								<Label htmlFor="percentage" className="w-32 text-right pt-2">
									Percentage
								</Label>
								<div className="flex-1 space-y-1">
									<Input
										id="percentage"
										type="number"
										step="any"
										{...register("percentage", { valueAsNumber: true })}
									/>
									{errors.percentage && (
										<p className="text-sm text-red-500">
											{errors.percentage.message}
										</p>
									)}
								</div>
							</div>

							{/* Target Date */}
							<div className="flex items-start gap-4">
								<Label htmlFor="targetDate" className="w-32 text-right pt-2">
									Target Date
								</Label>
								<div className="flex-1 space-y-1">
									<Input
										id="targetDate"
										type="date"
										{...register("targetDate")}
									/>
									{errors.targetDate && (
										<p className="text-sm text-red-500">
											{errors.targetDate.message}
										</p>
									)}
								</div>
							</div>

							{/* Achieved Date */}
							<div className="flex items-start gap-4">
								<Label htmlFor="achievedDate" className="w-32 text-right pt-2">
									Achieved Date
								</Label>
								<div className="flex-1 space-y-1">
									<Input
										id="achievedDate"
										type="date"
										{...register("achievedDate")}
									/>
									{errors.achievedDate && (
										<p className="text-sm text-red-500">
											{errors.achievedDate.message}
										</p>
									)}
								</div>
							</div>

							{/* Description */}
							<div className="md:col-span-2 flex items-start gap-4">
								<Label htmlFor="description" className="w-32 text-right pt-2">
									Description
								</Label>
								<div className="flex-1 space-y-1">
									<Textarea id="description" {...register("description")} />
									{errors.description && (
										<p className="text-sm text-red-500">
											{errors.description.message}
										</p>
									)}
								</div>
							</div>
						</div>

						<Button
							type="submit"
							disabled={isPending}
							className="ml-auto block"
						>
							{isPending ? "Saving..." : "Save Changes"}
						</Button>
					</form>
				</div>
			</div>
		</>
	);
}
