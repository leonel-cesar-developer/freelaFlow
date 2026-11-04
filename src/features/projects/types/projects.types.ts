export type ProjectStatus =
  | "PLANNING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface Project {
  id: string;
  name: string;
  description: string;
  clientId: string | null;
  status: ProjectStatus;
  budget: number;
  startDate: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CreateProjectInput = Pick<
  Project,
  "name" | "description" | "clientId" | "budget" | "startDate" | "dueDate"
>;

export type UpdateProjectInput = Partial<
  CreateProjectInput & Pick<Project, "status">
>;
