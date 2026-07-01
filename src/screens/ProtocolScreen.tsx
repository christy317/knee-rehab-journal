import { useMemo, useState } from "react";
import { Plus, Check, ChevronRight } from "lucide-react";
import { CATEGORY_ORDER, CATEGORY_ICON, cn } from "@/lib/utils";
import { useStore } from "@/lib/store-context";
import { CategoryTag } from "@/components/CategoryTag";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Category, Exercise } from "@/lib/types";
import { toast } from "sonner";
import heroKnee from "@/assets/hero-knee.jpg";

export default function ProtocolScreen() {
  const { exercises, draft, addToToday, upsertExercise, addCustomExercise } = useStore();
  const [openId, setOpenId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const grouped = useMemo(() => {
    const m = new Map<Category, Exercise[]>();
    CATEGORY_ORDER.forEach((c) => m.set(c, []));
    exercises.forEach((e) => m.get(e.category)?.push(e));
    return m;
  }, [exercises]);

  const open = exercises.find((e) => e.id === openId) ?? null;
  const inToday = (id: string) => draft.exerciseIds.includes(id);

  return (
    <div className="space-y-6 pb-4">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Your protocol</p>
        <h1 className="text-3xl font-bold tracking-tight">Today's exercises</h1>
        <div className="relative overflow-hidden rounded-2xl bg-secondary">
          <img
            src={heroKnee}
            alt="Knee in a compression sleeve"
            className="h-40 w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent p-4">
            <p className="text-sm font-medium text-foreground">
              Move gently. Build consistency.
            </p>
          </div>
        </div>
      </header>

      {CATEGORY_ORDER.map((cat) => {
        const items = grouped.get(cat) ?? [];
        if (items.length === 0) return null;
        return (
          <section key={cat} className="space-y-3">
            <div className="flex items-center gap-3 px-1">
              <img
                src={CATEGORY_ICON[cat]}
                alt=""
                loading="lazy"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
              <div className="flex-1">
                <h2 className="text-base font-bold tracking-tight">{cat}</h2>
                <p className="text-xs text-muted-foreground">{items.length} exercises</p>
              </div>
            </div>
            <ul className="space-y-2">
              {items.map((ex) => {
                const added = inToday(ex.id);
                return (
                  <li key={ex.id}>
                    <div className="group rounded-2xl border border-border bg-card transition-shadow hover:shadow-lift">
                      <button
                        onClick={() => setOpenId(ex.id)}
                        className="flex w-full items-center gap-3 p-3 text-left"
                      >
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-secondary">
                          <img
                            src={CATEGORY_ICON[ex.category]}
                            alt=""
                            loading="lazy"
                            width={48}
                            height={48}
                            className="h-12 w-12 object-contain"
                          />
                        </div>
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <h3 className="font-semibold leading-snug truncate">{ex.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {ex.defaultPrescription} · {ex.category}
                          </p>
                        </div>
                        <Button
                          size="icon"
                          variant={added ? "secondary" : "default"}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!added) {
                              addToToday(ex.id);
                              toast.success(`${ex.name} added to today`);
                            }
                          }}
                          className={cn(
                            "h-9 w-9 shrink-0 rounded-full",
                            added && "pointer-events-none bg-primary-soft text-primary"
                          )}
                          aria-label={added ? "Added" : "Add to today"}
                        >
                          {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        </Button>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <Button
        variant="outline"
        className="w-full gap-2 rounded-full border-dashed py-6"
        onClick={() => setShowAdd(true)}
      >
        <Plus className="h-4 w-4" /> Add custom exercise
      </Button>

      <ExerciseSheet
        exercise={open}
        onClose={() => setOpenId(null)}
        onSave={(updated) => {
          upsertExercise(updated);
          toast.success("Saved");
        }}
        onAdd={(id) => {
          addToToday(id);
          toast.success("Added to today");
        }}
        added={open ? inToday(open.id) : false}
      />

      <AddCustomDialog
        open={showAdd}
        onOpenChange={setShowAdd}
        onCreate={(data) => {
          const ex = addCustomExercise(data);
          setShowAdd(false);
          toast.success(`${ex.name} added to library`);
        }}
      />
    </div>
  );
}

function ExerciseSheet({
  exercise,
  onClose,
  onSave,
  onAdd,
  added,
}: {
  exercise: Exercise | null;
  onClose: () => void;
  onSave: (ex: Exercise) => void;
  onAdd: (id: string) => void;
  added: boolean;
}) {
  const [prescription, setPrescription] = useState("");
  const [notes, setNotes] = useState("");

  useMemoSync(exercise, (e) => {
    setPrescription(e.defaultPrescription);
    setNotes(e.notes ?? "");
  });

  return (
    <Sheet open={!!exercise} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto rounded-t-3xl">
        {exercise && (
          <div className="mx-auto max-w-md space-y-5">
            <div className="flex justify-center">
              <img
                src={CATEGORY_ICON[exercise.category]}
                alt=""
                width={96}
                height={96}
                className="h-24 w-24 object-contain"
              />
            </div>
            <SheetHeader className="space-y-2 text-center">
              <CategoryTag category={exercise.category} className="mx-auto" />
              <SheetTitle className="text-2xl font-bold leading-tight">
                {exercise.name}
              </SheetTitle>
              <SheetDescription className="text-sm">{exercise.description}</SheetDescription>
            </SheetHeader>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                How to perform
              </h4>
              <ol className="space-y-2">
                {exercise.demo.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prescription">Reps / hold</Label>
              <Input
                id="prescription"
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes">Personal notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What helps, what to watch, modifications…"
                rows={3}
              />
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <Button
                onClick={() => {
                  onSave({ ...exercise, defaultPrescription: prescription, notes });
                }}
                variant="outline"
                className="rounded-full"
              >
                Save changes
              </Button>
              <Button
                onClick={() => {
                  if (!added) onAdd(exercise.id);
                  onClose();
                }}
                disabled={added}
                className="rounded-full"
              >
                {added ? "Already in today's session" : "Add to today's session"}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

import { useEffect } from "react";
function useMemoSync<T>(value: T | null, fn: (v: T) => void) {
  useEffect(() => {
    if (value) fn(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value && (value as { id?: string }).id]);
}

function AddCustomDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onCreate: (data: { name: string; category: Category; description: string; demo: string[]; defaultPrescription: string }) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("Mobility");
  const [description, setDescription] = useState("");
  const [demo, setDemo] = useState("");
  const [prescription, setPrescription] = useState("");

  const reset = () => {
    setName(""); setCategory("Mobility"); setDescription(""); setDemo(""); setPrescription("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) reset();
      }}
    >
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">New custom exercise</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="c-name">Name</Label>
            <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORY_ORDER.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-presc">Default reps / hold</Label>
            <Input id="c-presc" placeholder="e.g. 3 × 10 reps" value={prescription} onChange={(e) => setPrescription(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-desc">Description</Label>
            <Textarea id="c-desc" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-demo">Demo cues (one per line)</Label>
            <Textarea
              id="c-demo"
              rows={4}
              placeholder={"Set up…\nMove…\nReturn under control…"}
              value={demo}
              onChange={(e) => setDemo(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            disabled={!name.trim()}
            onClick={() => {
              const steps = demo.split("\n").map((s) => s.trim()).filter(Boolean);
              onCreate({
                name: name.trim(),
                category,
                description: description.trim() || "Custom exercise.",
                demo: steps.length ? steps : ["Perform with control."],
                defaultPrescription: prescription.trim() || "—",
              });
            }}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
