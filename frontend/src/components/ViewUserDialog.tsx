"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface ViewUserDialogTypes {
	selectedUser: any;
	isViewModalOpen: boolean;
	setIsViewModalOpen: (open: boolean) => void;
}

const ViewUserDialog = ({
	selectedUser,
	isViewModalOpen,
	setIsViewModalOpen,
}: ViewUserDialogTypes) => {
	return (
		<Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
			<DialogContent className="sm:max-w-[650px] rounded-lg">
				<DialogHeader className="px-1">
					<DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
						Employee Details
					</DialogTitle>
				</DialogHeader>

				{selectedUser && (
					<div className="space-y-6 px-1 py-2">
						{/* Profile Header */}
						<div className="flex items-start gap-5">
							<Avatar className="h-24 w-24 border-2 border-gray-200 dark:border-gray-700">
								<AvatarImage
									src={
										`${process.env.NEXT_PUBLIC_API_URL}/uploads/images/${selectedUser.profileImage}` ||
										"https://github.com/shadcn.png"
									}
									alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
									className="object-cover"
								/>
								<AvatarFallback className="text-lg font-medium bg-gray-100 dark:bg-gray-800">
									{selectedUser.firstName?.[0]}
									{selectedUser.lastName?.[0]}
								</AvatarFallback>
							</Avatar>

							<div className="space-y-2">
								<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
									{selectedUser.firstName} {selectedUser.lastName}
								</h2>
								<p className="text-lg text-gray-600 dark:text-gray-400">
									{selectedUser.jobTitle}
								</p>
								<div className="flex items-center gap-3">
									<Badge
										variant={
											selectedUser.status === "ACTIVE"
												? "default"
												: "destructive"
										}
										className="text-sm px-3 py-1"
									>
										{selectedUser.status}
									</Badge>
									<span className="text-sm text-gray-500 dark:text-gray-400">
										ID: {selectedUser.empId}
									</span>
								</div>
							</div>
						</div>

						<Separator className="my-4" />

						{/* Details Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<DetailItem label="Email" value={selectedUser.email} />
							<DetailItem label="Phone" value={selectedUser.phone} />
							<DetailItem
								label="Department"
								value={selectedUser.department?.name || "N/A"}
							/>
							<DetailItem label="DOB" value={formatDate(selectedUser.dob)} />
							<DetailItem
								label="Salary"
								value={selectedUser?.salary || "N/A"}
							/>
							<DetailItem
								label="Join Date"
								value={formatDate(selectedUser.hireDate)}
							/>
							<DetailItem label="State" value={selectedUser?.state || "N/A"} />
							<DetailItem label="City" value={selectedUser?.city || "N/A"} />
							<DetailItem
								label="Address"
								value={selectedUser?.address || "N/A"}
							/>
							<DetailItem
								label="Pincode"
								value={selectedUser?.pincode || "N/A"}
							/>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
};

// Reusable detail component
const DetailItem = ({ label, value }: { label: string; value: string }) => (
	<div className="space-y-1">
		<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
			{label}
		</p>
		<p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
			{value || "N/A"}
		</p>
	</div>
);

export default ViewUserDialog;
