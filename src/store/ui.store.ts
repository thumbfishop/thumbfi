import { create } from "zustand"

interface UIState {
  sidebarCollapsed: boolean
  commandPaletteOpen: boolean
  notificationCount: number
  setSidebarCollapsed: (v: boolean) => void
  toggleSidebar: () => void
  setCommandPaletteOpen: (v: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  notificationCount: 3,
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setCommandPaletteOpen: (v) => set({ commandPaletteOpen: v }),
}))
