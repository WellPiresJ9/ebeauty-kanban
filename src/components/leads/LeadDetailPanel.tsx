"use client";

import { useState, useEffect } from "react";
import { useUIStore } from "@/stores/useUIStore";
import { useLeadsStore } from "@/stores/useLeadsStore";
import { useStagesStore } from "@/stores/useStagesStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDateTime, daysAgo, cn } from "@/lib/utils";
import type { Lead } from "@/types";

export function LeadDetailPanel() {
  const selectedLeadId = useUIStore((s) => s.selectedLeadId);
  const setSelectedLeadId = useUIStore((s) => s.setSelectedLeadId);
  const leads = useLeadsStore((s) => s.leads);
  const updateLead = useLeadsStore((s) => s.updateLead);
  const moveLead = useLeadsStore((s) => s.moveLead);
  const markAsWon = useLeadsStore((s) => s.markAsWon);
  const markAsLost = useLeadsStore((s) => s.markAsLost);
  const users = useLeadsStore((s) => s.users);
  const stages = useStagesStore((s) => s.stages);

  const lead = leads.find((l) => l.id === selectedLeadId);
  const [form, setForm] = useState<Partial<Lead>>({});
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        value: lead.value,
        source: lead.source,
        notes: lead.notes,
        assignedTo: lead.assignedTo,
      });
      setEditing(false);
    }
  }, [lead]);

  if (!lead) return null;

  const currentStage = stages.find((s) => s.id === lead.stageId);
  const sortedStages = [...stages].sort((a, b) => a.order - b.order);
  const currentStageIndex = sortedStages.findIndex((s) => s.id === lead.stageId);
  const nextStage = sortedStages[currentStageIndex + 1];
  const isClosedStage = lead.stageId === "stage-won" || lead.stageId === "stage-lost";

  function handleSave() {
    if (!lead) return;
    updateLead(lead.id, form);
    setEditing(false);
  }

  function handleNextStage() {
    if (!lead) return;
    if (nextStage && !nextStage.isSystem) {
      moveLead(lead.id, nextStage.id);
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={() => setSelectedLeadId(null)}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg z-50 bg-white border-l border-border overflow-y-auto animate-slide-in">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-text-primary">{lead.name}</h2>
              <p className="text-sm text-text-secondary">{lead.company}</p>
            </div>
            <button
              onClick={() => setSelectedLeadId(null)}
              className="text-text-secondary hover:text-text-primary transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Stage & Value */}
          <div className="flex items-center gap-3">
            {currentStage && (
              <Badge color={currentStage.color}>{currentStage.name}</Badge>
            )}
            <span className="text-lg font-semibold text-accent">
              {formatCurrency(lead.value)}
            </span>
            <span className="text-xs text-text-secondary">
              {daysAgo(lead.updatedAt)}d parado
            </span>
          </div>

          {/* Actions */}
          {!isClosedStage && (
            <div className="flex gap-2">
              {nextStage && !nextStage.isSystem && (
                <Button size="sm" variant="secondary" onClick={handleNextStage}>
                  Avançar para {nextStage.name}
                </Button>
              )}
              <Button size="sm" variant="success" onClick={() => markAsWon(lead.id)}>
                Ganhou
              </Button>
              <Button size="sm" variant="danger" onClick={() => markAsLost(lead.id)}>
                Perdido
              </Button>
            </div>
          )}

          {/* Form */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text-primary">Detalhes</h3>
              {!editing ? (
                <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
                  Editar
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    Salvar
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Nome"
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={!editing}
              />
              <Input
                label="Empresa"
                value={form.company || ""}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                disabled={!editing}
              />
              <Input
                label="Email"
                value={form.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={!editing}
              />
              <Input
                label="Telefone"
                value={form.phone || ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                disabled={!editing}
              />
              <Input
                label="Valor (R$)"
                type="number"
                value={form.value || 0}
                onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                disabled={!editing}
              />
              <Input
                label="Fonte"
                value={form.source || ""}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                disabled={!editing}
              />
            </div>

            <Select
              label="Responsável"
              value={form.assignedTo || ""}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              disabled={!editing}
              options={users.map((u) => ({ value: u.id, label: u.name }))}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-text-secondary">
                Notas
              </label>
              <textarea
                value={form.notes || ""}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                disabled={!editing}
                rows={3}
                className={cn(
                  "w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary",
                  "placeholder:text-text-secondary/50 resize-none",
                  "focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20",
                  "transition-all disabled:opacity-60"
                )}
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">Histórico</h3>
            <div className="space-y-3">
              {[...lead.history].reverse().map((entry) => {
                const fromStage = entry.fromStage
                  ? stages.find((s) => s.id === entry.fromStage)
                  : null;
                const toStage = entry.toStage
                  ? stages.find((s) => s.id === entry.toStage)
                  : null;

                return (
                  <div
                    key={entry.id}
                    className="flex gap-3 text-xs"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-accent/50 mt-1" />
                      <div className="w-px flex-1 bg-border" />
                    </div>
                    <div className="pb-3">
                      <p className="text-text-primary font-medium">
                        {entry.action}
                        {fromStage && toStage && (
                          <span className="text-text-secondary font-normal">
                            {" "}— {fromStage.name} → {toStage.name}
                          </span>
                        )}
                      </p>
                      {entry.note && (
                        <p className="text-text-secondary mt-0.5">{entry.note}</p>
                      )}
                      <p className="text-text-secondary/60 mt-0.5">
                        {formatDateTime(entry.date)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
