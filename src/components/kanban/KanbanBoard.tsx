"use client";

import { useState, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { useLeadsStore } from "@/stores/useLeadsStore";
import { useStagesStore } from "@/stores/useStagesStore";
import { useUIStore } from "@/stores/useUIStore";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { Lead } from "@/types";

const PRESET_COLORS = [
  "#5B9BD5", "#C9A96E", "#9B72CF", "#E8A855",
  "#F4976C", "#6BAF7B", "#D46A6A", "#5BC0DE",
  "#E667AF", "#7B68EE",
];

export function KanbanBoard() {
  const leads = useLeadsStore((s) => s.leads);
  const moveLead = useLeadsStore((s) => s.moveLead);
  const stages = useStagesStore((s) => s.stages);
  const addStage = useStagesStore((s) => s.addStage);
  const searchQuery = useUIStore((s) => s.searchQuery);
  const getFilteredLeads = useLeadsStore((s) => s.getFilteredLeads);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [showStageModal, setShowStageModal] = useState(false);
  const [newStageName, setNewStageName] = useState("");
  const [newStageColor, setNewStageColor] = useState(PRESET_COLORS[0]);

  function handleAddStage() {
    if (newStageName.trim()) {
      addStage(newStageName.trim(), newStageColor);
      setNewStageName("");
      setNewStageColor(PRESET_COLORS[0]);
      setShowStageModal(false);
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const filteredLeads = useMemo(
    () => getFilteredLeads(searchQuery),
    [getFilteredLeads, searchQuery, leads]
  );

  const sortedStages = useMemo(
    () => [...stages].sort((a, b) => a.order - b.order),
    [stages]
  );

  const activeLead = activeId
    ? filteredLeads.find((l) => l.id === activeId)
    : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const leadId = active.id as string;
    let targetStageId: string | null = null;

    // Dropped on a column
    if (over.data.current?.type === "column") {
      targetStageId = over.id as string;
    }
    // Dropped on another card — find its stage
    else if (over.data.current?.type === "lead") {
      const overLead = over.data.current.lead as Lead;
      targetStageId = overLead.stageId;
    }

    if (!targetStageId) return;

    const lead = leads.find((l) => l.id === leadId);
    if (lead && lead.stageId !== targetStageId) {
      moveLead(leadId, targetStageId);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 h-full">
        {sortedStages.map((stage) => {
          const stageLeads = filteredLeads.filter(
            (l) => l.stageId === stage.id
          );
          return (
            <KanbanColumn key={stage.id} stage={stage} leads={stageLeads} />
          );
        })}

        {/* Add new stage button */}
        <button
          onClick={() => setShowStageModal(true)}
          className="kanban-column flex-shrink-0 flex items-center justify-center border-2 border-dashed border-border/50 hover:border-accent/40 bg-transparent hover:bg-surface-hover/50 transition-all cursor-pointer group"
        >
          <div className="flex flex-col items-center gap-2 text-text-secondary/50 group-hover:text-accent/70 transition-colors">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs font-medium">Nova etapa</span>
          </div>
        </button>
      </div>

      {/* Add Stage Modal */}
      <Modal open={showStageModal} onClose={() => setShowStageModal(false)} title="Nova Etapa">
        <div className="space-y-4">
          <Input
            id="stage-name"
            label="Nome da etapa"
            placeholder="Ex: Qualificação"
            value={newStageName}
            onChange={(e) => setNewStageName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddStage()}
            autoFocus
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-text-secondary">Cor</label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewStageColor(c)}
                  className="w-7 h-7 rounded-full border-2 transition-all"
                  style={{
                    backgroundColor: c,
                    borderColor: newStageColor === c ? "white" : "transparent",
                    boxShadow: newStageColor === c ? `0 0 0 2px ${c}` : "none",
                  }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="ghost" size="sm" onClick={() => setShowStageModal(false)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleAddStage} disabled={!newStageName.trim()}>
              Criar Etapa
            </Button>
          </div>
        </div>
      </Modal>
      <DragOverlay>
        {activeLead ? <KanbanCard lead={activeLead} overlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
