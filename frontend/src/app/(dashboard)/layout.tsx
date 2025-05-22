// app/dashboard/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/lib/api";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { AppSidebar } from "@/components/app-sidebar";

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

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user, isLoading } = useAuth();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		if (!isLoading && !user) {
			router.replace(`/signin?redirectUrl=${pathname}`);
		}
	}, [user, isLoading, pathname, router]);

	if (isLoading || !user) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				Loading...
			</div>
		);
	}

	return (
		<>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<SidebarProvider>
					<AppSidebar />
					<SidebarInset>{children}</SidebarInset>
				</SidebarProvider>
			</ThemeProvider>
		</>
	);
}
