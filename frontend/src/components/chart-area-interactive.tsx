"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useQuery } from "@tanstack/react-query";
import { getExpenseDataForChart } from "@/lib/api";

const categoryColors = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"]; // Add more as needed

const getChartConfig = (keys: string[]) => {
	const config: Record<string, { label: string; color: string }> = {};
	keys.forEach((key, index) => {
		config[key] = {
			label: key[0].toUpperCase() + key.slice(1),
			color: categoryColors[index % categoryColors.length],
		};
	});
	return config;
};

export function ChartAreaInteractive() {
	const isMobile = useIsMobile();
	const [timeRange, setTimeRange] = React.useState("year");

	const { data: chartData } = useQuery({
		queryKey: ["expenseChartData"],
		queryFn: getExpenseDataForChart,
	});

	const cleanedData = React.useMemo(() => {
		if (!chartData) return [];

		return chartData.map((entry) => {
			const cleanedEntry: Record<string, any> = { date: entry.date };
			Object.entries(entry).forEach(([key, value]) => {
				if (key !== "date") {
					const trimmedKey = key.trim();
					cleanedEntry[trimmedKey] = value;
				}
			});
			return cleanedEntry;
		});
	}, [chartData]);

	const categories = Array.from(
		new Set(
			cleanedData.flatMap((entry) =>
				Object.keys(entry).filter((k) => k !== "date")
			)
		)
	);

	const normalized = cleanedData.map((entry) => {
		const normalizedEntry: Record<string, any> = { date: entry.date };
		categories.forEach((cat) => {
			normalizedEntry[cat] = entry[cat] || 0;
		});
		return normalizedEntry;
	});

	const chartKeys = categories;
	const chartConfig = getChartConfig(chartKeys);

	React.useEffect(() => {
		if (isMobile) {
			setTimeRange("year");
		}
	}, [isMobile]);

	const filteredData = React.useMemo(() => {
		return normalized.filter((item) => {
			const date = new Date(item.date);
			let startDate: Date;

			if (timeRange === "year") {
				const currentYear = new Date().getFullYear();
				startDate = new Date(currentYear, 0, 1); // Jan 1st of current year
			} else {
				const daysToSubtract =
					timeRange === "30d" ? 30 : timeRange === "7d" ? 7 : 90;
				startDate = new Date();
				startDate.setDate(startDate.getDate() - daysToSubtract);
			}

			return date >= startDate;
		});
	}, [normalized, timeRange]);

	// Group by month if viewing the whole year
	const monthlyData = React.useMemo(() => {
		if (timeRange !== "year") return filteredData;

		const monthlyGroups: Record<string, Record<string, number>> = {};

		filteredData.forEach((entry) => {
			const date = new Date(entry.date);
			const monthYear = `${date.getFullYear()}-${String(
				date.getMonth() + 1
			).padStart(2, "0")}`;

			if (!monthlyGroups[monthYear]) {
				monthlyGroups[monthYear] = { date: monthYear };
				chartKeys.forEach((key) => {
					monthlyGroups[monthYear][key] = 0;
				});
			}

			chartKeys.forEach((key) => {
				monthlyGroups[monthYear][key] += entry[key] || 0;
			});
		});

		return Object.values(monthlyGroups).sort(
			(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
		);
	}, [filteredData, timeRange, chartKeys]);

	const displayData = timeRange === "year" ? monthlyData : filteredData;

	return (
		<Card className="@container/card border-none w-full h-full shadow-none">
			<CardHeader className="relative">
				<CardTitle>Total Expenses per category</CardTitle>
				<CardDescription>
					{timeRange === "year"
						? "Yearly overview"
						: `Last ${
								timeRange === "90d"
									? "3 months"
									: timeRange === "30d"
									? "30 days"
									: "7 days"
						  }`}
				</CardDescription>
				<div className="absolute right-4 top-4">
					<ToggleGroup
						type="single"
						value={timeRange}
						onValueChange={(v) => v && setTimeRange(v)}
						variant="outline"
						className="@[767px]/card:flex hidden"
					>
						<ToggleGroupItem value="year" className="h-8 px-2.5">
							This Year
						</ToggleGroupItem>
						<ToggleGroupItem value="90d" className="h-8 px-2.5">
							3 Months
						</ToggleGroupItem>
						<ToggleGroupItem value="30d" className="h-8 px-2.5">
							30 Days
						</ToggleGroupItem>
						<ToggleGroupItem value="7d" className="h-8 px-2.5">
							7 Days
						</ToggleGroupItem>
					</ToggleGroup>
					<Select value={timeRange} onValueChange={setTimeRange}>
						<SelectTrigger
							className="@[767px]/card:hidden flex w-40"
							aria-label="Select time range"
						>
							<SelectValue placeholder="Select range" />
						</SelectTrigger>
						<SelectContent className="rounded-xl">
							<SelectItem value="year" className="rounded-lg">
								This Year
							</SelectItem>
							<SelectItem value="90d" className="rounded-lg">
								3 Months
							</SelectItem>
							<SelectItem value="30d" className="rounded-lg">
								30 Days
							</SelectItem>
							<SelectItem value="7d" className="rounded-lg">
								7 Days
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</CardHeader>
			<CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
				<ChartContainer
					config={chartConfig}
					className="aspect-auto h-[250px] w-full"
				>
					<AreaChart data={displayData}>
						<defs>
							{chartKeys.map((key) => (
								<linearGradient
									key={key}
									id={`fill-${key}`}
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop
										offset="5%"
										stopColor={chartConfig[key]?.color}
										stopOpacity={0.8}
									/>
									<stop
										offset="95%"
										stopColor={chartConfig[key]?.color}
										stopOpacity={0.1}
									/>
								</linearGradient>
							))}
						</defs>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={timeRange === "year" ? 0 : 32}
							tickFormatter={(value) => {
								if (timeRange === "year") {
									return new Date(value).toLocaleDateString("en-US", {
										month: "short",
									});
								}
								return new Date(value).toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								});
							}}
						/>
						<ChartTooltip
							cursor={false}
							content={
								<ChartTooltipContent
									labelFormatter={(value) => {
										if (timeRange === "year") {
											return new Date(value).toLocaleDateString("en-US", {
												month: "long",
												year: "numeric",
											});
										}
										return new Date(value).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: timeRange === "90d" ? undefined : "numeric",
										});
									}}
									indicator="dot"
								/>
							}
						/>
						{chartKeys.map((key) => (
							<Area
								key={key}
								type="monotone"
								dataKey={key}
								fill={`url(#fill-${key})`}
								stroke={chartConfig[key]?.color}
								strokeWidth={2}
							/>
						))}
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
