'use client'

import { create } from 'zustand'
import { nanoid } from 'nanoid'

export type Task = {
  id: string
  title: string
  done: boolean
}

interface TaskStore {
  tasks: Task[]
  addTask: (title: string) => void
  toggleTask: (id: string) => void
  removeTask: (id: string) => void
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  addTask: (title) => set((state) => ({
    tasks: [...state.tasks, { id: nanoid(), title, done: false }],
  })),
  toggleTask: (id) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task
    ),
  })),
  removeTask: (id) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== id),
  })),
}))