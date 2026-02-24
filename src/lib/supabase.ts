import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Stage ID ↔ funnel_step mapping
export const STAGE_TO_FUNNEL: Record<string, string> = {
  "stage-1": "INBOX",
  "stage-2": "VENDEDOR",
  "stage-3": "AMOSTRA",
  "stage-4": "REMARKETING",
  "stage-5": "NEGOCIACAO_JHON",
  "stage-6": "NEGOCIACAO",
  "stage-7": "PEDIDO_FECHADO",
  "stage-8": "GRUPOS",
};

export const FUNNEL_TO_STAGE: Record<string, string> = Object.fromEntries(
  Object.entries(STAGE_TO_FUNNEL).map(([k, v]) => [v, k])
);

export function funnelStepToStageId(funnelStep: string | null): string | null {
  if (!funnelStep) return null;
  return FUNNEL_TO_STAGE[funnelStep] ?? null;
}

export function stageIdToFunnelStep(stageId: string): string | null {
  return STAGE_TO_FUNNEL[stageId] ?? null;
}
