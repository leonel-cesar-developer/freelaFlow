import type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
} from "../types/projects.types";

import {
  projectSchema,
  projectsSchema,
  createProjectSchema,
  updateProjectSchema,
} from "../schemas/projects.schema";

export interface ProjectsService {
  getAll(): Promise<Project[]>;
  getById(id: string): Promise<Project | null>;
  create(input: CreateProjectInput): Promise<Project>;
  update(id: string, input: UpdateProjectInput): Promise<Project>;
  remove(id: string): Promise<void>;
}

const STORAGE_KEY = "freelaflow_projects";

function ensureBrowser(): void {
  if (typeof window === "undefined") {
    throw new Error("A persistência local só está disponível no navegador.");
  }
}

export const projectsService: ProjectsService = {
  // GET ALL
  async getAll(): Promise<Project[]> {
    if (typeof window === "undefined") {
      return [];
    }

    const storedProjects = localStorage.getItem(STORAGE_KEY);

    if (!storedProjects) {
      return [];
    }

    const projects: unknown = JSON.parse(storedProjects);

    return projectsSchema.parse(projects);
  },

  // GET BY ID
  async getById(id: string): Promise<Project | null> {
    const projects = await projectsService.getAll();

    const project = projects.find((project) => project.id === id);

    return project ?? null;
  },

  // CREATE
  async create(input: CreateProjectInput): Promise<Project> {
    ensureBrowser();

    const validatedInput = createProjectSchema.parse(input);
    const projects = await projectsService.getAll();
    const now = new Date().toISOString();

    const newProject: Project = {
      ...validatedInput,
      id: crypto.randomUUID(),
      status: "PLANNING",
      createdAt: now,
      updatedAt: now,
    };

    const validatedProject = projectSchema.parse(newProject);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...projects, validatedProject]),
    );

    return validatedProject;
  },

  // UPDATE
  async update(id: string, input: UpdateProjectInput): Promise<Project> {
    ensureBrowser();

    const validatedInput = updateProjectSchema.parse(input);

    const projects = await projectsService.getAll();

    const existingProject = projects.find((project) => project.id === id);

    if (!existingProject) {
      throw new Error("Projeto não encontrado.");
    }

    const updatedProject: Project = {
      ...existingProject,
      ...validatedInput,
      id: existingProject.id,
      createdAt: existingProject.createdAt,
      updatedAt: new Date().toISOString(),
    };

    const validatedProject = projectSchema.parse(updatedProject);

    const updatedProjects = projects.map((project) =>
      project.id === id ? validatedProject : project,
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));

    return validatedProject;
  },

  // REMOVE
  async remove(id: string): Promise<void> {
    ensureBrowser();

    const projects = await projectsService.getAll();

    const projectExists = projects.some((project) => project.id === id);

    if (!projectExists) {
      throw new Error("Projeto não encontrado.");
    }

    const remainingProjects = projects.filter((project) => project.id !== id);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(remainingProjects));
  },
};