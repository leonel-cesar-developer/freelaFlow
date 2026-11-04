"use client";

import { useQuery } from "@tanstack/react-query";
import { projectsService } from "../services/projects.service";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => projectsService.getAll(),
  });
}
