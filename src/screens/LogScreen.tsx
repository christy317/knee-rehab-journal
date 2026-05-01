import { X, Check } from "lucide-react";
import { useStore } from "@/lib/store-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CategoryTag } from "@/components/CategoryTag";
import { PainScale } from "@/components/PainScale";
import { cn } from "@/lib/utils";
import type { Mood } from "@/lib/types";
import { toast } from "sonner";

const MOODS: Mood[] = ["Low", "Medium", "High"];

export default function LogScreen({ onSaved }: { onSaved: () => void }) {
  const { exercises, draft, removeFromToday, updateEntry, setDraftField, saveSession } = useStore();
  const todayExercises = draft.exerciseIds
    .map((id) => exercises.find((e) => e.id === id))
    .filter((e): e is NonNullable<typeof e> => !!e);

  const completedCount = todayExercises.filter((e) => draft.entries[e.id]?.completed).length;

  if (todayExercises.length === 0) {
    return (
      <div className="space-y-6 pb-4">
        <header className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Today's session</p>
          <h1 className="font-display text-3xl font-medium tracking-tight">Log session</h1>
        </header>
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Add exercises from the Protocol tab to start today's session.
          </p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    saveSession();
    toast.success("Session saved");
    onSaved();
  };

  return (
    <div className="space-y-6 pb-4">
      <header className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Today's session</p>
        <div className="flex items-baseline justify-between">
          <h1 className="font-display text-3xl font-medium tracking-tight">Log session</h1>
          <span className="text-sm text-muted-foreground">
            {completedCount}/{todayExercises.length} done
          </span>
        </div>
      </header>

      <ul className="space-y-3">
        {todayExercises.map((ex) => {
          const entry = draft.entries[ex.id] ?? { exerciseId: ex.id, completed: false, pain: null, note: "" };
          return (
            <li
              key={ex.id}
              className={cn(
                "rounded-xl border bg-card p-4 shadow-soft transition-colors",
                entry.completed ? "border-primary/30 bg-primary/[0.03]" : "border-border"
              )}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => updateEntry(ex.id, { completed: !entry.completed })}
                  aria-label="Toggle complete"
                  className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors",
                    entry.completed
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:border-primary/50"
                  )}
                >
                  {entry.completed && <Check className="h-4 w-4" strokeWidth={3} />}
                </button>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={cn("font-medium leading-snug", entry.completed && "text-muted-foreground")}>
                      {ex.name}
                    </h3>
                    <button
                      onClick={() => removeFromToday(ex.id)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Remove"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <CategoryTag category={ex.category} />
                    <span className="text-xs text-muted-foreground">{ex.defaultPrescription}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3 pl-9">
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Pain</Label>
                  <PainScale value={entry.pain} onChange={(v) => updateEntry(ex.id, { pain: v })} size="sm" />
                </div>
                <Textarea
                  value={entry.note ?? ""}
                  onChange={(e) => updateEntry(ex.id, { note: e.target.value })}
                  placeholder="Notes (optional)"
                  rows={1}
                  className="min-h-9 resize-none text-sm"
                />
              </div>
            </li>
          );
        })}
      </ul>

      <section className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-soft">
        <h2 className="font-display text-lg font-medium">Session summary</h2>

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Overall pain</Label>
          <PainScale
            value={draft.overallPain}
            onChange={(v) => setDraftField("overallPain", v)}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Energy / mood</Label>
          <div className="grid grid-cols-3 gap-2">
            {MOODS.map((m) => {
              const active = draft.mood === m;
              return (
                <button
                  key={m}
                  onClick={() => setDraftField("mood", m)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:border-primary/40"
                  )}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="snote" className="text-xs uppercase tracking-wider text-muted-foreground">
            Session note
          </Label>
          <Textarea
            id="snote"
            value={draft.note}
            onChange={(e) => setDraftField("note", e.target.value)}
            placeholder="How did the session feel overall?"
            rows={3}
          />
        </div>
      </section>

      <Button className="w-full" size="lg" onClick={handleSave}>
        Save session
      </Button>
    </div>
  );
}
