"use client";

import * as React from "react";
import {
	AudioWaveform,
	GalleryVerticalEnd,
	Users,
	ListCheckIcon,
	ComputerIcon,
	TypeIcon,
	ArrowUpRightSquareIcon,
	IndianRupeeIcon,
	ListIcon,
	TrophyIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/lib/api";
import { usePathname } from "next/navigation";

export const AUTH_QUERY_KEY = "auth";

const useAuth = (options = {}) => {
	const { data: user, ...rest } = useQuery({
		queryKey: [AUTH_QUERY_KEY],
		queryFn: getUser,
		staleTime: Infinity,
		...options,
	});

	return { user, ...rest };
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const pathname = usePathname();
	const { user } = useAuth();

	if (!user) return null;

	const userData = {
		// @ts-ignore
		name: `${user.firstName} ${user.lastName}`, // @ts-ignore
		email: user.email, // @ts-ignore
		avatar: user.profileImage || "/avatars/default.jpg",
	};

	const teamName = // @ts-ignore
		user.role === "ADMIN" ? "Admin Dashboard" : "Employee Dashboard";

	const teamData = [
		{
			name: teamName, // @ts-ignore
			logo: user.role === "ADMIN" ? GalleryVerticalEnd : AudioWaveform, // @ts-ignore
			plan: user.role,
		},
	];

	const navMain = // @ts-ignore
		user.role === "ADMIN"
			? [
					{
						title: "Employees",
						url: "#",
						icon: Users,
						items: [
							{ title: "Add Employees", url: "/employees-add" },
							{ title: "Manage Employees", url: "/employees-manage" },
						],
					},
					{
						title: "Projects",
						url: "#",
						icon: ListIcon,
						items: [
							{ title: "Add Projects", url: "/projects-add" },
							{ title: "Manage Projects", url: "/projects-manage" },
						],
					},
					{
						title: "Tasks",
						url: "#",
						icon: ListCheckIcon,
						items: [
							{ title: "Task Assign", url: "/task-assign" },
							{ title: "Task Manage", url: "/task-manage" },
						],
					},
					{
						title: "Expense Tracker",
						url: "#",
						icon: IndianRupeeIcon,
						items: [
							{ title: "Expense Add", url: "/expense-add" },
							{ title: "Expense Manage", url: "/expense-manage" },
						],
					},
					// {
					//   title: "Events",
					//   url: "#",
					//   icon: EclipseIcon,
					//   items: [
					//     { title: "Events Add", url: "/events-add" },
					//     { title: "Events Manage", url: "/events" },
					//   ],
					// },
					{
						title: "Milestones",
						url: "#",
						icon: TrophyIcon,
						items: [
							{ title: "Milestones Add", url: "/milestones-add" },
							{ title: "Milestones Manage", url: "/milestones" },
						],
					},
					{ divider: true },
					{
						title: "Departments",
						url: "#",
						icon: ComputerIcon,
						items: [{ title: "Departments", url: "/departments" }],
					},
					{
						title: "Expense Category",
						url: "#",
						icon: TypeIcon,
						items: [{ title: "Expense Category", url: "/expensecat" }],
					},
					{
						title: "Products",
						url: "#",
						icon: ArrowUpRightSquareIcon,
						items: [{ title: "Products", url: "/products" }],
					},
			  ]
			: [
					{
						title: "Tasks",
						url: "/tasks",
						icon: ListCheckIcon,
						items: [{ title: "View Tasks", url: "/tasks" }],
					},
					{
						title: "Expenses",
						url: "#",
						icon: IndianRupeeIcon,
						items: [
							{ title: "Expense Add", url: "/empexp-add" },
							{ title: "Expense Manage", url: "/empexp-manage" },
						],
					},
			  ];

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={teamData} />
			</SidebarHeader>

			<SidebarContent>
				<NavMain
					// @ts-ignore
					items={navMain}
					activePath={pathname}
				/>
			</SidebarContent>

			<SidebarFooter>
				<NavUser user={userData} />
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
