"use server"

import { requireUserId, getOrCreateUser } from "@/lib/data/users"
import * as projects from "@/lib/data/projects"
import type { Project, ProjectStatus } from "@/types"

export async function listProjectsAction(includeArchived = false): Promise<Project[]> {
  const userId = await requireUserId()
  return projects.listProjects(userId, { includeArchived })
}

export async function createProjectAction(input: {
  title: string
  description?: string | null
}): Promise<Project> {
  await getOrCreateUser() // ensure the users row exists for the FK
  const userId = await requireUserId()
  return projects.createProject(userId, input)
}

export async function updateProjectAction(
  id: string,
  patch: Partial<{ title: string; description: string | null; is_favorite: boolean; status: ProjectStatus }>
): Promise<Project> {
  const userId = await requireUserId()
  return projects.updateProject(userId, id, patch)
}

export async function deleteProjectAction(id: string): Promise<void> {
  const userId = await requireUserId()
  return projects.deleteProject(userId, id)
}
