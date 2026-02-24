"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useLeadsStore } from "@/stores/useLeadsStore";
import { Stage, Lead } from "@/types";
import { cn } from "@/lib/utils";
import { KanbanCard } from "./KanbanCard";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface KanbanColumnProps {
  stage: Stage;
  leads: Lead[];
}

export function KanbanColumn({ stage, leads }: KanbanColumnProps) {
  const addLead = useLeadsStore((s) => s.addLead);

  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadFirstname, setLeadFirstname] = useState("");
  const [leadLastname, setLeadLastname] = useState("");
  const [leadWhatsapp, setLeadWhatsapp] = useState("");

  function resetLeadForm() {
    setLeadFirstname("");
    setLeadLastname("");
    setLeadWhatsapp("");
  }

  function handleAddLead() {
    if (leadFirstname.trim() || leadLastname.trim()) {
      addLead({
        firstname: leadFirstname.trim(),
        lastname: leadLastname.trim(),
        whatsapp: leadWhatsapp.trim(),
        stageId: stage.id,
      });
      resetLeadForm();
      setShowLeadModal(false);
    }
  }

  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
    data: { type: "column", stage },
  });

  return (
    <div className="kanban-column">
      {/* Header */}
      <div className="flex-shrink-0 mb-3">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: stage.color }}
          />
          <h3 className="text-sm font-semibold text-text-primary truncate">
            {stage.name}
          </h3>
          <span className="text-xs text-text-secondary bg-surface-hover px-1.5 py-0.5 rounded-full">
            {leads.length}
          </span>
          <button
            onClick={() => setShowLeadModal(true)}
            className="ml-auto w-5 h-5 flex items-center justify-center rounded text-text-secondary/50 hover:text-accent hover:bg-surface-hover transition-colors"
            title="Adicionar lead"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Cards */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 space-y-2 overflow-y-auto p-1 rounded-lg transition-colors duration-200 min-h-[100px]",
          isOver && "bg-accent/5 border border-dashed border-accent/30"
        )}
      >
        <SortableContext items={leads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map((lead) => (
            <KanbanCard key={lead.id} lead={lead} />
          ))}
        </SortableContext>
        {leads.length === 0 && (
          <div className="flex items-center justify-center h-20 text-xs text-text-secondary/50 border border-dashed border-border/50 rounded-lg">
            Arraste leads aqui
          </div>
        )}
      </div>

      {/* Add Lead Modal */}
      <Modal
        open={showLeadModal}
        onClose={() => { setShowLeadModal(false); resetLeadForm(); }}
        title={`Novo Lead — ${stage.name}`}
      >
        <div className="space-y-3">
          <Input
            id={`lead-firstname-${stage.id}`}
            label="Nome *"
            placeholder="Primeiro nome"
            value={leadFirstname}
            onChange={(e) => setLeadFirstname(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddLead()}
            autoFocus
          />
          <Input
            id={`lead-lastname-${stage.id}`}
            label="Sobrenome"
            placeholder="Sobrenome"
            value={leadLastname}
            onChange={(e) => setLeadLastname(e.target.value)}
          />
          <Input
            id={`lead-whatsapp-${stage.id}`}
            label="WhatsApp"
            placeholder="(00) 00000-0000"
            value={leadWhatsapp}
            onChange={(e) => setLeadWhatsapp(e.target.value)}
          />
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="ghost" size="sm" onClick={() => { setShowLeadModal(false); resetLeadForm(); }}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleAddLead} disabled={!leadFirstname.trim() && !leadLastname.trim()}>
              Criar Lead
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
