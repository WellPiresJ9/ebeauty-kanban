"use client";

import { useState, useEffect } from "react";
import { useUIStore } from "@/stores/useUIStore";
import { useLeadsStore } from "@/stores/useLeadsStore";
import { useStagesStore } from "@/stores/useStagesStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { displayName, formatDateTime, daysAgo, cn } from "@/lib/utils";
import type { Lead } from "@/types";

export function LeadDetailPanel() {
  const selectedLeadId = useUIStore((s) => s.selectedLeadId);
  const setSelectedLeadId = useUIStore((s) => s.setSelectedLeadId);
  const leads = useLeadsStore((s) => s.leads);
  const updateLead = useLeadsStore((s) => s.updateLead);
  const moveLead = useLeadsStore((s) => s.moveLead);
  const stages = useStagesStore((s) => s.stages);

  const lead = leads.find((l) => l.id === selectedLeadId);
  const [form, setForm] = useState<Partial<Lead>>({});
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (lead) {
      setForm({
        firstname: lead.firstname,
        lastname: lead.lastname,
        whatsapp: lead.whatsapp,
        state: lead.state,
        gender: lead.gender,
        chat_status: lead.chat_status,
        followup: lead.followup,
      });
      setEditing(false);
    }
  }, [lead]);

  if (!lead) return null;

  const currentStage = stages.find((s) => s.id === lead.stageId);
  const sortedStages = [...stages].sort((a, b) => a.order - b.order);
  const currentStageIndex = sortedStages.findIndex((s) => s.id === lead.stageId);
  const nextStage = sortedStages[currentStageIndex + 1];
  const staleSince = lead.ultima_interacao ?? lead.created_at;
  const days = staleSince ? daysAgo(staleSince) : 0;

  function handleSave() {
    if (!lead) return;
    updateLead(lead.id, form);
    setEditing(false);
  }

  function handleNextStage() {
    if (!lead || !nextStage) return;
    moveLead(lead.id, nextStage.id);
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
              <h2 className="text-xl font-semibold text-text-primary">
                {displayName(lead.firstname, lead.lastname)}
              </h2>
              {lead.whatsapp && (
                <p className="text-sm text-text-secondary">{lead.whatsapp}</p>
              )}
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

          {/* Stage & staleness */}
          <div className="flex items-center gap-3">
            {currentStage && (
              <Badge color={currentStage.color}>{currentStage.name}</Badge>
            )}
            <span className="text-xs text-text-secondary">
              {days}d parado
            </span>
            {lead.state && (
              <span className="text-xs text-text-secondary bg-surface-hover px-1.5 py-0.5 rounded-full">
                {lead.state}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {nextStage && (
              <Button size="sm" variant="secondary" onClick={handleNextStage}>
                Avançar para {nextStage.name}
              </Button>
            )}
          </div>

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
                value={form.firstname ?? ""}
                onChange={(e) => setForm({ ...form, firstname: e.target.value })}
                disabled={!editing}
              />
              <Input
                label="Sobrenome"
                value={form.lastname ?? ""}
                onChange={(e) => setForm({ ...form, lastname: e.target.value })}
                disabled={!editing}
              />
              <Input
                label="WhatsApp"
                value={form.whatsapp ?? ""}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                disabled={!editing}
              />
              <Input
                label="Estado"
                value={form.state ?? ""}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                disabled={!editing}
              />
              <Input
                label="Gênero"
                value={form.gender ?? ""}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                disabled={!editing}
              />
              <Input
                label="Chat Status"
                value={form.chat_status ?? ""}
                onChange={(e) => setForm({ ...form, chat_status: e.target.value })}
                disabled={!editing}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-text-secondary">
                Followup
              </label>
              <textarea
                value={form.followup ?? ""}
                onChange={(e) => setForm({ ...form, followup: e.target.value })}
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

          {/* Info */}
          <div className="space-y-2 text-xs text-text-secondary">
            {lead.messages_count != null && (
              <p>Mensagens: {lead.messages_count}</p>
            )}
            {lead.created_at && (
              <p>Criado em: {formatDateTime(lead.created_at)}</p>
            )}
            {lead.ultima_interacao && (
              <p>Última interação: {lead.ultima_interacao}</p>
            )}
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
