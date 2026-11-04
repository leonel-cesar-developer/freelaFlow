import { z } from "zod";

export const projectStatusSchema = z.enum([
  "PLANNING",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);

export const projectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1),
  description: z.string(),
  clientId: z.string().nullable(),
  status: projectStatusSchema,
  budget: z.number().finite().nonnegative(),
  startDate: z.string().nullable(),
  dueDate: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createProjectSchema = projectSchema.pick({
  name: true,
  description: true,
  clientId: true,
  budget: true,
  startDate: true,
  dueDate: true,
});

export const updateProjectSchema = createProjectSchema
  .extend({
    status: projectStatusSchema,
  })
  .partial();

export const projectsSchema = z.array(projectSchema);
