import { z } from "zod";

export const projectStatusSchema = z.enum([
  "PLANNING",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);

const dateSchema = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}$/,
    "A data deve estar no formato YYYY-MM-DD.",
  )
  .refine(
    (value) => {
      const date = new Date(`${value}T00:00:00Z`);

      return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
      );
    },
    "Data inválida.",
  )
  .nullable();

function validDateRange(data: {
  startDate: string | null;
  dueDate: string | null;
}) {
  return (
    !data.startDate ||
    !data.dueDate ||
    data.dueDate >= data.startDate
  );
}

const projectFieldsSchema = z.object({
  name: z.string().trim().min(1, "O nome é obrigatório."),
  description: z.string(),
  clientId: z.string().nullable(),
  budget: z.number().finite().nonnegative(),
  startDate: dateSchema,
  dueDate: dateSchema,
});

export const createProjectSchema =
  projectFieldsSchema.refine(validDateRange, {
    path: ["dueDate"],
    message:
      "A data de conclusão não pode ser anterior à data inicial.",
  });

export const updateProjectSchema = projectFieldsSchema
  .extend({
    status: projectStatusSchema,
  })
  .partial();

export const projectSchema = projectFieldsSchema
  .extend({
    id: z.string().uuid(),
    status: projectStatusSchema,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .refine(validDateRange, {
    path: ["dueDate"],
    message:
      "A data de conclusão não pode ser anterior à data inicial.",
  });

export const projectsSchema = z.array(projectSchema);