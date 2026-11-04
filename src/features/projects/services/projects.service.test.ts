import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

import { projectsService } from "./projects.service";

describe("Projects Service", () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();

    vi.stubGlobal("window", {});

    vi.stubGlobal("localStorage", {
      getItem: vi.fn((key: string) => {
        return storage.get(key) ?? null;
      }),

      setItem: vi.fn((key: string, value: string) => {
        storage.set(key, value);
      }),

      removeItem: vi.fn((key: string) => {
        storage.delete(key);
      }),

      clear: vi.fn(() => {
        storage.clear();
      }),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("deve devolver um array vazio quando não existem projetos", async () => {
    const projects = await projectsService.getAll();

    expect(projects).toEqual([]);
  });

  it("deve criar um projeto válido", async () => {
    const project = await projectsService.create({
      name: "Website Corporativo",
      description: "Desenvolvimento de website",
      clientId: null,
      budget: 2500,
      startDate: null,
      dueDate: null,
    });

    expect(project.id).toBeDefined();
    expect(project.name).toBe("Website Corporativo");
    expect(project.status).toBe("PLANNING");
    expect(project.budget).toBe(2500);
    expect(project.createdAt).toBeDefined();
    expect(project.updatedAt).toBeDefined();
  });

  it("deve rejeitar um projeto com nome vazio", async () => {
    await expect(
      projectsService.create({
        name: "",
        description: "Projeto inválido",
        clientId: null,
        budget: 1000,
        startDate: null,
        dueDate: null,
      }),
    ).rejects.toThrow();
  });

  it("deve encontrar um projeto pelo ID", async () => {
    const created = await projectsService.create({
      name: "Dashboard SaaS",
      description: "Dashboard de gestão",
      clientId: null,
      budget: 3500,
      startDate: null,
      dueDate: null,
    });

    const project = await projectsService.getById(created.id);

    expect(project).toEqual(created);
  });

  it("deve devolver null quando o projeto não existe", async () => {
    const project = await projectsService.getById(crypto.randomUUID());

    expect(project).toBeNull();
  });

  it("deve atualizar um projeto existente", async () => {
    const created = await projectsService.create({
      name: "Website",
      description: "Projeto inicial",
      clientId: null,
      budget: 1500,
      startDate: null,
      dueDate: null,
    });

    const updated = await projectsService.update(created.id, {
      name: "Website Profissional",
      budget: 2500,
      status: "IN_PROGRESS",
    });

    expect(updated.name).toBe("Website Profissional");
    expect(updated.budget).toBe(2500);
    expect(updated.status).toBe("IN_PROGRESS");

    expect(updated.id).toBe(created.id);
    expect(updated.createdAt).toBe(created.createdAt);

    const stored = await projectsService.getById(created.id);

    expect(stored).toEqual(updated);
  });

  it("deve eliminar um projeto existente", async () => {
    const created = await projectsService.create({
      name: "Projeto Temporário",
      description: "Projeto para eliminação",
      clientId: null,
      budget: 500,
      startDate: null,
      dueDate: null,
    });

    await projectsService.remove(created.id);

    const project = await projectsService.getById(created.id);

    expect(project).toBeNull();
  });

  it("deve rejeitar a atualização de um projeto inexistente", async () => {
    await expect(
      projectsService.update(crypto.randomUUID(), {
        name: "Projeto inexistente",
      }),
    ).rejects.toThrow("Projeto não encontrado.");
  });

  it("deve rejeitar a eliminação de um projeto inexistente", async () => {
    await expect(projectsService.remove(crypto.randomUUID())).rejects.toThrow(
      "Projeto não encontrado.",
    );
  });

  it("deve rejeitar dados inválidos no localStorage", async () => {
    localStorage.setItem(
      "freelaflow_projects",
      JSON.stringify([
        {
          id: 123,
          name: null,
          budget: "inválido",
        },
      ]),
    );

    await expect(projectsService.getAll()).rejects.toThrow();
  });
});
