"use client";

import { RadialBar, RadialBarChart } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
} from "@/components/ui/chart";
import { getRadialMilestonesChart } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function RadialMilestonesChart() {
	const { data: radialChartData = [] } = useQuery({
		queryKey: ["milestonesRadialChart"],
		queryFn: getRadialMilestonesChart,
	});

	const achievedColors = [
		"#0088FE",
		"#8884D8",
		"#FFBB28",
		"#FF8042",
		"#00C49F",
	];

	const chartData = radialChartData?.map((p: any, i: any) => ({
		name: p.projectName,
		value: p.achievedPercentage,
		fill: achievedColors[i % achievedColors.length],
		remaining: p.remainingPercentage,
	}));

	const chartConfig = {
		value: {
			label: "Achieved",
		},
		...chartData.reduce(
			(acc: any, entry: any, i: any) => ({
				...acc,
				[entry.name]: {
					label: entry.name,
					color: entry.fill,
				},
			}),
			{}
		),
	} satisfies ChartConfig;

	return (
		<Card className="flex flex-col h-full">
			<CardHeader className="items-center pb-0">
				<CardTitle>Milestones Chart</CardTitle>
				<CardDescription>All Time</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square max-h-[250px]"
				>
					<RadialBarChart
						data={chartData}
						startAngle={-90}
						endAngle={380}
						innerRadius={30}
						outerRadius={110}
					>
						<ChartTooltip
							cursor={false}
							content={({ active, payload }) => {
								if (active && payload && payload.length) {
									const data = payload[0].payload;
									return (
										<div className="rounded-lg border bg-background p-4 shadow-lg space-y-1 w-56">
											<p className="text-sm font-semibold text-foreground">
												{data.name}
											</p>
											<div className="flex items-center justify-between text-sm">
												<span className="text-muted-foreground">Achieved</span>
												<span
													className="font-medium"
													style={{ color: data.fill }}
												>
													{data.value}%
												</span>
											</div>
											<div className="flex items-center justify-between text-sm">
												<span className="text-muted-foreground">Remaining</span>
												<span className="font-medium text-muted-foreground">
													{data.remaining}%
												</span>
											</div>
										</div>
									);
								}
								return null;
							}}
						/>

						<RadialBar dataKey="value" background>
							{chartData.map((entry: any, index: any) => (
								<RadialBar
									key={`bar-${index}`}
									dataKey="value"
									data={[entry]}
									cornerRadius={10}
									fill={entry.fill}
								/>
							))}
						</RadialBar>

						<ChartLegend
							content={
								<ChartLegendContent
									payload={chartData.map((entry: any) => ({
										value: entry.name,
										type: "square",
										color: entry.fill,
										id: entry.name,
									}))}
								/>
							}
							className="flex flex-wrap gap-x-4 gap-y-2 justify-start items-center"
						/>
					</RadialBarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
