"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { login } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import AuthPage from "../auth-page"; // <-- Make sure this exists or create one

const signInSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(5, "Password must be at least 5 characters"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInForm({
	className,
}: React.ComponentProps<"form">) {
	const router = useRouter();
	// const searchparams = useSearchParams();
	// const redirectUrl = searchparams.get("redirectUrl") || "/";

	const form = useForm<SignInFormValues>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const {
		mutate: signIn,
		isPending,
		isError,
	} = useMutation({
		mutationFn: login,
		onSuccess: () => {
			toast.success("Logged in successfully");
			// router.replace(redirectUrl);
			router.push("/");
		},
		onError: () => {
			toast.error("Something is wrong with sign in");
		},
	});

	function onSubmit(value: SignInFormValues) {
		try {
			signIn(value);
		} catch (error) {
			toast.error("Error occurred while signing in");
			console.error("Sign-in error:", error);
		}
	}

	return (
		<AuthPage>
			{isError && toast("Invalid email or password")}

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className={cn("flex flex-col gap-6", className)}
				>
					<div className="flex flex-col items-center gap-2 text-center">
						<h1 className="text-2xl font-bold">Login to your account</h1>
						<p className="text-muted-foreground text-sm text-balance">
							Enter your email below to login to your account
						</p>
					</div>

					<div className="grid gap-6">
						{/* Email */}
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="email"
											placeholder="m@example.com"
											autoFocus
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Password */}
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<div className="flex items-center">
										<FormLabel>Password</FormLabel>
										<a
											href="#"
											className="ml-auto text-sm underline-offset-4 hover:underline"
										>
											Forgot your password?
										</a>
									</div>
									<FormControl>
										<Input {...field} type="password" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" disabled={isPending} className="w-full">
							Login
						</Button>
					</div>
				</form>
			</Form>
		</AuthPage>
	);
}
