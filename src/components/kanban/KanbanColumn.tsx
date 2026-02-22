"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useLeadsStore } from "@/stores/useLeadsStore";
import { Stage, Lead } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { KanbanCard } from "./KanbanCard";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface KanbanColumnProps {
  stage: Stage;
  leads: Lead[];
}

export function KanbanColumn({ stage, leads }: KanbanColumnProps) {
  const totalValue = leads.reduce((sum, l) => sum + l.value, 0);
  const addLead = useLeadsStore((s) => s.addLead);

  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadCompany, setLeadCompany] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadValue, setLeadValue] = useState("");

  function resetLeadForm() {
    setLeadName("");
    setLeadCompany("");
    setLeadPhone("");
    setLeadValue("");
  }

  function handleAddLead() {
    if (leadName.trim()) {
      addLead({
        name: leadName.trim(),
        company: leadCompany.trim(),
        phone: leadPhone.trim(),
        email: "",
        value: parseFloat(leadValue) || 0,
        stageId: stage.id,
        assignedTo: "",
        source: "",
        notes: "",
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
        <p className="text-xs text-text-secondary ml-[18px]">
          {formatCurrency(totalValue)}
        </p>
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
            id={`lead-name-${stage.id}`}
            label="Nome *"
            placeholder="Nome do lead"
            value={leadName}
            onChange={(e) => setLeadName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddLead()}
            autoFocus
          />
          <Input
            id={`lead-company-${stage.id}`}
            label="Empresa"
            placeholder="Nome da empresa"
            value={leadCompany}
            onChange={(e) => setLeadCompany(e.target.value)}
          />
          <Input
            id={`lead-phone-${stage.id}`}
            label="Telefone"
            placeholder="(00) 00000-0000"
            value={leadPhone}
            onChange={(e) => setLeadPhone(e.target.value)}
          />
          <Input
            id={`lead-value-${stage.id}`}
            label="Valor (R$)"
            type="number"
            placeholder="0"
            value={leadValue}
            onChange={(e) => setLeadValue(e.target.value)}
          />
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="ghost" size="sm" onClick={() => { setShowLeadModal(false); resetLeadForm(); }}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleAddLead} disabled={!leadName.trim()}>
              Criar Lead
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
