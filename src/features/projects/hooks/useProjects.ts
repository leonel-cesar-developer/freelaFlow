"use client";

import { useQuery } from "@tanstack/react-query";
import { projectsService } from "../services/projects.service";
import { projectKeys } from "../hooks/projectKey";

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: projectsService.getAll,
  });
}