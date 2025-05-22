import API from "../config/apiClient";

//auth apis
export const login = async (data: any) => API.post("/auth/login", data);
export const logout = async () => API.post("/auth/logout");

//users apis
export const register = async (data: any) => {
	return API.post("/api/users", data, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};
export const getUser = async () => API.get("/auth/me");
export const getUserById = async (id: string) => API.get(`/api/users/${id}`);
export const getUsers = async () => API.get("/api/users");
export const updateUser = async ({ data, id }: any) =>
	API.put(`/api/users/update/${id}`, data);
export const deleteUser = async (id: string) =>
	API.delete(`/api/users/delete/${id}`);

//tasks apis
export const assignTask = async (data: any) =>
	API.post("/api/users/assign-task", data);
export const viewEmployeeTasks = async (id: string) =>
	API.get(`/api/users/view-task/${id}`);
export const updateStatus = async ({ data, employeeId }: any) =>
	API.put(`/api/users/update-status/${employeeId}`, data);
export const taskCounts = async (employeeId: string) =>
	API.get(`/api/users/task-counts/${employeeId}`);
export const allCounts = async () => API.get("/api/users/all-counts");

//departments apis
export const getDepartments = async () => API.get("/api/departments");
export const createDepartment = async (data: any) =>
	API.post("/api/departments/create", data);
export const updateDepartment = async ({ data, departmentId }: any) =>
	API.put(`/api/departments/update/${departmentId}`, data);
export const deleteDepartment = async (departmentId: any) =>
	API.delete(`/api/departments/delete/${departmentId}`);

//Expense category apis
export const getExpenseCategories = async () => API.get("/api/expense-cat");
export const createExpenseCategory = async (data: any) =>
	API.post("/api/expense-cat/create", data);
export const updateExpenseCategory = async ({ data, expenseCatId }: any) =>
	API.put(`/api/expense-cat/update/${expenseCatId}`, data);
export const deleteExpenseCategory = async (expenseCatId: any) =>
	API.delete(`/api/expense-cat/delete/${expenseCatId}`);

//Products apis
export const getProducts = async () => API.get("/api/products");
export const createProducts = async (data: any) =>
	API.post("/api/products/create", data);
export const updateProducts = async ({ data, productId }: any) =>
	API.put(`/api/products/update/${productId}`, data);
export const deleteProduct = async (productId: any) =>
	API.delete(`/api/products/delete/${productId}`);

//Expense apis
export const getExpenses = async () => API.get("/api/expenses");
export const getEmployeeExpenses = async (employeeId: string) =>
	API.get(`/api/expenses/employee/${employeeId}`);
export const getExpense = async (expenseId: string) =>
	API.get(`/api/expenses/${expenseId}`);
export const createExpense = async (data: any) =>
	API.post("/api/expenses/create", data);
export const updateExpense = async ({
	expenseId,
	data,
}: {
	expenseId: string;
	data: any;
}) => API.put(`/api/expenses/update/${expenseId}`, data);
export const deleteExpense = async (expenseId: string) =>
	API.delete(`/api/expenses/delete/${expenseId}`);
export const getExpenseDataForChart = async () =>
	API.get("/api/expenses/chart-data");
export const getExpenseDataForPie = () => API.get("/api/expenses/pie-data");

//projects apis
export const getProjects = () => API.get("/api/projects/");
export const getProjectById = (projectId: string) =>
	API.get(`/api/projects/${projectId}`);
export const createProject = (data: any) =>
	API.post("/api/projects/create", data);
export const updateProject = ({ data, projectId }: any) =>
	API.put(`/api/projects/update/${projectId}`, data);
export const deleteProject = (projectId: string) =>
	API.delete(`/api/projects/delete/${projectId}`);
export const updateProjectStatus = (projectId: string) =>
	API.put(`/api/projects/status/${projectId}`);

//milestones apis
export const getMilestones = () => API.get("/api/milestones");
export const getMistoneById = (projectId: string) =>
	API.get(`/api/milestones/${projectId}`);
export const getRadialMilestonesChart = () =>
	API.get(`/api/milestones/charts/radial-chart`);
export const getMistoneByMilestoneId = (milestoneId: string) =>
	API.get(`/api/milestones/milestone-by-milestoneId/${milestoneId}`);
export const createMilestone = (data: any) => API.post("/api/milestones", data);
export const updateMilestone = ({ data, milestoneId }: any) =>
	API.put(`/api/milestones/update/${milestoneId}`, data);
export const deleteMilestone = (milestoneId: string) =>
	API.delete(`/api/milestones/delete/${milestoneId}`);

//milestones apis
export const getEvents = async () => API.get("/api/events");
export const getEventById = async (eventId: string) =>
	API.get(`/api/events/${eventId}`);
export const createEvent = async (data: any) =>
	API.post("/api/events/create", data);
export const updateEvent = async ({ data, eventId }: any) =>
	API.put(`/api/events/update/${eventId}`, data);
export const deleteEvent = async (eventId: string) =>
	API.delete(`/api/events/delete/${eventId}`);
