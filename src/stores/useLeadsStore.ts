import { create } from "zustand";
import type { Lead, HistoryEntry } from "@/types";
import { generateId } from "@/lib/utils";

const SEED_LEADS: Lead[] = [
  // Novo Lead (stage-1)
  {
    id: "lead-01", name: "Clínica Bella Vita", email: "contato@bellavita.com.br", phone: "(11) 99123-4567",
    company: "Bella Vita Estética", value: 15000, stageId: "stage-1", assignedTo: "user-2",
    source: "Instagram", notes: "Interessada em linha de skincare premium",
    createdAt: "2025-01-10T10:00:00Z", updatedAt: "2025-01-10T10:00:00Z",
    history: [{ id: "h1", date: "2025-01-10T10:00:00Z", action: "Lead criado", note: "Origem: Instagram" }],
  },
  {
    id: "lead-02", name: "Studio Glow", email: "ana@studioglow.com.br", phone: "(21) 98765-4321",
    company: "Studio Glow LTDA", value: 8500, stageId: "stage-1", assignedTo: "user-3",
    source: "Site", notes: "Procurando fornecedor de dermocosméticos",
    createdAt: "2025-01-12T14:30:00Z", updatedAt: "2025-01-12T14:30:00Z",
    history: [{ id: "h2", date: "2025-01-12T14:30:00Z", action: "Lead criado", note: "Origem: Site" }],
  },
  {
    id: "lead-03", name: "Espaço Renova", email: "renova@email.com", phone: "(31) 97654-3210",
    company: "Espaço Renova", value: 22000, stageId: "stage-1", assignedTo: "user-2",
    source: "Indicação", notes: "Grande rede com 5 unidades",
    createdAt: "2025-01-15T09:00:00Z", updatedAt: "2025-01-15T09:00:00Z",
    history: [{ id: "h3", date: "2025-01-15T09:00:00Z", action: "Lead criado", note: "Origem: Indicação" }],
  },
  {
    id: "lead-04", name: "Derma Plus", email: "contato@dermaplus.com", phone: "(41) 99876-1234",
    company: "Derma Plus Clínica", value: 5200, stageId: "stage-1", assignedTo: "user-3",
    source: "Google Ads", notes: "Clínica pequena, foco em procedimentos faciais",
    createdAt: "2025-01-18T11:00:00Z", updatedAt: "2025-01-18T11:00:00Z",
    history: [{ id: "h4", date: "2025-01-18T11:00:00Z", action: "Lead criado" }],
  },

  // Contato Inicial (stage-2)
  {
    id: "lead-05", name: "Beauty House", email: "maria@beautyhouse.com", phone: "(11) 98234-5678",
    company: "Beauty House SP", value: 18000, stageId: "stage-2", assignedTo: "user-2",
    source: "Feira", notes: "Conhecemos na Beauty Fair 2024",
    createdAt: "2025-01-05T08:00:00Z", updatedAt: "2025-01-08T10:00:00Z",
    history: [
      { id: "h5a", date: "2025-01-05T08:00:00Z", action: "Lead criado", note: "Origem: Feira" },
      { id: "h5b", date: "2025-01-08T10:00:00Z", action: "Movido para etapa", fromStage: "stage-1", toStage: "stage-2" },
    ],
  },
  {
    id: "lead-06", name: "Pele & Arte", email: "contato@peleearte.com.br", phone: "(51) 99345-6789",
    company: "Pele & Arte Estética", value: 12000, stageId: "stage-2", assignedTo: "user-3",
    source: "LinkedIn", notes: "Dona muito ativa no LinkedIn, engajou com nossos posts",
    createdAt: "2025-01-06T15:00:00Z", updatedAt: "2025-01-09T14:00:00Z",
    history: [
      { id: "h6a", date: "2025-01-06T15:00:00Z", action: "Lead criado" },
      { id: "h6b", date: "2025-01-09T14:00:00Z", action: "Movido para etapa", fromStage: "stage-1", toStage: "stage-2" },
    ],
  },
  {
    id: "lead-07", name: "Clínica Harmonia", email: "admin@harmonia.med.br", phone: "(61) 98456-7890",
    company: "Harmonia Clínica Médica", value: 35000, stageId: "stage-2", assignedTo: "user-2",
    source: "Indicação", notes: "Indicação do Dr. Roberto, grande potencial",
    createdAt: "2025-01-03T10:00:00Z", updatedAt: "2025-01-07T16:00:00Z",
    history: [
      { id: "h7a", date: "2025-01-03T10:00:00Z", action: "Lead criado", note: "Indicação: Dr. Roberto" },
      { id: "h7b", date: "2025-01-07T16:00:00Z", action: "Movido para etapa", fromStage: "stage-1", toStage: "stage-2" },
    ],
  },
  {
    id: "lead-08", name: "Estética Prime", email: "prime@estetica.com", phone: "(19) 97567-8901",
    company: "Prime Estética", value: 9800, stageId: "stage-2", assignedTo: "user-3",
    source: "Instagram", notes: "Seguidora ativa, respondeu stories",
    createdAt: "2025-01-07T12:00:00Z", updatedAt: "2025-01-11T09:00:00Z",
    history: [
      { id: "h8a", date: "2025-01-07T12:00:00Z", action: "Lead criado" },
      { id: "h8b", date: "2025-01-11T09:00:00Z", action: "Movido para etapa", fromStage: "stage-1", toStage: "stage-2" },
    ],
  },

  // Apresentação (stage-3)
  {
    id: "lead-09", name: "Dra. Fernanda Costa", email: "fernanda@dracosta.com.br", phone: "(11) 96678-9012",
    company: "Consultório Dra. Fernanda", value: 28000, stageId: "stage-3", assignedTo: "user-2",
    source: "Evento", notes: "Dermatologista com alto volume de pacientes",
    createdAt: "2024-12-20T10:00:00Z", updatedAt: "2025-01-10T11:00:00Z",
    history: [
      { id: "h9a", date: "2024-12-20T10:00:00Z", action: "Lead criado" },
      { id: "h9b", date: "2024-12-28T10:00:00Z", action: "Movido para etapa", fromStage: "stage-1", toStage: "stage-2" },
      { id: "h9c", date: "2025-01-10T11:00:00Z", action: "Movido para etapa", fromStage: "stage-2", toStage: "stage-3" },
    ],
  },
  {
    id: "lead-10", name: "Rede Bela Face", email: "compras@belaface.com.br", phone: "(21) 95789-0123",
    company: "Bela Face Franquias", value: 65000, stageId: "stage-3", assignedTo: "user-2",
    source: "Site", notes: "Rede de franquias com 12 unidades, ticket alto",
    createdAt: "2024-12-15T09:00:00Z", updatedAt: "2025-01-09T15:00:00Z",
    history: [
      { id: "h10a", date: "2024-12-15T09:00:00Z", action: "Lead criado" },
      { id: "h10b", date: "2024-12-22T10:00:00Z", action: "Movido para etapa", fromStage: "stage-1", toStage: "stage-2" },
      { id: "h10c", date: "2025-01-09T15:00:00Z", action: "Movido para etapa", fromStage: "stage-2", toStage: "stage-3" },
    ],
  },
  {
    id: "lead-11", name: "Centro Estético Aura", email: "aura@centroestetico.com", phone: "(85) 94890-1234",
    company: "Aura Centro Estético", value: 14500, stageId: "stage-3", assignedTo: "user-3",
    source: "Google Ads", notes: "Focada em tratamentos corporais",
    createdAt: "2024-12-22T14:00:00Z", updatedAt: "2025-01-12T10:00:00Z",
    history: [
      { id: "h11a", date: "2024-12-22T14:00:00Z", action: "Lead criado" },
      { id: "h11b", date: "2025-01-02T10:00:00Z", action: "Movido para etapa", fromStage: "stage-1", toStage: "stage-2" },
      { id: "h11c", date: "2025-01-12T10:00:00Z", action: "Movido para etapa", fromStage: "stage-2", toStage: "stage-3" },
    ],
  },

  // Proposta Enviada (stage-4)
  {
    id: "lead-12", name: "Spa Serenity", email: "contato@spaserenity.com.br", phone: "(47) 93901-2345",
    company: "Serenity Day Spa", value: 42000, stageId: "stage-4", assignedTo: "user-2",
    source: "Indicação", notes: "Spa resort, proposta de fornecimento contínuo",
    createdAt: "2024-12-10T10:00:00Z", updatedAt: "2025-01-13T09:00:00Z",
    history: [
      { id: "h12a", date: "2024-12-10T10:00:00Z", action: "Lead criado" },
      { id: "h12b", date: "2024-12-18T10:00:00Z", action: "Movido para etapa", fromStage: "stage-1", toStage: "stage-2" },
      { id: "h12c", date: "2024-12-28T10:00:00Z", action: "Movido para etapa", fromStage: "stage-2", toStage: "stage-3" },
      { id: "h12d", date: "2025-01-13T09:00:00Z", action: "Movido para etapa", fromStage: "stage-3", toStage: "stage-4", note: "Proposta R$ 42.000 enviada" },
    ],
  },
  {
    id: "lead-13", name: "Essence Beauty", email: "julia@essencebeauty.com", phone: "(11) 92012-3456",
    company: "Essence Beauty LTDA", value: 19500, stageId: "stage-4", assignedTo: "user-3",
    source: "Feira", notes: "Interessada em exclusividade regional",
    createdAt: "2024-12-08T11:00:00Z", updatedAt: "2025-01-11T14:00:00Z",
    history: [
      { id: "h13a", date: "2024-12-08T11:00:00Z", action: "Lead criado" },
      { id: "h13b", date: "2024-12-15T10:00:00Z", action: "Movido para etapa", fromStage: "stage-1", toStage: "stage-2" },
      { id: "h13c", date: "2024-12-28T10:00:00Z", action: "Movido para etapa", fromStage: "stage-2", toStage: "stage-3" },
      { id: "h13d", date: "2025-01-11T14:00:00Z", action: "Movido para etapa", fromStage: "stage-3", toStage: "stage-4" },
    ],
  },
  {
    id: "lead-14", name: "Vitale Cosméticos", email: "compras@vitale.com", phone: "(31) 91123-4567",
    company: "Vitale Cosméticos ME", value: 7800, stageId: "stage-4", assignedTo: "user-2",
    source: "Site", notes: "Loja de cosméticos, quer revender",
    createdAt: "2024-12-12T16:00:00Z", updatedAt: "2025-01-14T10:00:00Z",
    history: [
      { id: "h14a", date: "2024-12-12T16:00:00Z", action: "Lead criado" },
      { id: "h14b", date: "2024-12-20T10:00:00Z", action: "Movido para etapa", fromStage: "stage-1", toStage: "stage-2" },
      { id: "h14c", date: "2025-01-05T10:00:00Z", action: "Movido para etapa", fromStage: "stage-2", toStage: "stage-3" },
      { id: "h14d", date: "2025-01-14T10:00:00Z", action: "Movido para etapa", fromStage: "stage-3", toStage: "stage-4" },
    ],
  },

  // Fechamento (stage-5)
  {
    id: "lead-15", name: "Clínica Dermozen", email: "comercial@dermozen.com.br", phone: "(11) 90234-5678",
    company: "Dermozen Clínica", value: 55000, stageId: "stage-5", assignedTo: "user-2",
    source: "LinkedIn", notes: "Em negociação final, aguardando aprovação do sócio",
    createdAt: "2024-11-20T10:00:00Z", updatedAt: "2025-01-15T11:00:00Z",
    history: [
      { id: "h15a", date: "2024-11-20T10:00:00Z", action: "Lead criado" },
      { id: "h15b", date: "2024-12-01T10:00:00Z", action: "Movido para etapa", fromStage: "stage-1", toStage: "stage-2" },
      { id: "h15c", date: "2024-12-15T10:00:00Z", action: "Movido para etapa", fromStage: "stage-2", toStage: "stage-3" },
      { id: "h15d", date: "2025-01-05T10:00:00Z", action: "Movido para etapa", fromStage: "stage-3", toStage: "stage-4" },
      { id: "h15e", date: "2025-01-15T11:00:00Z", action: "Movido para etapa", fromStage: "stage-4", toStage: "stage-5" },
    ],
  },
  {
    id: "lead-16", name: "Natural Beauty Lab", email: "lab@naturalbeauty.com.br", phone: "(21) 99345-6789",
    company: "Natural Beauty Lab LTDA", value: 31000, stageId: "stage-5", assignedTo: "user-3",
    source: "Evento", notes: "Contrato quase fechado, revisão jurídica em andamento",
    createdAt: "2024-11-25T09:00:00Z", updatedAt: "2025-01-16T10:00:00Z",
    history: [
      { id: "h16a", date: "2024-11-25T09:00:00Z", action: "Lead criado" },
      { id: "h16b", date: "2024-12-05T10:00:00Z", action: "Movido para etapa", fromStage: "stage-1", toStage: "stage-2" },
      { id: "h16c", date: "2024-12-18T10:00:00Z", action: "Movido para etapa", fromStage: "stage-2", toStage: "stage-3" },
      { id: "h16d", date: "2025-01-08T10:00:00Z", action: "Movido para etapa", fromStage: "stage-3", toStage: "stage-4" },
      { id: "h16e", date: "2025-01-16T10:00:00Z", action: "Movido para etapa", fromStage: "stage-4", toStage: "stage-5" },
    ],
  },

  // Ganhou (stage-won)
  {
    id: "lead-17", name: "Belíssima Estética", email: "contato@belissima.com.br", phone: "(11) 98456-7890",
    company: "Belíssima Estética", value: 24000, stageId: "stage-won", assignedTo: "user-2",
    source: "Indicação", notes: "Cliente fechado! Primeiro pedido em fevereiro.",
    createdAt: "2024-11-01T10:00:00Z", updatedAt: "2025-01-10T10:00:00Z", closedAt: "2025-01-10T10:00:00Z",
    history: [
      { id: "h17a", date: "2024-11-01T10:00:00Z", action: "Lead criado" },
      { id: "h17b", date: "2025-01-10T10:00:00Z", action: "Marcado como Ganhou", note: "Contrato assinado" },
    ],
  },
  {
    id: "lead-18", name: "Face & Co", email: "comercial@faceco.com.br", phone: "(21) 97567-8901",
    company: "Face & Co Ltda", value: 38000, stageId: "stage-won", assignedTo: "user-3",
    source: "Feira", notes: "Grande rede, contrato de 12 meses",
    createdAt: "2024-10-15T10:00:00Z", updatedAt: "2025-01-05T10:00:00Z", closedAt: "2025-01-05T10:00:00Z",
    history: [
      { id: "h18a", date: "2024-10-15T10:00:00Z", action: "Lead criado" },
      { id: "h18b", date: "2025-01-05T10:00:00Z", action: "Marcado como Ganhou", note: "Contrato 12 meses" },
    ],
  },
  {
    id: "lead-19", name: "Skin Care Brasil", email: "admin@skincarebrasil.com", phone: "(41) 96678-9012",
    company: "Skin Care Brasil", value: 16500, stageId: "stage-won", assignedTo: "user-2",
    source: "Google Ads", notes: "Pedido inicial + reposição mensal",
    createdAt: "2024-10-20T10:00:00Z", updatedAt: "2024-12-28T10:00:00Z", closedAt: "2024-12-28T10:00:00Z",
    history: [
      { id: "h19a", date: "2024-10-20T10:00:00Z", action: "Lead criado" },
      { id: "h19b", date: "2024-12-28T10:00:00Z", action: "Marcado como Ganhou" },
    ],
  },
  {
    id: "lead-20", name: "Estética Luxo", email: "luxo@estetica.com.br", phone: "(11) 95789-0123",
    company: "Luxo Estética Premium", value: 48000, stageId: "stage-won", assignedTo: "user-3",
    source: "LinkedIn", notes: "Conta premium, exclusividade garantida",
    createdAt: "2024-09-10T10:00:00Z", updatedAt: "2024-12-15T10:00:00Z", closedAt: "2024-12-15T10:00:00Z",
    history: [
      { id: "h20a", date: "2024-09-10T10:00:00Z", action: "Lead criado" },
      { id: "h20b", date: "2024-12-15T10:00:00Z", action: "Marcado como Ganhou", note: "Contrato premium" },
    ],
  },

  // Perdido (stage-lost)
  {
    id: "lead-21", name: "Corpo & Mente", email: "info@corpomente.com", phone: "(51) 94890-1234",
    company: "Corpo & Mente Spa", value: 11000, stageId: "stage-lost", assignedTo: "user-2",
    source: "Instagram", notes: "Optou pelo concorrente por preço",
    createdAt: "2024-11-10T10:00:00Z", updatedAt: "2025-01-08T10:00:00Z", closedAt: "2025-01-08T10:00:00Z",
    history: [
      { id: "h21a", date: "2024-11-10T10:00:00Z", action: "Lead criado" },
      { id: "h21b", date: "2025-01-08T10:00:00Z", action: "Marcado como Perdido", note: "Escolheu concorrente" },
    ],
  },
  {
    id: "lead-22", name: "Clínica Sol", email: "sol@clinica.com", phone: "(85) 93901-2345",
    company: "Clínica Sol LTDA", value: 6500, stageId: "stage-lost", assignedTo: "user-3",
    source: "Site", notes: "Sem orçamento no momento",
    createdAt: "2024-11-15T10:00:00Z", updatedAt: "2025-01-06T10:00:00Z", closedAt: "2025-01-06T10:00:00Z",
    history: [
      { id: "h22a", date: "2024-11-15T10:00:00Z", action: "Lead criado" },
      { id: "h22b", date: "2025-01-06T10:00:00Z", action: "Marcado como Perdido", note: "Sem budget" },
    ],
  },
  {
    id: "lead-23", name: "Dermato Center", email: "contato@dermatocenter.com", phone: "(47) 92012-3456",
    company: "Dermato Center", value: 13000, stageId: "stage-lost", assignedTo: "user-2",
    source: "Evento", notes: "Não respondeu após proposta",
    createdAt: "2024-10-25T10:00:00Z", updatedAt: "2024-12-20T10:00:00Z", closedAt: "2024-12-20T10:00:00Z",
    history: [
      { id: "h23a", date: "2024-10-25T10:00:00Z", action: "Lead criado" },
      { id: "h23b", date: "2024-12-20T10:00:00Z", action: "Marcado como Perdido", note: "Sem resposta" },
    ],
  },

  // More in active pipeline
  {
    id: "lead-24", name: "Vita Derme", email: "vendas@vitaderme.com.br", phone: "(11) 91234-0000",
    company: "Vita Derme Cosméticos", value: 27500, stageId: "stage-3", assignedTo: "user-2",
    source: "Feira", notes: "Apresentação agendada para próxima semana",
    createdAt: "2024-12-18T10:00:00Z", updatedAt: "2025-01-13T10:00:00Z",
    history: [
      { id: "h24a", date: "2024-12-18T10:00:00Z", action: "Lead criado" },
      { id: "h24b", date: "2024-12-28T10:00:00Z", action: "Movido para etapa", fromStage: "stage-1", toStage: "stage-2" },
      { id: "h24c", date: "2025-01-13T10:00:00Z", action: "Movido para etapa", fromStage: "stage-2", toStage: "stage-3" },
    ],
  },
  {
    id: "lead-25", name: "Beauty Connect", email: "hub@beautyconnect.com", phone: "(21) 90345-1111",
    company: "Beauty Connect Hub", value: 33000, stageId: "stage-4", assignedTo: "user-3",
    source: "LinkedIn", notes: "Marketplace de beleza, alto volume potencial",
    createdAt: "2024-12-05T10:00:00Z", updatedAt: "2025-01-15T10:00:00Z",
    history: [
      { id: "h25a", date: "2024-12-05T10:00:00Z", action: "Lead criado" },
      { id: "h25b", date: "2024-12-12T10:00:00Z", action: "Movido para etapa", fromStage: "stage-1", toStage: "stage-2" },
      { id: "h25c", date: "2024-12-28T10:00:00Z", action: "Movido para etapa", fromStage: "stage-2", toStage: "stage-3" },
      { id: "h25d", date: "2025-01-15T10:00:00Z", action: "Movido para etapa", fromStage: "stage-3", toStage: "stage-4" },
    ],
  },
];

