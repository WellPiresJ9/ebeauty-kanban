import { create } from "zustand";

const VALID_EMAIL = "petter@ebeauty.com";
const VALID_PASSWORD = "ebeauty2026@";
const STORAGE_KEY = "ebeauty_auth";

interface AuthStore {
  isAuthenticated: boolean;
  userName: string;
  userEmail: string;
  login: (email: string, password: string) => string | null;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  userName: "",
  userEmail: "",

  login: (email, password) => {
    if (email !== VALID_EMAIL) return "Email inválido";
    if (password !== VALID_PASSWORD) return "Senha incorreta";

    const auth = { userName: "Petter Vidal", userEmail: email };
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    }
    set({ isAuthenticated: true, ...auth });
    return null;
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    set({ isAuthenticated: false, userName: "", userEmail: "" });
  },

  hydrate: () => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const auth = JSON.parse(stored);
        set({ isAuthenticated: true, userName: auth.userName, userEmail: auth.userEmail });
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  },
}));
