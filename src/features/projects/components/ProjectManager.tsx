"use client";

import { useState } from "react";

import { ProjectForm } from "./ProjectForm";
import { useProjects } from "../hooks/useProjects";

import {
  useCreateProject,
  useDeleteProject,
  useUpdateProject,
} from "../hooks/useProjectMutations";

import type {
  CreateProjectInput,
  Project,
  ProjectStatus,
} from "../types/projects.types";

const statusLabels: Record<ProjectStatus, string> = {
  PLANNING: "Planeamento",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
};

export function ProjectsManager() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const {
    data: projects = [],
    isPending,
    isError,
    error,
    refetch,
  } = useProjects();

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const isSubmitting = createProject.isPending || updateProject.isPending;

  function openCreateForm() {
    setEditingProject(null);
    setFeedback(null);
    setIsFormOpen(true);
  }

  function openEditForm(project: Project) {
    setEditingProject(project);
    setFeedback(null);
    setIsFormOpen(true);
  }

  function closeForm() {
    setEditingProject(null);
    setIsFormOpen(false);
  }

  async function handleSubmit(input: CreateProjectInput) {
    try {
      setFeedback(null);

      if (editingProject) {
        await updateProject.mutateAsync({
          id: editingProject.id,
          input,
        });
        setFeedback("Projeto atualizado com sucesso.");
      } else {
        await createProject.mutateAsync(input);
        setFeedback("Projeto criado com sucesso.");
      }

      closeForm();
    } catch {
      setFeedback("Não foi possível guardar o projeto.");
    }
  }

  async function handleStatusChange(id: string, status: ProjectStatus) {
    try {
      setFeedback(null);

      await updateProject.mutateAsync({
        id,
        input: { status },
      });
    } catch {
      setFeedback("Não foi possível atualizar o estado.");
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Tens a certeza de que queres eliminar este projeto?",
    );

    if (!confirmed) return;

    try {
      setFeedback(null);
      await deleteProject.mutateAsync(id);
      setFeedback("Projeto eliminado com sucesso.");
    } catch {
      setFeedback("Não foi possível eliminar o projeto.");
    }
  }

  if (isPending) {
    return <p>A carregar projetos...</p>;
  }

  if (isError) {
    return (
      <section className="space-y-3">
        <p role="alert" className="text-red-600">
          {error instanceof Error
            ? error.message
            : "Erro ao carregar projetos."}
        </p>

        <button
          type="button"
          onClick={() => void refetch()}
          className="rounded-lg border px-4 py-2"
        >
          Tentar novamente
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {projects.length} projeto(s) registado(s)
        </p>

        <button
          type="button"
          onClick={openCreateForm}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          Novo projeto
        </button>
      </div>

      {isFormOpen && (
        <ProjectForm
          project={editingProject}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      )}

      {feedback && (
        <p role="status" className="text-sm">
          {feedback}
        </p>
      )}

      {projects.length === 0 ? (
        <div className="rounded-xl border p-8 text-center">
          <p>Ainda não existem projetos.</p>
          <p className="text-sm text-slate-500">
            Cria o primeiro projeto para começar.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.id}
              className="space-y-4 rounded-xl border border-slate-200 bg-white p-5"
            >
              <div>
                <h2 className="text-lg font-semibold">{project.name}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {project.description || "Sem descrição"}
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor={`status-${project.id}`}
                  className="block text-sm font-medium"
                >
                  Estado
                </label>

                <select
                  id={`status-${project.id}`}
                  value={project.status}
                  disabled={updateProject.isPending}
                  onChange={(event) =>
                    void handleStatusChange(
                      project.id,
                      event.target.value as ProjectStatus,
                    )
                  }
                  className="w-full rounded-lg border px-3 py-2"
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-sm font-medium">
                {project.budget.toLocaleString("pt-PT", {
                  style: "currency",
                  currency: "EUR",
                })}
              </p>

              <div className="flex justify-end gap-2 border-t pt-3">
                <button
                  type="button"
                  onClick={() => openEditForm(project)}
                  className="rounded-lg border px-3 py-2 text-sm"
                >
                  Editar
                </button>

                <button
                  type="button"
                  disabled={deleteProject.isPending}
                  onClick={() => void handleDelete(project.id)}
                  className="rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
