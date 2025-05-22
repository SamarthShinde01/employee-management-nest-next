"use client";

import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function InputField({
	label,
	id,
	register,
	error,
	type = "text",
}: {
	label: string;
	id: any;
	register: any;
	error?: string;
	type?: string;
}) {
	return (
		<div className="flex items-start gap-4">
			<Label htmlFor={id} className="w-32 text-right pt-2">
				{label}
			</Label>
			<div className="flex-1 space-y-1">
				<Input id={id} type={type} {...register(id)} />
				{error && <p className="text-sm text-red-500">{error}</p>}
			</div>
		</div>
	);
}
