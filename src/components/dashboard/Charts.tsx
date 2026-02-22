"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
  Cell,
  LineChart,
  Line,
  PieChart,
  Pie,
} from "recharts";

interface FunnelChartProps {
  data: { name: string; value: number; fill: string }[];
}

export function SalesFunnelChart({ data }: FunnelChartProps) {
  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-4">Funil de Vendas</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,169,110,0.15)" />
          <XAxis type="number" tick={{ fill: "#6B6B6B", fontSize: 11 }} />
          <YAxis
            dataKey="name"
            type="category"
            width={120}
            tick={{ fill: "#6B6B6B", fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid rgba(201,169,110,0.3)",
              borderRadius: 8,
              fontSize: 12,
              color: "#1A1A1A",
            }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface LeadsOverTimeProps {
  data: { month: string; leads: number; won: number }[];
}

export function LeadsOverTimeChart({ data }: LeadsOverTimeProps) {
  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        Leads ao Longo do Tempo
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,169,110,0.15)" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#6B6B6B", fontSize: 11 }}
          />
          <YAxis tick={{ fill: "#6B6B6B", fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid rgba(201,169,110,0.3)",
              borderRadius: 8,
              fontSize: 12,
              color: "#1A1A1A",
            }}
          />
          <Line
            type="monotone"
            dataKey="leads"
            stroke="#C9A96E"
            strokeWidth={2}
            dot={{ fill: "#C9A96E", r: 4 }}
            name="Leads Criados"
          />
          <Line
            type="monotone"
            dataKey="won"
            stroke="#6BAF7B"
            strokeWidth={2}
            dot={{ fill: "#6BAF7B", r: 4 }}
            name="Ganhos"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface ConversionProps {
  data: { name: string; value: number; color: string }[];
}

export function ConversionChart({ data }: ConversionProps) {
  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        Distribuição por Etapa
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={50}
            paddingAngle={3}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid rgba(201,169,110,0.3)",
              borderRadius: 8,
              fontSize: 12,
              color: "#1A1A1A",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
