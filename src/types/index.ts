export interface Stage {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface Lead {
  id: number;
  firstname: string | null;
  lastname: string | null;
  whatsapp: string | null;
  funnel_step: string | null;
  state: string | null;
  gender: string | null;
  chat_status: string | null;
  messages_count: number | null;
  followup: string | null;
  ultima_interacao: string | null;
  created_at: string | null;
  // Derived field set client-side from funnel_step
  stageId: string;
}

export type ViewMode = "kanban" | "table";

export type SortField = "firstname" | "created_at" | "messages_count";
export type SortDirection = "asc" | "desc";
