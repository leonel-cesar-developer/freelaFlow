"use client";

import { useTaskStore } from "@/app/lib/store/taskStore";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
});

type FormData = z.infer<typeof schema>;

 function TarefasPage() {
  const { tasks, addTask, toggleTask, removeTask } = useTaskStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    addTask(data.title);
    reset();
  };

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Tarefas</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 mb-4">
        <input
          type="text"
          {...register("title")}
          placeholder="Nova tarefa"
          className="flex-1 border border-gray-300 rounded px-4 py-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Adicionar
        </button>
      </form>
      {errors.title && (
        <p className="text-red-500 text-sm mb-2">{errors.title.message}</p>
      )}

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between bg-white p-3 rounded shadow"
          >
            <span
              onClick={() => toggleTask(task.id)}
              className={`flex-1 cursor-pointer ${
                task.done ? "line-through text-gray-400" : ""
              }`}
            >
              {task.title}
            </span>
            <button
              onClick={() => removeTask(task.id)}
              className="text-red-500 hover:underline text-sm"
            >
              Remover
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default TarefasPage;
