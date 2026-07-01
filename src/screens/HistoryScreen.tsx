import { useState } from "react";
import { Flame, ChevronDown } from "lucide-react";
import { useStore } from "@/lib/store-context";
import { avgPainLast14, cn, computeStreak, formatDate, painColor } from "@/lib/utils";
import { CategoryTag } from "@/components/CategoryTag";

export default function HistoryScreen() {
  const { logs, exercises } = useStore();
  const [openId, setOpenId] = useState<string | null>(null);

  const streak = computeStreak(logs);
  const avg = avgPainLast14(logs);
  const exById = new Map(exercises.map((e) => [e.id, e]));

  return (
    <div className="space-y-6 pb-4">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">History</p>
        <h1 className="text-3xl font-bold tracking-tight">Your sessions</h1>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Current streak"
          value={`${streak}`}
          suffix={streak === 1 ? "day" : "days"}
          icon={<Flame className="h-4 w-4 text-pain-3" />}
        />
        <StatCard
          label="Avg pain · 14d"
          value={avg == null ? "—" : avg.toFixed(1)}
          suffix={avg == null ? "" : "/ 5"}
          accent={avg != null ? painColor(Math.max(1, Math.min(5, Math.round(avg)))) : undefined}
        />
      </div>

      {logs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
          <p className="text-sm text-muted-foreground">No sessions logged yet.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {logs.map((log) => {
            const expanded = openId === log.id;
            return (
              <li key={log.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                <button
                  onClick={() => setOpenId(expanded ? null : log.id)}
                  className="flex w-full items-center gap-3 p-4 text-left"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{formatDate(log.date)}</span>
                      {log.mood && (
                        <span className="text-xs text-muted-foreground">· {log.mood} energy</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {log.exercises.filter((e) => e.completed).length} exercises completed
                    </p>
                  </div>
                  {log.overallPain != null && (
                    <span
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white",
                        painColor(log.overallPain)
                      )}
                      aria-label={`Overall pain ${log.overallPain}`}
                    >
                      {log.overallPain}
                    </span>
                  )}
                  <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", expanded && "rotate-180")} />
                </button>

                {expanded && (
                  <div className="animate-fade-in space-y-3 border-t border-border bg-surface/40 p-4">
                    <ul className="space-y-2">
                      {log.exercises.map((entry) => {
                        const ex = exById.get(entry.exerciseId);
                        if (!ex) return null;
                        return (
                          <li key={entry.exerciseId} className="rounded-md border border-border/70 bg-card p-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className={cn("text-sm font-medium", !entry.completed && "text-muted-foreground line-through")}>
                                    {ex.name}
                                  </span>
                                </div>
                                <CategoryTag category={ex.category} />
                                {entry.note && (
                                  <p className="pt-1 text-xs text-muted-foreground">{entry.note}</p>
                                )}
                              </div>
                              {entry.pain != null && (
                                <span
                                  className={cn(
                                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white",
                                    painColor(entry.pain)
                                  )}
                                >
                                  {entry.pain}
                                </span>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>

                    {log.note && (
                      <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Note</p>
                        <p className="text-sm leading-relaxed">{log.note}</p>
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  suffix,
  icon,
  accent,
}: {
  label: string;
  value: string;
  suffix?: string;
  icon?: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className={cn("text-3xl font-bold tracking-tight", accent && "text-foreground")}>
          {value}
        </span>
        {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
        {accent && <span className={cn("ml-auto h-2.5 w-2.5 rounded-full", accent)} />}
      </div>
    </div>
  );
}
