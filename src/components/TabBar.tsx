import { Activity, ClipboardList, History } from "lucide-react";
import { cn } from "@/lib/utils";

export type Tab = "protocol" | "log" | "history";

const TABS: { id: Tab; label: string; Icon: typeof Activity }[] = [
  { id: "protocol", label: "Protocol", Icon: ClipboardList },
  { id: "log", label: "Log", Icon: Activity },
  { id: "history", label: "History", Icon: History },
];

export function TabBar({
  active,
  onChange,
  badge,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
  badge?: Partial<Record<Tab, number>>;
}) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 pt-2 pb-2">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          const count = badge?.[id];
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-1 rounded-md px-3 py-2 text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="relative">
                <Icon className={cn("h-5 w-5", isActive && "stroke-[2.25]")} />
                {count ? (
                  <span className="absolute -right-2 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                    {count}
                  </span>
                ) : null}
              </span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
