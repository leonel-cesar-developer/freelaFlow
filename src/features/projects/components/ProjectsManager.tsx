"use client";

import { useState } from "react";
import { ProjectForm } from "./ProjectForm";
import { useProjects } from "../hooks/useProjects";
import { ProjectList } from "./ProjectList";

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
          <ProjectList
            projects={projects}
            isUpdating={updateProject.isPending}
            isDeleting={deleteProject.isPending}
            onEdit={openEditForm}
            onDelete={(id) => void handleDelete(id)}
            onStatusChange={(id, status) => void handleStatusChange(id, status)}
          />
        </div>
      )}
    </section>
  );
}
