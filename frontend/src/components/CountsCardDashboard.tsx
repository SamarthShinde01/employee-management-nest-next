"use client";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type CountCardDashboardTypes = {
	count: number | string;
	countName: string;
};

const CountCardDashboard = ({ count, countName }: CountCardDashboardTypes) => {
	return (
		<Card className="@container/card">
			<CardHeader className="relative">
				<CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
					{count}
				</CardTitle>
			</CardHeader>
			<CardFooter className="flex-col items-start gap-1 text-sm">
				<div className="line-clamp-1 flex gap-2 text-xl font-bold">
					{countName}
				</div>
			</CardFooter>
		</Card>
	);
};

export default CountCardDashboard;
