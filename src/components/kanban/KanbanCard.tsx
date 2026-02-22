"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Lead } from "@/types";
import { formatCurrency, daysAgo } from "@/lib/utils";
import { useUIStore } from "@/stores/useUIStore";
import { useLeadsStore } from "@/stores/useLeadsStore";
import { cn } from "@/lib/utils";

interface KanbanCardProps {
  lead: Lead;
  overlay?: boolean;
}

export function KanbanCard({ lead, overlay }: KanbanCardProps) {
  const setSelectedLeadId = useUIStore((s) => s.setSelectedLeadId);
  const users = useLeadsStore((s) => s.users);
  const days = daysAgo(lead.updatedAt);
  const assignee = users.find((u) => u.id === lead.assignedTo);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lead.id,
    data: { type: "lead", lead },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => setSelectedLeadId(lead.id)}
      className={cn(
        "glass-card p-3 cursor-grab active:cursor-grabbing space-y-2",
        isDragging && "opacity-40",
        overlay && "drag-overlay"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium text-text-primary leading-tight truncate">
          {lead.name}
        </h4>
        {days > 7 && (
          <span className="text-[10px] text-warning bg-warning/15 px-1.5 py-0.5 rounded-full whitespace-nowrap">
            {days}d
          </span>
        )}
      </div>

      {lead.company && (
        <p className="text-xs text-text-secondary truncate">{lead.company}</p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-text-primary">
          {formatCurrency(lead.value)}
        </span>
        {assignee && (
          <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center" title={assignee.name}>
            <span className="text-[9px] text-text-primary font-medium">
              {assignee.name.split(" ").map((n) => n[0]).join("")}
            </span>
          </div>
        )}
      </div>

      {lead.phone && (
        <p className="text-[11px] text-text-secondary/70">{lead.phone}</p>
      )}
    </div>
  );
}
