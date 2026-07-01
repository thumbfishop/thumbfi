import { create } from "zustand"
import type { EditorElement, EditorTool } from "@/types"

interface EditorState {
  elements: EditorElement[]
  selectedId: string | null
  tool: EditorTool
  zoom: number
  background: string
  isDirty: boolean
  // actions
  setTool: (tool: EditorTool) => void
  setZoom: (zoom: number) => void
  setBackground: (bg: string) => void
  addElement: (el: EditorElement) => void
  updateElement: (id: string, patch: Partial<EditorElement>) => void
  removeElement: (id: string) => void
  selectElement: (id: string | null) => void
  bringForward: (id: string) => void
  sendBackward: (id: string) => void
  setElements: (els: EditorElement[]) => void
  markSaved: () => void
}

export const useEditorStore = create<EditorState>()((set, _get) => ({
  elements: [],
  selectedId: null,
  tool: "select",
  zoom: 1,
  background: "from-orange-500 to-amber-500",
  isDirty: false,

  setTool: (tool) => set({ tool }),
  setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(3, zoom)) }),
  setBackground: (bg) => set({ background: bg, isDirty: true }),
  addElement: (el) => set((s) => ({ elements: [...s.elements, el], isDirty: true })),
  updateElement: (id, patch) =>
    set((s) => ({
      elements: s.elements.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      isDirty: true,
    })),
  removeElement: (id) =>
    set((s) => ({
      elements: s.elements.filter((e) => e.id !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
      isDirty: true,
    })),
  selectElement: (id) => set({ selectedId: id }),
  bringForward: (id) =>
    set((s) => {
      const els = [...s.elements]
      const idx = els.findIndex((e) => e.id === id)
      if (idx < els.length - 1) {
        ;[els[idx], els[idx + 1]] = [els[idx + 1], els[idx]]
      }
      return { elements: els.map((e, i) => ({ ...e, zIndex: i })), isDirty: true }
    }),
  sendBackward: (id) =>
    set((s) => {
      const els = [...s.elements]
      const idx = els.findIndex((e) => e.id === id)
      if (idx > 0) {
        ;[els[idx], els[idx - 1]] = [els[idx - 1], els[idx]]
      }
      return { elements: els.map((e, i) => ({ ...e, zIndex: i })), isDirty: true }
    }),
  setElements: (els) => set({ elements: els }),
  markSaved: () => set({ isDirty: false }),
}))
