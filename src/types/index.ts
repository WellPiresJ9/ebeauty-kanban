export interface Stage {
  id: string;
  name: string;
  color: string;
  order: number;
  isSystem?: boolean; // "Ganhou" and "Perdido" are system stages
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  value: number;
  stageId: string;
  assignedTo: string;
  source: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  history: HistoryEntry[];
}

export interface HistoryEntry {
  id: string;
  date: string;
  action: string;
  fromStage?: string;
  toStage?: string;
  note?: string;
}

export interface User {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export type ViewMode = "kanban" | "table";

export type SortField = "name" | "value" | "createdAt" | "updatedAt" | "company";
export type SortDirection = "asc" | "desc";