const SEED_USERS = [
  { id: "user-1", name: "João Silva", role: "Gestor" },
  { id: "user-2", name: "Ana Oliveira", role: "Vendedora" },
  { id: "user-3", name: "Camila Santos", role: "Vendedora" },
];

interface LeadsStore {
  leads: Lead[];
  users: typeof SEED_USERS;

  addLead: (lead: Omit<Lead, "id" | "createdAt" | "updatedAt" | "history">) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  moveLead: (id: string, toStageId: string) => void;
  moveLeads: (ids: string[], toStageId: string) => void;
  markAsWon: (id: string) => void;
  markAsLost: (id: string) => void;
  deleteLead: (id: string) => void;
  getLeadsByStage: (stageId: string) => Lead[];
  getFilteredLeads: (query: string) => Lead[];
}

export const useLeadsStore = create<LeadsStore>((set, get) => ({
  leads: SEED_LEADS,
  users: SEED_USERS,

  addLead: (leadData) => {
    const now = new Date().toISOString();
    const newLead: Lead = {
      ...leadData,
      id: `lead-${generateId()}`,
      createdAt: now,
      updatedAt: now,
      history: [{ id: generateId(), date: now, action: "Lead criado" }],
    };
    set({ leads: [...get().leads, newLead] });
  },

  updateLead: (id, updates) => {
    set({
      leads: get().leads.map((l) =>
        l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l
      ),
    });
  },

  moveLead: (id, toStageId) => {
    const now = new Date().toISOString();
    set({
      leads: get().leads.map((l) => {
        if (l.id !== id) return l;
        const entry: HistoryEntry = {
          id: generateId(),
          date: now,
          action: "Movido para etapa",
          fromStage: l.stageId,
          toStage: toStageId,
        };
        return {
          ...l,
          stageId: toStageId,
          updatedAt: now,
          history: [...l.history, entry],
        };
      }),
    });
  },

  moveLeads: (ids, toStageId) => {
    const now = new Date().toISOString();
    set({
      leads: get().leads.map((l) => {
        if (!ids.includes(l.id)) return l;
        const entry: HistoryEntry = {
          id: generateId(),
          date: now,
          action: "Movido para etapa",
          fromStage: l.stageId,
          toStage: toStageId,
        };
        return {
          ...l,
          stageId: toStageId,
          updatedAt: now,
          history: [...l.history, entry],
        };
      }),
    });
  },

  markAsWon: (id) => {
    const now = new Date().toISOString();
    set({
      leads: get().leads.map((l) => {
        if (l.id !== id) return l;
        const entry: HistoryEntry = {
          id: generateId(),
          date: now,
          action: "Marcado como Ganhou",
        };
        return {
          ...l,
          stageId: "stage-won",
          updatedAt: now,
          closedAt: now,
          history: [...l.history, entry],
        };
      }),
    });
  },

  markAsLost: (id) => {
    const now = new Date().toISOString();
    set({
      leads: get().leads.map((l) => {
        if (l.id !== id) return l;
        const entry: HistoryEntry = {
          id: generateId(),
          date: now,
          action: "Marcado como Perdido",
        };
        return {
          ...l,
          stageId: "stage-lost",
          updatedAt: now,
          closedAt: now,
          history: [...l.history, entry],
        };
      }),
    });
  },

  deleteLead: (id) => {
    set({ leads: get().leads.filter((l) => l.id !== id) });
  },

  getLeadsByStage: (stageId) => {
    return get().leads.filter((l) => l.stageId === stageId);
  },

  getFilteredLeads: (query) => {
    if (!query.trim()) return get().leads;
    const q = query.toLowerCase();
    return get().leads.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.includes(q)
    );
  },
}));
