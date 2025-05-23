"use client";

import {
	ChevronsUpDown,
	CreditCard,
	LogOut,
	SettingsIcon,
	User2Icon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/lib/api";
import { useRouter } from "next/navigation";

export function NavUser({
	user,
}: {
	user: {
		name: string;
		email: string;
		avatar: string;
	};
}) {
	const { isMobile } = useSidebar();
	const router = useRouter();

	// const searchparams = useSearchParams();
	// const redirectUrl = searchparams.get("redirectUrl") || "/signin";

	const { mutate: logoutUser } = useMutation({
		mutationFn: logout,
		onSuccess: () => {
			// router.replace(redirectUrl);
			router.push("/signin");
			window.location.reload();
		},
		onError: (error) => {
			console.error("Delete failed:", error);
		},
	});

	return (
		<>
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<Avatar className="h-8 w-8 rounded-lg">
									{/* src={`${import.meta.env.VITE_API_URL}/images/${profileImage}`} */}
									<AvatarImage
										className="object-cover"
										src={
											`${process.env.NEXT_PUBLIC_API_URL}/uploads/images/${user.avatar}` ||
											"https://github.com/shadcn.png"
										}
										alt={user.name}
									/>
									<AvatarFallback className="rounded-lg">CN</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">{user.name}</span>
									<span className="truncate text-xs">{user.email}</span>
								</div>
								<ChevronsUpDown className="ml-auto size-4" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
							side={isMobile ? "bottom" : "right"}
							align="end"
							sideOffset={4}
						>
							<DropdownMenuLabel className="p-0 font-normal">
								<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage
											src={
												`${process.env.NEXT_PUBLIC_API_URL}/uploads/images/${user.avatar}` ||
												"https://github.com/shadcn.png"
											}
											alt={user.name || "@shadcn"}
										/>
										<AvatarFallback className="rounded-lg">CN</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-medium">{user.name}</span>
										<span className="truncate text-xs">{user.email}</span>
									</div>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem onClick={() => router.push("/profile")}>
									<User2Icon />
									Profile Settings
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem onClick={() => router.push("/settings")}>
									<SettingsIcon />
									Settings
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => router.push("/")}>
									<CreditCard />
									Billing
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								// @ts-ignore
								onClick={logoutUser}
							>
								<LogOut className="mr-2 h-4 w-4" />
								Log out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>
		</>
	);
}
