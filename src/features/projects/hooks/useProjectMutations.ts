"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "../types/projects.types";

import { projectsService } from "../services/projects.service";
import { projectKeys } from "../hooks/projectKey";

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProjectInput) =>
      projectsService.create(input),

    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: projectKeys.all,
      });
    },
  });
}

interface UpdateProjectVariables {
  id: string;
  input: UpdateProjectInput;
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: UpdateProjectVariables) =>
      projectsService.update(id, input),

    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: projectKeys.all,
      });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      projectsService.remove(id),

    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: projectKeys.all,
      });
    },
  });
}