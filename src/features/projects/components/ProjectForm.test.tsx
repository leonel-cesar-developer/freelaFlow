import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

import { ProjectForm } from "./ProjectForm";
import type { Project } from "../types/projects.types";

const existingProject: Project = {
  id: "project-1",
  name: "Website institucional",
  description: "Desenvolvimento de um website",
  status: "PLANNING",
  budget: 1500,
  clientId: null,
  startDate: "2026-11-01",
  dueDate: "2026-11-30",
  createdAt: "2026-11-01T10:00:00.000Z",
  updatedAt: "2026-11-01T10:00:00.000Z",
};

function renderForm(
  overrides: Partial<React.ComponentProps<typeof ProjectForm>> = {},
) {
  const user = userEvent.setup();

  const onSubmit = vi.fn(async () => {});
  const onCancel = vi.fn();

  render(
    <ProjectForm
      isSubmitting={false}
      onSubmit={onSubmit}
      onCancel={onCancel}
      {...overrides}
    />,
  );

  return { user, onSubmit, onCancel };
}

afterEach(() => {
  cleanup();
});

describe("ProjectForm", () => {
  it("deve apresentar o formulário de criação", () => {
    renderForm();

    expect(
      screen.getByRole("heading", { name: "Novo projeto" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: "Nome do projeto" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Criar projeto" }),
    ).toBeInTheDocument();
  });

  it("deve rejeitar um nome vazio", async () => {
    const { user, onSubmit } = renderForm();

    await user.click(screen.getByRole("button", { name: "Criar projeto" }));

    expect(
      await screen.findByText("O nome é obrigatório."),
    ).toBeInTheDocument();

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("deve enviar dados válidos para onSubmit", async () => {
    const { user, onSubmit } = renderForm();

    await user.type(
      screen.getByRole("textbox", { name: "Nome do projeto" }),
      "Aplicação SaaS",
    );

    await user.type(
      screen.getByRole("textbox", { name: "Descrição" }),
      "Gestão de projetos",
    );

    const budget = screen.getByRole("spinbutton", {
      name: "Orçamento (€)",
    });

    await user.clear(budget);
    await user.type(budget, "2500");

    await user.click(screen.getByRole("button", { name: "Criar projeto" }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: "Aplicação SaaS",
      description: "Gestão de projetos",
      budget: 2500,
      clientId: null,
      startDate: null,
      dueDate: null,
    });
  });

  it("deve preencher os campos ao editar um projeto", () => {
    renderForm({ project: existingProject });

    expect(
      screen.getByRole("heading", { name: "Editar projeto" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: "Nome do projeto" }),
    ).toHaveValue("Website institucional");

    expect(
      screen.getByRole("spinbutton", { name: "Orçamento (€)" }),
    ).toHaveValue(1500);
  });

  it("deve impedir datas de conclusão anteriores à inicial", async () => {
    const { user, onSubmit } = renderForm();

    await user.type(
      screen.getByRole("textbox", { name: "Nome do projeto" }),
      "Projeto com datas inválidas",
    );

    const startDate = screen.getByLabelText("Data inicial");
    const dueDate = screen.getByLabelText("Data de conclusão");

    await user.type(startDate, "2026-11-20");
    await user.type(dueDate, "2026-11-10");

    await user.click(screen.getByRole("button", { name: "Criar projeto" }));

    expect(
      await screen.findByText(
        "A data de conclusão deve ser posterior à data inicial.",
      ),
    ).toBeInTheDocument();

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("deve executar onCancel ao cancelar", async () => {
    const { user, onCancel } = renderForm();

    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("deve desativar os botões durante a submissão", () => {
    renderForm({ isSubmitting: true });

    expect(screen.getByRole("button", { name: "A guardar..." })).toBeDisabled();

    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled();
  });
});
