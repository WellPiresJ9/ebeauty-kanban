import { create } from "zustand";
import type { Stage } from "@/types";
import { generateId } from "@/lib/utils";

const SEED_STAGES: Stage[] = [
  { id: "stage-1", name: "Inbox", color: "#5B9BD5", order: 0 },
  { id: "stage-2", name: "Vendedor", color: "#C9A96E", order: 1 },
  { id: "stage-3", name: "Amostra", color: "#9B72CF", order: 2 },
  { id: "stage-4", name: "Remarketing", color: "#E8A855", order: 3 },
  { id: "stage-5", name: "Negociação Jhon", color: "#F4976C", order: 4 },
  { id: "stage-6", name: "Negociação", color: "#4ECDC4", order: 5 },
  { id: "stage-7", name: "Pedido Fechado", color: "#6BAF7B", order: 6 },
  { id: "stage-8", name: "Grupos", color: "#FF6B6B", order: 7 },
];

interface StagesStore {
  stages: Stage[];
  addStage: (name: string, color: string) => void;
  updateStage: (id: string, updates: Partial<Stage>) => void;
  removeStage: (id: string) => void;
  reorderStages: (stages: Stage[]) => void;
  getActiveStages: () => Stage[];
  getStageById: (id: string) => Stage | undefined;
}

export const useStagesStore = create<StagesStore>((set, get) => ({
  stages: SEED_STAGES,

  addStage: (name, color) => {
    const stages = get().stages;
    const activeStages = stages.filter((s) => !s.isSystem);
    const newOrder = activeStages.length;
    const newStage: Stage = {
      id: `stage-${generateId()}`,
      name,
      color,
      order: newOrder,
    };
    // Insert before system stages
    const systemStages = stages.filter((s) => s.isSystem);
    set({
      stages: [
        ...activeStages,
        newStage,
        ...systemStages.map((s, i) => ({ ...s, order: newOrder + 1 + i })),
      ],
    });
  },

  updateStage: (id, updates) => {
    set({
      stages: get().stages.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    });
  },

  removeStage: (id) => {
    const stage = get().stages.find((s) => s.id === id);
    if (stage?.isSystem) return;
    const remaining = get().stages.filter((s) => s.id !== id);
    set({
      stages: remaining.map((s, i) => ({ ...s, order: i })),
    });
  },

  reorderStages: (stages) => {
    set({ stages });
  },

  getActiveStages: () => {
    return get().stages.filter((s) => !s.isSystem).sort((a, b) => a.order - b.order);
  },

  getStageById: (id) => {
    return get().stages.find((s) => s.id === id);
  },
}));
