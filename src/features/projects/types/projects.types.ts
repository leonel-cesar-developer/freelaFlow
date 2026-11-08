import { z } from "zod";

import {
  projectSchema,
  projectStatusSchema,
  createProjectSchema,
  updateProjectSchema,
} from "../schemas/projects.schema";

export type ProjectStatus = z.infer<typeof projectStatusSchema>;
export type Project = z.infer<typeof projectSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;