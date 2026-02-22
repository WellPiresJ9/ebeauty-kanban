"use client";

import { useMemo, useState } from "react";
import { useLeadsStore } from "@/stores/useLeadsStore";
import { useStagesStore } from "@/stores/useStagesStore";
import { useUIStore } from "@/stores/useUIStore";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { formatCurrency, formatDate, daysAgo, cn } from "@/lib/utils";
import type { Lead, SortField } from "@/types";

export function LeadsTable() {
  const leads = useLeadsStore((s) => s.leads);
  const moveLeads = useLeadsStore((s) => s.moveLeads);
  const getFilteredLeads = useLeadsStore((s) => s.getFilteredLeads);
  const users = useLeadsStore((s) => s.users);
  const stages = useStagesStore((s) => s.stages);
  const searchQuery = useUIStore((s) => s.searchQuery);
  const sortField = useUIStore((s) => s.sortField);
  const sortDirection = useUIStore((s) => s.sortDirection);
  const toggleSort = useUIStore((s) => s.toggleSort);
  const selectedLeadIds = useUIStore((s) => s.selectedLeadIds);
  const toggleLeadSelection = useUIStore((s) => s.toggleLeadSelection);
  const selectAllLeads = useUIStore((s) => s.selectAllLeads);
  const clearSelection = useUIStore((s) => s.clearSelection);
  const setSelectedLeadId = useUIStore((s) => s.setSelectedLeadId);

  const [moveToStage, setMoveToStage] = useState("");

  const filteredLeads = useMemo(
    () => getFilteredLeads(searchQuery),
    [getFilteredLeads, searchQuery, leads]
  );

  const sortedLeads = useMemo(() => {
    const sorted = [...filteredLeads].sort((a, b) => {
      let aVal: string | number = a[sortField] ?? "";
      let bVal: string | number = b[sortField] ?? "";
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredLeads, sortField, sortDirection]);

  const allSelected =
    sortedLeads.length > 0 &&
    sortedLeads.every((l) => selectedLeadIds.includes(l.id));

  function handleSelectAll() {
    if (allSelected) {
      clearSelection();
    } else {
      selectAllLeads(sortedLeads.map((l) => l.id));
    }
  }

  function handleBulkMove() {
    if (moveToStage && selectedLeadIds.length > 0) {
      moveLeads(selectedLeadIds, moveToStage);
      clearSelection();
      setMoveToStage("");
    }
  }

  function SortHeader({ field, children }: { field: SortField; children: React.ReactNode }) {
    const isActive = sortField === field;
    return (
      <th
        className="text-left px-3 py-2 text-xs font-medium text-text-secondary cursor-pointer hover:text-text-primary transition-colors select-none"
        onClick={() => toggleSort(field)}
      >
        <span className="flex items-center gap-1">
          {children}
          {isActive && (
            <svg
              className={cn("w-3 h-3 transition-transform", sortDirection === "desc" && "rotate-180")}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          )}
        </span>
      </th>
    );
  }

  return (
    <div className="space-y-3 h-full flex flex-col">
      {/* Bulk actions */}
      {selectedLeadIds.length > 0 && (
        <div className="glass-subtle p-3 flex items-center gap-3 flex-shrink-0">
          <span className="text-sm text-text-secondary">
            {selectedLeadIds.length} selecionado(s)
          </span>
          <Select
            value={moveToStage}
            onChange={(e) => setMoveToStage(e.target.value)}
            options={[
              { value: "", label: "Mover para..." },
              ...stages.map((s) => ({ value: s.id, label: s.name })),
            ]}
          />
          <Button size="sm" onClick={handleBulkMove} disabled={!moveToStage}>
            Mover
          </Button>
          <Button size="sm" variant="ghost" onClick={clearSelection}>
            Limpar seleção
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto glass-subtle rounded-lg">
        <table className="w-full min-w-[800px]">
          <thead className="border-b border-border sticky top-0 bg-surface">
            <tr>
              <th className="w-10 px-3 py-2">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="w-3.5 h-3.5 accent-accent"
                />
              </th>
              <SortHeader field="name">Nome</SortHeader>
              <SortHeader field="company">Empresa</SortHeader>
              <SortHeader field="value">Valor</SortHeader>
              <th className="text-left px-3 py-2 text-xs font-medium text-text-secondary">
                Etapa
              </th>
              <th className="text-left px-3 py-2 text-xs font-medium text-text-secondary">
                Responsável
              </th>
              <SortHeader field="createdAt">Criado em</SortHeader>
              <SortHeader field="updatedAt">Atualizado</SortHeader>
              <th className="text-left px-3 py-2 text-xs font-medium text-text-secondary">
                Parado
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedLeads.map((lead) => {
              const stage = stages.find((s) => s.id === lead.stageId);
              const assignee = users.find((u) => u.id === lead.assignedTo);
              const days = daysAgo(lead.updatedAt);
              const isSelected = selectedLeadIds.includes(lead.id);

              return (
                <tr
                  key={lead.id}
                  className={cn(
                    "border-b border-border/30 hover:bg-surface-hover transition-colors cursor-pointer",
                    isSelected && "bg-accent/5"
                  )}
                  onClick={() => setSelectedLeadId(lead.id)}
                >
                  <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleLeadSelection(lead.id)}
                      className="w-3.5 h-3.5 accent-accent"
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{lead.name}</p>
                      <p className="text-xs text-text-secondary">{lead.phone}</p>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-sm text-text-secondary">
                    {lead.company}
                  </td>
                  <td className="px-3 py-2.5 text-sm font-medium text-accent">
                    {formatCurrency(lead.value)}
                  </td>
                  <td className="px-3 py-2.5">
                    {stage && <Badge color={stage.color}>{stage.name}</Badge>}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-text-secondary">
                    {assignee?.name}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-text-secondary">
                    {formatDate(lead.createdAt)}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-text-secondary">
                    {formatDate(lead.updatedAt)}
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={cn(
                        "text-xs px-1.5 py-0.5 rounded-full",
                        days > 14
                          ? "text-danger bg-danger/15"
                          : days > 7
                          ? "text-warning bg-warning/15"
                          : "text-text-secondary bg-surface-hover"
                      )}
                    >
                      {days}d
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {sortedLeads.length === 0 && (
          <div className="flex items-center justify-center h-40 text-text-secondary text-sm">
            Nenhum lead encontrado
          </div>
        )}
      </div>
    </div>
  );
}
