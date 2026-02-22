import { create } from "zustand";
import type { ViewMode, SortField, SortDirection } from "@/types";

interface UIStore {
  viewMode: ViewMode;
  searchQuery: string;
  selectedLeadId: string | null;
  selectedLeadIds: string[];
  sortField: SortField;
  sortDirection: SortDirection;
  sidebarOpen: boolean;

  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  setSelectedLeadId: (id: string | null) => void;
  toggleLeadSelection: (id: string) => void;
  selectAllLeads: (ids: string[]) => void;
  clearSelection: () => void;
  setSortField: (field: SortField) => void;
  setSortDirection: (direction: SortDirection) => void;
  toggleSort: (field: SortField) => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  viewMode: "kanban",
  searchQuery: "",
  selectedLeadId: null,
  selectedLeadIds: [],
  sortField: "createdAt",
  sortDirection: "desc",
  sidebarOpen: true,

  setViewMode: (mode) => set({ viewMode: mode }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedLeadId: (id) => set({ selectedLeadId: id }),

  toggleLeadSelection: (id) => {
    const current = get().selectedLeadIds;
    if (current.includes(id)) {
      set({ selectedLeadIds: current.filter((i) => i !== id) });
    } else {
      set({ selectedLeadIds: [...current, id] });
    }
  },

  selectAllLeads: (ids) => set({ selectedLeadIds: ids }),
  clearSelection: () => set({ selectedLeadIds: [] }),

  setSortField: (field) => set({ sortField: field }),
  setSortDirection: (direction) => set({ sortDirection: direction }),

  toggleSort: (field) => {
    const { sortField, sortDirection } = get();
    if (sortField === field) {
      set({ sortDirection: sortDirection === "asc" ? "desc" : "asc" });
    } else {
      set({ sortField: field, sortDirection: "asc" });
    }
  },

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
