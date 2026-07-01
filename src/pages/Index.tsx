import { useState } from "react";
import { StoreProvider, useStore } from "@/lib/store-context";
import { TabBar, type Tab } from "@/components/TabBar";
import ProtocolScreen from "@/screens/ProtocolScreen";
import LogScreen from "@/screens/LogScreen";
import HistoryScreen from "@/screens/HistoryScreen";

function AppShell() {
  const [tab, setTab] = useState<Tab>("protocol");
  const { draft } = useStore();
  const todayCount = draft.exerciseIds.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        <div className="flex items-center gap-2 px-5 pb-2 pt-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lift">
            <KneedleMark />
          </div>
          <span className="text-lg font-bold tracking-tight">Kneedle</span>
        </div>


        <main className="flex-1 px-5 pb-28">
          {tab === "protocol" && <ProtocolScreen />}
          {tab === "log" && <LogScreen onSaved={() => setTab("history")} />}
          {tab === "history" && <HistoryScreen />}
        </main>
      </div>

      <TabBar active={tab} onChange={setTab} badge={{ log: todayCount || undefined }} />
    </div>
  );
}

function KneedleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 4c0 4 2 6 2 8s-2 4-2 8" />
      <path d="M17 4c0 4-2 6-2 8s2 4 2 8" />
    </svg>
  );
}

const Index = () => (
  <StoreProvider>
    <AppShell />
  </StoreProvider>
);

export default Index;
