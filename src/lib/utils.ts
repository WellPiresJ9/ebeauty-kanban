import { differenceInDays, format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), "dd/MM/yyyy", { locale: ptBR });
}

export function formatDateTime(dateStr: string): string {
  return format(parseISO(dateStr), "dd/MM/yyyy HH:mm", { locale: ptBR });
}

export function daysAgo(dateStr: string): number {
  return differenceInDays(new Date(), parseISO(dateStr));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
