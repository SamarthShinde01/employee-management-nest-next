"use client";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import DashboardHeader from "@/components/dashboard-header";
import { useQuery } from "@tanstack/react-query";
import { allCounts, getUser, taskCounts } from "@/lib/api";
import CountCardDashboard from "@/components/CountsCardDashboard";
import { PieChartDepartments } from "@/components/pie-chart";
import { RadialMilestonesChart } from "@/components/radial-chart";
import { formatINR } from "@/lib/utils";

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

export default function HomePageDashboard() {
	const { user } = useAuth(); // @ts-ignore
	const employeeId = user?.id;

	const { data: taskStatusCounts } = useQuery({
		queryKey: ["taskCounts", employeeId],
		queryFn: () => taskCounts(employeeId!), // @ts-ignore
		enabled: user?.role === "USER",
	});
	const { data: allCountsResponse } = useQuery({
		queryKey: ["allCounts"],
		queryFn: allCounts, // @ts-ignore
		enabled: user?.role === "ADMIN",
	});

	return (
		<>
			<DashboardHeader
				title="Home Page"
				link="/"
				pageName={
					// @ts-ignore
					user?.role === "ADMIN" ? "Admin Dashboard" : "Employee Dashboard"
				}
			/>

			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				{
					// @ts-ignore
					user?.role === "USER" ? (
						<div className="grid auto-rows-min gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
							<CountCardDashboard // @ts-ignore
								count={taskStatusCounts?.statusCounts?.PENDING}
								countName="Pending Tasks"
							/>
							<CountCardDashboard // @ts-ignore
								count={taskStatusCounts?.statusCounts?.IN_PROGRESS}
								countName="In Progress Task"
							/>
							<CountCardDashboard // @ts-ignore
								count={taskStatusCounts?.statusCounts?.COMPLETED}
								countName="Completed Task"
							/>
						</div>
					) : (
						<div className="grid auto-rows-min gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
							<CountCardDashboard // @ts-ignore
								count={allCountsResponse?.totalEmployees}
								countName="Employees"
							/>
							<CountCardDashboard // @ts-ignore
								count={allCountsResponse?.activeEmployees}
								countName="Active Employees"
							/>
							<CountCardDashboard // @ts-ignore
								count={allCountsResponse?.inactiveEmployees}
								countName="Inactive Employees"
							/>
							<CountCardDashboard // @ts-ignore
								count={allCountsResponse?.totalProjects}
								countName="Projects"
							/>
							<CountCardDashboard // @ts-ignore
								count={allCountsResponse?.totalDepartments}
								countName="Departments"
							/>
							<CountCardDashboard // @ts-ignore
								count={formatINR(allCountsResponse?.totalAnnualRevenue) || 0}
								countName="Annual Revenue"
							/>
						</div>
					)
				}

				{
					// @ts-ignore
					user?.role === "ADMIN" && (
						<>
							<div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
								<ChartAreaInteractive />
							</div>

							<div className="min-h-[100vh] w-full flex gap-2 rounded-xl md:min-h-min">
								<div className="w-1/2">
									<PieChartDepartments />
								</div>
								<div className="w-full h-full">
									<RadialMilestonesChart />
								</div>
							</div>
						</>
					)
				}
			</div>
		</>
	);
}
