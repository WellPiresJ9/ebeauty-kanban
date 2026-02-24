"use client";

import { useMemo } from "react";
import { useLeadsStore } from "@/stores/useLeadsStore";
import { useStagesStore } from "@/stores/useStagesStore";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { SalesFunnelChart, LeadsOverTimeChart, ConversionChart } from "@/components/dashboard/Charts";
import { differenceInDays, parseISO, format } from "date-fns";

export default function DashboardPage() {
  const leads = useLeadsStore((s) => s.leads);
  const loading = useLeadsStore((s) => s.loading);
  const stages = useStagesStore((s) => s.stages);

  const kpis = useMemo(() => {
    const totalLeads = leads.length;
    const inboxLeads = leads.filter((l) => l.stageId === "stage-1").length;
    const openChats = leads.filter((l) => l.chat_status && l.chat_status !== "closed").length;

    const avgDays =
      totalLeads > 0
        ? Math.round(
            leads.reduce((sum, l) => {
              if (!l.created_at) return sum;
              return sum + differenceInDays(new Date(), parseISO(l.created_at));
            }, 0) / totalLeads
          )
        : 0;

    return { totalLeads, inboxLeads, openChats, avgDays };
  }, [leads]);

  const funnelData = useMemo(() => {
    const sortedStages = [...stages].sort((a, b) => a.order - b.order);
    return sortedStages.map((stage) => ({
      name: stage.name,
      value: leads.filter((l) => l.stageId === stage.id).length,
      fill: stage.color,
    }));
  }, [leads, stages]);

  const leadsOverTime = useMemo(() => {
    if (leads.length === 0) return [];
    // Generate months dynamically from real data
    const monthSet = new Map<string, { leads: number }>();
    for (const lead of leads) {
      if (!lead.created_at) continue;
      const key = lead.created_at.substring(0, 7); // "YYYY-MM"
      const entry = monthSet.get(key);
      if (entry) {
        entry.leads++;
      } else {
        monthSet.set(key, { leads: 1 });
      }
    }
    return [...monthSet.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([key, val]) => {
        const [year, month] = key.split("-");
        const date = new Date(Number(year), Number(month) - 1);
        return {
          month: format(date, "MMM yy"),
          leads: val.leads,
        };
      });
  }, [leads]);

  const conversionData = useMemo(() => {
    const sortedStages = [...stages].sort((a, b) => a.order - b.order);
    return sortedStages
      .map((stage) => ({
        name: stage.name,
        value: leads.filter((l) => l.stageId === stage.id).length,
        color: stage.color,
      }))
      .filter((d) => d.value > 0);
  }, [leads, stages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-text-secondary text-sm">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-text-primary">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Leads"
          value={String(kpis.totalLeads)}
          subtitle="Leads com etapa definida"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <KpiCard
          title="Leads no Inbox"
          value={String(kpis.inboxLeads)}
          subtitle="Aguardando atendimento"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          }
        />
        <KpiCard
          title="Chats Abertos"
          value={String(kpis.openChats)}
          subtitle="Conversas ativas"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          }
        />
        <KpiCard
          title="Tempo Médio"
          value={`${kpis.avgDays} dias`}
          subtitle="Desde criação do lead"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SalesFunnelChart data={funnelData} />
        <LeadsOverTimeChart data={leadsOverTime} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ConversionChart data={conversionData} />
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">
            Resumo do Pipeline
          </h3>
          <div className="space-y-3">
            {funnelData.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-sm text-text-secondary flex-1">
                  {item.name}
                </span>
                <span className="text-sm font-medium text-text-primary">
                  {item.value}
                </span>
                <div className="w-24 h-1.5 bg-surface-hover rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.max((item.value / Math.max(...funnelData.map((d) => d.value), 1)) * 100, 5)}%`,
                      backgroundColor: item.fill,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
