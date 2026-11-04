"use client";

import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type {
  CreateProjectInput,
  Project,
} from "../projects/types/projects.types";

const formSchema = z.object({
  name: z.string().trim().min(1, "O nome é obrigatório."),
  description: z.string(),
  budget: z.coerce
    .number()
    .finite()
    .nonnegative("O orçamento não pode ser negativo."),
  startDate: z.string(),
  dueDate: z.string(),
});

type ProjectFormValues = z.infer<typeof formSchema>;

interface ProjectFormProps {
  project?: Project | null;
  isSubmitting: boolean;
  onSubmit: (values: CreateProjectInput) => Promise<void>;
  onCancel: () => void;
}

function toFormValues(project?: Project | null): ProjectFormValues {
  return {
    name: project?.name ?? "",
    description: project?.description ?? "",
    budget: project?.budget ?? 0,
    startDate: project?.startDate ?? "",
    dueDate: project?.dueDate ?? "",
  };
}

export function ProjectForm({
  project,
  isSubmitting,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: toFormValues(project),
  });

  useEffect(() => {
    reset(toFormValues(project));
  }, [project, reset]);

  async function submit(values: ProjectFormValues) {
    const startDate = values.startDate || null;
    const dueDate = values.dueDate || null;

    if (startDate && dueDate && dueDate < startDate) {
      setError("dueDate", {
        message: "A data de conclusão deve ser posterior à data inicial.",
      });
      return;
    }

    await onSubmit({
      name: values.name,
      description: values.description,
      budget: values.budget,
      clientId: project?.clientId ?? null,
      startDate,
      dueDate,
    });
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900";

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="space-y-5 rounded-xl border border-slate-200 bg-white p-5"
    >
      <h2 className="text-lg font-semibold">
        {project ? "Editar projeto" : "Novo projeto"}
      </h2>

      <div className="space-y-1">
        <label htmlFor="project-name" className="block text-sm font-medium">
          Nome do projeto
        </label>
        <input
          id="project-name"
          {...register("name")}
          aria-invalid={Boolean(errors.name)}
          className={inputClass}
        />
        {errors.name && (
          <p role="alert" className="text-sm text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label
          htmlFor="project-description"
          className="block text-sm font-medium"
        >
          Descrição
        </label>
        <textarea
          id="project-description"
          {...register("description")}
          rows={3}
          className={inputClass}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="project-budget" className="block text-sm font-medium">
          Orçamento (€)
        </label>
        <input
          id="project-budget"
          type="number"
          min="0"
          step="0.01"
          {...register("budget")}
          aria-invalid={Boolean(errors.budget)}
          className={inputClass}
        />
        {errors.budget && (
          <p role="alert" className="text-sm text-red-600">
            {errors.budget.message}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label
            htmlFor="project-start-date"
            className="block text-sm font-medium"
          >
            Data inicial
          </label>
          <input
            id="project-start-date"
            type="date"
            {...register("startDate")}
            className={inputClass}
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="project-due-date"
            className="block text-sm font-medium"
          >
            Data de conclusão
          </label>
          <input
            id="project-due-date"
            type="date"
            {...register("dueDate")}
            aria-invalid={Boolean(errors.dueDate)}
            className={inputClass}
          />
          {errors.dueDate && (
            <p role="alert" className="text-sm text-red-600">
              {errors.dueDate.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg border px-4 py-2"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {isSubmitting
            ? "A guardar..."
            : project
              ? "Guardar alterações"
              : "Criar projeto"}
        </button>
      </div>
    </form>
  );
}
