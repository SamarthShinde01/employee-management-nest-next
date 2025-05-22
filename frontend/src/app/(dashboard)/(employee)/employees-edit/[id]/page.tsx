"use client";

import DashboardHeader from "@/components/dashboard-header";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import indianStatesWithCities from "@/data/indianStatesAndCities";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getDepartments, getUserById, updateUser } from "@/lib/api";
import { toast } from "sonner";
import { useParams, useRouter, useSearchParams } from "next/navigation";

const editUserSchema = z
	.object({
		firstName: z.string().min(1, "First name is required"),
		lastName: z.string().min(1, "Last name is required"),
		email: z.string().email("Invalid email"),
		phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
		dob: z.date({ required_error: "Date of Birth is required." }),
		departmentId: z.string().min(1, "Department is required"),
		jobTitle: z.string().min(1, "Job title is required"),
		salary: z.string().min(1, "Salary is required"),
		hireDate: z.date({ required_error: "Hire date is required" }),
		address: z.string().min(1, "Address is required"),
		state: z
			.string()
			.optional()
			.refine((val) => !val || val !== "", {
				message: "Please select a valid state",
			}),
		city: z
			.string()
			.optional()
			.refine((val) => !val || val !== "", {
				message: "Please select a valid city",
			}),
		pincode: z.string().min(1, "Pincode is required"),
		password: z.string().min(5, "Password must be at least 5 characters"),
		confirmPassword: z.string(),
		profileImage: z
			.any()
			.optional()
			.refine(
				(file: FileList) =>
					!file || file.length === 0 || file[0] instanceof File,
				"Invalid file"
			),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type EditUserFormData = z.infer<typeof editUserSchema>;

export default function EmployeesEditPage() {
	const { id } = useParams<{ id: string }>();

	const [selectedState, setSelectedState] = useState<string>("");

	// Fetch user data
	const { data: user } = useQuery({
		queryKey: ["user", id],
		queryFn: () => getUserById(id!),
		enabled: !!id,
	});

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		setValue,
		watch,
		reset,
	} = useForm<EditUserFormData>({
		resolver: zodResolver(editUserSchema),
	});

	// Set form values when user data is loaded
	useEffect(() => {
		if (user) {
			reset({
				firstName: user.firstName || "",
				lastName: user.lastName || "",
				email: user.email || "",
				phone: user.phone || "",
				dob: user.dob ? new Date(user.dob) : undefined,
				departmentId: user.departmentId || "",
				jobTitle: user.jobTitle || "",
				salary: user.salary || "",
				hireDate: user.hireDate ? new Date(user.hireDate) : undefined,
				address: user.address || "",
				state: user.state || "",
				city: user.city || "",
				pincode: user.pincode || "",
				password: user.password || "",
				confirmPassword: user.password || "",
				profileImage: undefined,
			});
			setSelectedState(user.state || "");
		}
	}, [user, reset]);

	const router = useRouter();
	const searchparams = useSearchParams();
	const redirectUrl = searchparams.get("redirectUrl") || "/employees-manage";
	const {
		mutate: updateEmployee,
		isPending,
		isError,
	} = useMutation({
		mutationFn: updateUser,
		onSuccess: () => {
			router.replace(redirectUrl);
		},
	});

	const { data: departments } = useQuery({
		queryKey: ["departments"],
		queryFn: getDepartments,
	});

	const onSubmit = (value: EditUserFormData) => {
		try {
			updateEmployee({ data: value, id });
		} catch (error: any) {
			toast(error);
			console.error(error);
		}
	};

	const cities = selectedState
		? (indianStatesWithCities as any)[selectedState] || []
		: [];

	return (
		<>
			{isError && toast("Invalid data submitted")}

			<DashboardHeader
				title="Employees"
				link="/employees-manage"
				pageName="Edit Employee"
			/>

			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				<h1 className="text-xl font-bold">Employee Update</h1>
				<div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-8 p-6 md:p-8"
					>
						<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
							{/* First Name */}
							<div className="flex items-start gap-4">
								<Label htmlFor="firstName" className="w-32 text-right pt-2">
									First Name
								</Label>
								<div className="flex-1 space-y-1">
									<Input id="firstName" {...register("firstName")} />
									{errors.firstName && (
										<p className="text-sm text-red-500">
											{errors.firstName.message}
										</p>
									)}
								</div>
							</div>

							{/* Last Name */}
							<div className="flex items-start gap-4">
								<Label htmlFor="lastName" className="w-32 text-right pt-2">
									Last Name
								</Label>
								<div className="flex-1 space-y-1">
									<Input id="lastName" {...register("lastName")} />
									{errors.lastName && (
										<p className="text-sm text-red-500">
											{errors.lastName.message}
										</p>
									)}
								</div>
							</div>

							{/* Profile Image */}
							<div className="flex items-start gap-4">
								<Label htmlFor="profileImage" className="w-32 text-right pt-2">
									Profile Image
								</Label>
								<div className="flex-1 space-y-1">
									<Input
										id="profileImage"
										type="file"
										accept="image/*"
										{...register("profileImage")}
									/>
									{errors.profileImage && (
										<p className="text-sm text-red-500">
											{/* {errors.profileImage.message} */}
										</p>
									)}
								</div>
							</div>

							{/* Email */}
							<div className="flex items-start gap-4">
								<Label htmlFor="email" className="w-32 text-right pt-2">
									Email
								</Label>
								<div className="flex-1 space-y-1">
									<Input id="email" {...register("email")} />
									{errors.email && (
										<p className="text-sm text-red-500">
											{errors.email.message}
										</p>
									)}
								</div>
							</div>

							{/* Phone */}
							<div className="flex items-start gap-4">
								<Label htmlFor="phone" className="w-32 text-right pt-2">
									Phone Number
								</Label>
								<div className="flex-1 space-y-1">
									<Input id="phone" {...register("phone")} />
									{errors.phone && (
										<p className="text-sm text-red-500">
											{errors.phone.message}
										</p>
									)}
								</div>
							</div>

							{/* Date of Birth */}
							<div className="flex items-start gap-4">
								<Label htmlFor="dob" className="w-32 text-right pt-2">
									Date of Birth
								</Label>
								<div className="flex-1 space-y-1">
									<Controller
										control={control}
										name="dob"
										render={({ field }) => (
											<>
												<Popover>
													<PopoverTrigger asChild>
														<Button
															variant="outline"
															className={cn(
																"w-full pl-3 text-left font-normal",
																!field.value && "text-muted-foreground"
															)}
														>
															{field.value ? (
																format(field.value, "PPP")
															) : (
																<span>Pick a date of birth</span>
															)}
															<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
														</Button>
													</PopoverTrigger>
													<PopoverContent className="w-auto p-0" align="start">
														<Calendar
															mode="single"
															selected={field.value}
															onSelect={field.onChange}
															disabled={(date) =>
																date > new Date() ||
																date < new Date("1900-01-01")
															}
															initialFocus
														/>
													</PopoverContent>
												</Popover>
												{errors.dob && (
													<p className="text-sm text-red-500">
														{errors.dob.message}
													</p>
												)}
											</>
										)}
									/>
								</div>
							</div>

							<div className="col-span-2 border-b border-slate-400" />

							{/* Department */}
							<div className="flex items-start gap-4">
								<Label htmlFor="department" className="w-32 text-right pt-2">
									Department
								</Label>
								<div className="flex-1 space-y-1">
									<Controller
										control={control}
										name="departmentId"
										render={({ field }) => (
											<Select
												onValueChange={field.onChange}
												value={field.value || user?.departmentId || ""}
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select Department" />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														{departments?.map((department: any) => (
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

							{/* Job Title */}
							<div className="flex items-start gap-4">
								<Label htmlFor="jobTitle" className="w-32 text-right pt-2">
									Job Title
								</Label>
								<div className="flex-1 space-y-1">
									<Input id="jobTitle" {...register("jobTitle")} />
									{errors.jobTitle && (
										<p className="text-sm text-red-500">
											{errors.jobTitle.message}
										</p>
									)}
								</div>
							</div>

							{/* Salary */}
							<div className="flex items-start gap-4">
								<Label htmlFor="salary" className="w-32 text-right pt-2">
									Salary
								</Label>
								<div className="flex-1 space-y-1">
									<Input id="salary" type="number" {...register("salary")} />
									{errors.salary && (
										<p className="text-sm text-red-500">
											{errors.salary.message}
										</p>
									)}
								</div>
							</div>

							{/* Hire Date */}
							<div className="flex items-start gap-4">
								<Label htmlFor="hireDate" className="w-32 text-right pt-2">
									Hire Date
								</Label>
								<div className="flex-1 space-y-1">
									<Controller
										control={control}
										name="hireDate"
										render={({ field }) => (
											<>
												<Popover>
													<PopoverTrigger asChild>
														<Button
															variant="outline"
															className={cn(
																"w-full pl-3 text-left font-normal",
																!field.value && "text-muted-foreground"
															)}
														>
															{field.value ? (
																format(field.value, "PPP")
															) : (
																<span>Pick a hire date</span>
															)}
															<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
														</Button>
													</PopoverTrigger>
													<PopoverContent className="w-auto p-0" align="start">
														<Calendar
															mode="single"
															selected={field.value}
															onSelect={field.onChange}
															disabled={(date) =>
																date > new Date() ||
																date < new Date("1900-01-01")
															}
															initialFocus
														/>
													</PopoverContent>
												</Popover>
												{errors.hireDate && (
													<p className="text-sm text-red-500">
														{errors.hireDate.message}
													</p>
												)}
											</>
										)}
									/>
								</div>
							</div>

							<div className="col-span-2 border-b border-slate-400" />

							{/* Address */}
							<div className="flex items-start gap-4">
								<Label htmlFor="address" className="w-32 text-right pt-2">
									Permanent Address
								</Label>
								<div className="flex-1 space-y-1">
									<Input id="address" {...register("address")} />
									{errors.address && (
										<p className="text-sm text-red-500">
											{errors.address.message}
										</p>
									)}
								</div>
							</div>

							{/* State Dropdown */}
							<div className="flex items-start gap-4">
								<Label htmlFor="state" className="w-32 text-right pt-2">
									State
								</Label>
								<div className="flex-1 space-y-1">
									<Select
										value={watch("state")}
										onValueChange={(value) => {
											setSelectedState(value);
											setValue("state", value); // <-- This line is important
											setValue("city", ""); // Reset city when state changes
										}}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select a state" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												{Object.keys(indianStatesWithCities).map((state) => (
													<SelectItem key={state} value={state}>
														{state}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
									{errors.state && (
										<p className="text-sm text-red-500">
											{errors.state.message}
										</p>
									)}
								</div>
							</div>

							{/* City Dropdown */}
							<div className="flex items-start gap-4">
								<Label htmlFor="city" className="w-32 text-right pt-2">
									City
								</Label>
								<div className="flex-1 space-y-1">
									<Select
										{...register("city")}
										value={watch("city")}
										onValueChange={(value) => setValue("city", value)}
										disabled={!selectedState}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select a city" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												{cities.map((city: any) => (
													<SelectItem key={city} value={city}>
														{city}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
									{errors.city && (
										<p className="text-sm text-red-500">
											{errors.city.message}
										</p>
									)}
								</div>
							</div>

							{/* Pincode */}
							<div className="flex items-start gap-4">
								<Label htmlFor="pincode" className="w-32 text-right pt-2">
									Pincode
								</Label>
								<div className="flex-1 space-y-1">
									<Input id="pincode" {...register("pincode")} />
									{errors.pincode && (
										<p className="text-sm text-red-500">
											{errors.pincode.message}
										</p>
									)}
								</div>
							</div>

							<div className="col-span-2 border-b border-slate-400" />

							{/* Password */}
							<div className="flex items-start gap-4">
								<Label htmlFor="password" className="w-32 text-right pt-2">
									Password
								</Label>
								<div className="flex-1 space-y-1">
									<Input
										id="password"
										type="password"
										{...register("password")}
									/>
									{errors.password && (
										<p className="text-sm text-red-500">
											{errors.password.message}
										</p>
									)}
								</div>
							</div>

							{/* Confirm Password */}
							<div className="flex items-start gap-4">
								<Label
									htmlFor="confirmPassword"
									className="w-32 text-right pt-2"
								>
									Confirm Password
								</Label>
								<div className="flex-1 space-y-1">
									<Input
										id="confirmPassword"
										type="password"
										{...register("confirmPassword")}
									/>
									{errors.confirmPassword && (
										<p className="text-sm text-red-500">
											{errors.confirmPassword.message}
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
							Add Employee
						</Button>
					</form>
				</div>
			</div>
		</>
	);
}
