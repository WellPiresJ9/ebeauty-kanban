"use client";

import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { LeadsTable } from "@/components/table/LeadsTable";
import { LeadDetailPanel } from "@/components/leads/LeadDetailPanel";
import { useUIStore } from "@/stores/useUIStore";
import { cn } from "@/lib/utils";

export default function KanbanPage() {
  const viewMode = useUIStore((s) => s.viewMode);
  const setViewMode = useUIStore((s) => s.setViewMode);
  const selectedLeadId = useUIStore((s) => s.selectedLeadId);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h1 className="text-2xl font-semibold text-text-primary">Pipeline de Vendas</h1>
        <div className="flex items-center gap-1 bg-surface-hover border border-border rounded-lg p-0.5">
          <button
            onClick={() => setViewMode("kanban")}
            className={cn(
              "px-3 py-1.5 text-sm rounded-md transition-all",
              viewMode === "kanban"
                ? "bg-accent/20 text-accent"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
              </svg>
              Kanban
            </span>
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={cn(
              "px-3 py-1.5 text-sm rounded-md transition-all",
              viewMode === "table"
                ? "bg-accent/20 text-accent"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Tabela
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {viewMode === "kanban" ? <KanbanBoard /> : <LeadsTable />}
      </div>

      {/* Detail Panel */}
      {selectedLeadId && <LeadDetailPanel />}
    </div>
  );
}
