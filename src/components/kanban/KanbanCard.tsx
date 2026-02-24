"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Lead } from "@/types";
import { displayName, daysAgo, cn } from "@/lib/utils";
import { useUIStore } from "@/stores/useUIStore";

interface KanbanCardProps {
  lead: Lead;
  overlay?: boolean;
}

export function KanbanCard({ lead, overlay }: KanbanCardProps) {
  const setSelectedLeadId = useUIStore((s) => s.setSelectedLeadId);
  const staleSince = lead.ultima_interacao ?? lead.created_at;
  const days = staleSince ? daysAgo(staleSince) : 0;

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
          {displayName(lead.firstname, lead.lastname)}
        </h4>
        {days > 7 && (
          <span className="text-[10px] text-warning bg-warning/15 px-1.5 py-0.5 rounded-full whitespace-nowrap">
            {days}d
          </span>
        )}
      </div>

      {lead.whatsapp && (
        <p className="text-xs text-text-secondary truncate">{lead.whatsapp}</p>
      )}

      <div className="flex items-center gap-2">
        {lead.chat_status && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/15 text-accent truncate">
            {lead.chat_status}
          </span>
        )}
        {lead.messages_count != null && lead.messages_count > 0 && (
          <span className="text-[10px] text-text-secondary">
            {lead.messages_count} msgs
          </span>
        )}
      </div>
    </div>
  );
}
