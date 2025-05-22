"use client";

import { Pie, PieChart, Tooltip } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { getExpenseDataForPie } from "@/lib/api";

// Define some base chart colors (expand as needed)
const chartColors = [
	"#4285F4", // blue
	"#FFD700", // gold
	"#FF7139", // orange
	"#0078D7", // edge blue
	"#9CA3AF", // gray
	"#34D399", // green
	"#EC4899", // pink
	"#8B5CF6", // purple
];

export function PieChartDepartments() {
	const { data: pieChartData = [] } = useQuery({
		queryKey: ["expensePieChartData"],
		queryFn: getExpenseDataForPie,
	});

	// Transform data for recharts format
	const chartData = pieChartData.map((item, index) => ({
		name: item.department,
		value: item.total,
		fill: chartColors[index % chartColors.length],
	}));

	// Dynamic config for ChartContainer
	const chartConfig = chartData.reduce((config, item) => {
		config[item.name] = {
			label: item.name,
			color: item.fill,
		};
		return config;
	}, {} as Record<string, { label: string; color: string }>);

	return (
		<Card className="flex flex-col">
			<CardHeader className="items-center pb-0">
				<CardTitle>Department Wise Expenses</CardTitle>
				<CardDescription>All time expenses</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto w-full aspect-square max-h-[300px]"
				>
					<PieChart>
						<Pie
							data={chartData}
							dataKey="value"
							nameKey="name"
							fill="#8884d8"
							labelLine={false}
						/>
						<Tooltip
							formatter={(value: number, name: string) => [
								`₹${value.toLocaleString()}`,
								name,
							]}
						/>
						<ChartLegend
							content={<ChartLegendContent nameKey="name" />}
							className="flex flex-wrap gap-x-4 gap-y-2 justify-start items-center"
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
