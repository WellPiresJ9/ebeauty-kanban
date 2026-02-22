"use client";

import { useState } from "react";
import { useStagesStore } from "@/stores/useStagesStore";
import { useLeadsStore } from "@/stores/useLeadsStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

const PRESET_COLORS = [
  "#5B9BD5", "#C9A96E", "#9B72CF", "#E8A855",
  "#F4976C", "#6BAF7B", "#D46A6A", "#5BC0DE",
  "#E667AF", "#7B68EE",
];

export function StageManager() {
  const stages = useStagesStore((s) => s.stages);
  const addStage = useStagesStore((s) => s.addStage);
  const updateStage = useStagesStore((s) => s.updateStage);
  const removeStage = useStagesStore((s) => s.removeStage);
  const leads = useLeadsStore((s) => s.leads);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newStageName, setNewStageName] = useState("");
  const [newStageColor, setNewStageColor] = useState(PRESET_COLORS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const sortedStages = [...stages].sort((a, b) => a.order - b.order);

  function handleAdd() {
    if (newStageName.trim()) {
      addStage(newStageName.trim(), newStageColor);
      setNewStageName("");
      setNewStageColor(PRESET_COLORS[0]);
      setShowAddModal(false);
    }
  }

  function handleStartEdit(id: string) {
    const stage = stages.find((s) => s.id === id);
    if (stage) {
      setEditingId(id);
      setEditName(stage.name);
      setEditColor(stage.color);
    }
  }

  function handleSaveEdit() {
    if (editingId && editName.trim()) {
      updateStage(editingId, { name: editName.trim(), color: editColor });
      setEditingId(null);
    }
  }

  function handleDelete(id: string) {
    const leadsInStage = leads.filter((l) => l.stageId === id);
    if (leadsInStage.length > 0) {
      setDeleteConfirm(id);
    } else {
      removeStage(id);
    }
  }

  function confirmDelete() {
    if (deleteConfirm) {
      removeStage(deleteConfirm);
      setDeleteConfirm(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">
            Gerenciar Etapas
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Configure as etapas do seu pipeline de vendas
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova Etapa
        </Button>
      </div>

      {/* Stage list */}
      <div className="space-y-2">
        {sortedStages.map((stage) => {
          const leadsCount = leads.filter((l) => l.stageId === stage.id).length;
          const isEditing = editingId === stage.id;

          return (
            <div
              key={stage.id}
              className="glass-card p-4 flex items-center gap-4"
            >
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: isEditing ? editColor : stage.color }}
              />

              {isEditing ? (
                <div className="flex-1 flex items-center gap-3">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1"
                  />
                  <div className="flex gap-1">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => setEditColor(c)}
                        className={cn(
                          "w-5 h-5 rounded-full transition-transform",
                          editColor === c && "ring-2 ring-white ring-offset-2 ring-offset-white scale-110"
                        )}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <Button size="sm" onClick={handleSaveEdit}>
                    Salvar
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                    Cancelar
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-text-primary">
                      {stage.name}
                    </span>
                    {stage.isSystem && (
                      <span className="ml-2 text-[10px] text-text-secondary bg-surface-hover px-1.5 py-0.5 rounded-full">
                        Sistema
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-text-secondary">
                    {leadsCount} leads
                  </span>
                  {!stage.isSystem && (
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => handleStartEdit(stage.id)}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(stage.id)}>
                        <svg className="w-3.5 h-3.5 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Stage Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Nova Etapa">
        <div className="space-y-4">
          <Input
            label="Nome da Etapa"
            value={newStageName}
            onChange={(e) => setNewStageName(e.target.value)}
            placeholder="Ex: Qualificação"
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-text-secondary">Cor</label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewStageColor(c)}
                  className={cn(
                    "w-7 h-7 rounded-full transition-transform",
                    newStageColor === c &&
                      "ring-2 ring-white ring-offset-2 ring-offset-white scale-110"
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAdd} disabled={!newStageName.trim()}>
              Adicionar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirmar Exclusão"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Esta etapa ainda possui leads. Ao excluí-la, os leads permanecerão
            sem etapa. Deseja continuar?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
