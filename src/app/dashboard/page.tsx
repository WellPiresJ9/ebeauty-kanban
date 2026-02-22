"use client";

import { useMemo } from "react";
import { useLeadsStore } from "@/stores/useLeadsStore";
import { useStagesStore } from "@/stores/useStagesStore";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { SalesFunnelChart, LeadsOverTimeChart, ConversionChart } from "@/components/dashboard/Charts";
import { formatCurrency } from "@/lib/utils";
import { differenceInDays, parseISO } from "date-fns";

export default function DashboardPage() {
  const leads = useLeadsStore((s) => s.leads);
  const stages = useStagesStore((s) => s.stages);

  const kpis = useMemo(() => {
    const totalLeads = leads.length;
    const wonLeads = leads.filter((l) => l.stageId === "stage-won");
    const lostLeads = leads.filter((l) => l.stageId === "stage-lost");
    const closedLeads = [...wonLeads, ...lostLeads];
    const activeLeads = leads.filter(
      (l) => l.stageId !== "stage-won" && l.stageId !== "stage-lost"
    );

    const conversionRate =
      closedLeads.length > 0
        ? ((wonLeads.length / closedLeads.length) * 100).toFixed(1)
        : "0";

    const totalWonValue = wonLeads.reduce((sum, l) => sum + l.value, 0);
    const avgTicket = wonLeads.length > 0 ? totalWonValue / wonLeads.length : 0;

    const pipelineValue = activeLeads.reduce((sum, l) => sum + l.value, 0);

    const avgDays =
      activeLeads.length > 0
        ? Math.round(
            activeLeads.reduce(
              (sum, l) =>
                sum + differenceInDays(new Date(), parseISO(l.createdAt)),
              0
            ) / activeLeads.length
          )
        : 0;

    return {
      totalLeads,
      activeLeads: activeLeads.length,
      wonCount: wonLeads.length,
      lostCount: lostLeads.length,
      conversionRate,
      avgTicket,
      pipelineValue,
      totalWonValue,
      avgDays,
    };
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
    const months = [
      { month: "Set", key: "2024-09" },
      { month: "Out", key: "2024-10" },
      { month: "Nov", key: "2024-11" },
      { month: "Dez", key: "2024-12" },
      { month: "Jan", key: "2025-01" },
    ];
    return months.map(({ month, key }) => ({
      month,
      leads: leads.filter((l) => l.createdAt.startsWith(key)).length,
      won: leads.filter(
        (l) => l.stageId === "stage-won" && l.closedAt?.startsWith(key)
      ).length,
    }));
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-text-primary">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Leads"
          value={String(kpis.totalLeads)}
          subtitle={`${kpis.activeLeads} ativos no pipeline`}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <KpiCard
          title="Taxa de Conversão"
          value={`${kpis.conversionRate}%`}
          subtitle={`${kpis.wonCount} ganhos, ${kpis.lostCount} perdidos`}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
          trend={{ value: `${kpis.conversionRate}%`, positive: Number(kpis.conversionRate) > 50 }}
        />
        <KpiCard
          title="Ticket Médio"
          value={formatCurrency(kpis.avgTicket)}
          subtitle={`Total ganho: ${formatCurrency(kpis.totalWonValue)}`}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <KpiCard
          title="Tempo Médio"
          value={`${kpis.avgDays} dias`}
          subtitle={`Pipeline: ${formatCurrency(kpis.pipelineValue)}`}
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
