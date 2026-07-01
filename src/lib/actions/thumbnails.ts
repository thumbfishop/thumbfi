"use server"

import { requireUserId } from "@/lib/data/users"
import * as thumbnails from "@/lib/data/thumbnails"
import type { Thumbnail, EditorState } from "@/types"

export async function listThumbnailsAction(opts: {
  projectId?: string
  limit?: number
} = {}): Promise<Thumbnail[]> {
  const userId = await requireUserId()
  return thumbnails.listThumbnails(userId, opts)
}

export async function getThumbnailAction(id: string): Promise<Thumbnail | null> {
  const userId = await requireUserId()
  return thumbnails.getThumbnail(userId, id)
}

export async function toggleThumbnailFavoriteAction(id: string, isFavorite: boolean): Promise<void> {
  const userId = await requireUserId()
  return thumbnails.setThumbnailFavorite(userId, id, isFavorite)
}

export async function saveThumbnailCanvasAction(id: string, canvas: EditorState): Promise<void> {
  const userId = await requireUserId()
  return thumbnails.saveThumbnailCanvas(userId, id, canvas)
}

export async function deleteThumbnailAction(id: string): Promise<void> {
  const userId = await requireUserId()
  return thumbnails.deleteThumbnail(userId, id)
}
