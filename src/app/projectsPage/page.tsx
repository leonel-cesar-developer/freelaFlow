import{ ProjectsManager } from "@/features/projects/components/ProjectsManager";

export default function ProjectsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8">
      <header className="space-y-3">
        <div className="space-y-2">
          <p className="text-sm font-medium text-blue-600">
            FreelaFlow / Projetos
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            Gestão de Projetos
          </h1>

          <p className="max-w-2xl text-sm text-gray-600">
            Organiza os teus projetos, acompanha o estado de cada
            trabalho e mantém as informações importantes num
            único lugar.
          </p>
        </div>
      </header>

      <section
        aria-label="Gestão dos projetos"
        className="space-y-6"
      >
        <ProjectsManager />
      </section>
    </main>
  );
}