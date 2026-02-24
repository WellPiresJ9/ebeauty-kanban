import { create } from "zustand";
import type { Lead } from "@/types";
import { supabase, funnelStepToStageId, stageIdToFunnelStep } from "@/lib/supabase";

function mapRow(row: Record<string, unknown>): Lead | null {
  const funnelStep = row.funnel_step as string | null;
  const stageId = funnelStepToStageId(funnelStep);
  if (!stageId) return null;
  return {
    id: row.id as number,
    firstname: row.firstname as string | null,
    lastname: row.lastname as string | null,
    whatsapp: row.whatsapp as string | null,
    funnel_step: funnelStep,
    state: row.state as string | null,
    gender: row.gender as string | null,
    chat_status: row.chat_status as string | null,
    messages_count: row.messages_count as number | null,
    followup: row.followup as string | null,
    ultima_interacao: row.ultima_interacao as string | null,
    created_at: row.created_at as string | null,
    stageId,
  };
}

interface LeadsStore {
  leads: Lead[];
  loading: boolean;
  error: string | null;

  fetchLeads: () => Promise<void>;
  moveLead: (id: number, toStageId: string) => Promise<void>;
  moveLeads: (ids: number[], toStageId: string) => Promise<void>;
  addLead: (data: { firstname: string; lastname: string; whatsapp: string; stageId: string }) => Promise<void>;
  updateLead: (id: number, updates: Partial<Lead>) => Promise<void>;
  deleteLead: (id: number) => Promise<void>;
  subscribeToChanges: () => () => void;
  getLeadsByStage: (stageId: string) => Lead[];
  getFilteredLeads: (query: string) => Lead[];
}

export const useLeadsStore = create<LeadsStore>((set, get) => ({
  leads: [],
  loading: true,
  error: null,

  fetchLeads: async () => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from("ebeauty_leads")
      .select("*")
      .not("funnel_step", "is", null);

    if (error) {
      set({ loading: false, error: error.message });
      return;
    }

    const leads = (data ?? []).map(mapRow).filter((l): l is Lead => l !== null);
    set({ leads, loading: false });
  },

  moveLead: async (id, toStageId) => {
    const funnelStep = stageIdToFunnelStep(toStageId);
    if (!funnelStep) return;

    // Optimistic update
    set({
      leads: get().leads.map((l) =>
        l.id === id ? { ...l, stageId: toStageId, funnel_step: funnelStep } : l
      ),
    });

    const { error } = await supabase
      .from("ebeauty_leads")
      .update({ funnel_step: funnelStep })
      .eq("id", id);

    if (error) {
      // Revert on error — refetch
      await get().fetchLeads();
    }
  },

  moveLeads: async (ids, toStageId) => {
    const funnelStep = stageIdToFunnelStep(toStageId);
    if (!funnelStep) return;

    // Optimistic update
    set({
      leads: get().leads.map((l) =>
        ids.includes(l.id) ? { ...l, stageId: toStageId, funnel_step: funnelStep } : l
      ),
    });

    const { error } = await supabase
      .from("ebeauty_leads")
      .update({ funnel_step: funnelStep })
      .in("id", ids);

    if (error) {
      await get().fetchLeads();
    }
  },

  addLead: async (data) => {
    const funnelStep = stageIdToFunnelStep(data.stageId);
    if (!funnelStep) return;

    const { error } = await supabase.from("ebeauty_leads").insert({
      firstname: data.firstname || null,
      lastname: data.lastname || null,
      whatsapp: data.whatsapp || null,
      funnel_step: funnelStep,
    });

    if (!error) {
      await get().fetchLeads();
    }
  },

  updateLead: async (id, updates) => {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.firstname !== undefined) dbUpdates.firstname = updates.firstname;
    if (updates.lastname !== undefined) dbUpdates.lastname = updates.lastname;
    if (updates.whatsapp !== undefined) dbUpdates.whatsapp = updates.whatsapp;
    if (updates.state !== undefined) dbUpdates.state = updates.state;
    if (updates.gender !== undefined) dbUpdates.gender = updates.gender;
    if (updates.chat_status !== undefined) dbUpdates.chat_status = updates.chat_status;
    if (updates.followup !== undefined) dbUpdates.followup = updates.followup;

    // Optimistic update
    set({
      leads: get().leads.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    });

    const { error } = await supabase
      .from("ebeauty_leads")
      .update(dbUpdates)
      .eq("id", id);

    if (error) {
      await get().fetchLeads();
    }
  },

  deleteLead: async (id) => {
    set({ leads: get().leads.filter((l) => l.id !== id) });

    const { error } = await supabase.from("ebeauty_leads").delete().eq("id", id);

    if (error) {
      await get().fetchLeads();
    }
  },

  subscribeToChanges: () => {
    const channel = supabase
      .channel("ebeauty_leads_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ebeauty_leads" },
        (payload) => {
          const { eventType } = payload;

          if (eventType === "INSERT") {
            const lead = mapRow(payload.new);
            if (lead) {
              set({ leads: [...get().leads, lead] });
            }
          } else if (eventType === "UPDATE") {
            const updated = mapRow(payload.new);
            if (updated) {
              const exists = get().leads.find((l) => l.id === updated.id);
              if (exists) {
                set({
                  leads: get().leads.map((l) => (l.id === updated.id ? updated : l)),
                });
              } else {
                // Lead now has a funnel_step — add it
                set({ leads: [...get().leads, updated] });
              }
            } else {
              // funnel_step became null — remove from list
              const id = (payload.new as { id: number }).id;
              set({ leads: get().leads.filter((l) => l.id !== id) });
            }
          } else if (eventType === "DELETE") {
            const id = (payload.old as { id: number }).id;
            set({ leads: get().leads.filter((l) => l.id !== id) });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  getLeadsByStage: (stageId) => {
    return get().leads.filter((l) => l.stageId === stageId);
  },

  getFilteredLeads: (query) => {
    if (!query.trim()) return get().leads;
    const q = query.toLowerCase();
    return get().leads.filter((l) => {
      const name = `${l.firstname ?? ""} ${l.lastname ?? ""}`.toLowerCase();
      return (
        name.includes(q) ||
        (l.whatsapp?.includes(q) ?? false) ||
        (l.state?.toLowerCase().includes(q) ?? false)
      );
    });
  },
}));
