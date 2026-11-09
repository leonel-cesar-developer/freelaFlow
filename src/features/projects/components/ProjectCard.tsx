import type { Project, ProjectStatus } from "../types/projects.types";

interface ProjectCardProps {
  project: Project;
  isUpdating: boolean;
  isDeleting: boolean;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: ProjectStatus) => void;
}

const statusLabels: Record<ProjectStatus, string> = {
  PLANNING: "Planeamento",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
};

export function ProjectCard({
  project,
  isUpdating,
  isDeleting,
  onEdit,
  onDelete,
  onStatusChange,
}: ProjectCardProps) {
  return (
    <article className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
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
          disabled={isUpdating}
          onChange={(event) =>
            onStatusChange(project.id, event.target.value as ProjectStatus)
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
          onClick={() => onEdit(project)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          Editar
        </button>

        <button
          type="button"
          disabled={isDeleting}
          onClick={() => onDelete(project.id)}
          className="rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          Eliminar
        </button>
      </div>
    </article>
  );
}