import { ProjectCard } from "./ProjectCard";

import type { Project, ProjectStatus } from "../types/projects.types";

interface ProjectListProps {
  projects: Project[];
  isUpdating: boolean;
  isDeleting: boolean;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: ProjectStatus) => void;
}

export function ProjectList({
  projects,
  isUpdating,
  isDeleting,
  onEdit,
  onDelete,
  onStatusChange,
}: ProjectListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
