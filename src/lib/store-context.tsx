import { createContext, useContext, type ReactNode } from "react";
import { useKneedleStore } from "@/hooks/useKneedleStore";

type Store = ReturnType<typeof useKneedleStore>;

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const store = useKneedleStore();
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be used inside StoreProvider");
  return s;
}
