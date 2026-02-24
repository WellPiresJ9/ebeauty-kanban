"use client";

import { useEffect, useRef } from "react";
import { useLeadsStore } from "@/stores/useLeadsStore";

export function useSupabaseInit() {
  const fetchLeads = useLeadsStore((s) => s.fetchLeads);
  const subscribeToChanges = useLeadsStore((s) => s.subscribeToChanges);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    fetchLeads();
    const unsubscribe = subscribeToChanges();

    return () => {
      unsubscribe();
    };
  }, [fetchLeads, subscribeToChanges]);
}
