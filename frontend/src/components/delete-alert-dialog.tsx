"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type DeleteAlertDialogProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	title?: string;
	description?: string;
	onConfirm: () => void;
};

export default function DeleteAlertDialog({
	open,
	setOpen,
	title = "Are you absolutely sure?",
	description = "This action cannot be undone.",
	onConfirm,
}: DeleteAlertDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={() => setOpen(false)}>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							setOpen(false);

							onConfirm();
						}}
					>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
