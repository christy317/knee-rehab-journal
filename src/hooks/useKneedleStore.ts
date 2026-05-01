import { useCallback, useEffect, useState } from "react";
import type { DraftSession, Exercise, SessionExercise, SessionLog } from "@/lib/types";
import { storage } from "@/lib/storage";
import { uid } from "@/lib/utils";

export function useKneedleStore() {
  const [exercises, setExercises] = useState<Exercise[]>(() => storage.loadExercises());
  const [draft, setDraft] = useState<DraftSession>(() => storage.loadDraft());
  const [logs, setLogs] = useState<SessionLog[]>(() => storage.loadLogs());

  useEffect(() => storage.saveExercises(exercises), [exercises]);
  useEffect(() => storage.saveDraft(draft), [draft]);
  useEffect(() => storage.saveLogs(logs), [logs]);

  const upsertExercise = useCallback((ex: Exercise) => {
    setExercises((prev) => {
      const idx = prev.findIndex((e) => e.id === ex.id);
      if (idx === -1) return [...prev, ex];
      const next = [...prev];
      next[idx] = ex;
      return next;
    });
  }, []);

  const addCustomExercise = useCallback(
    (data: Omit<Exercise, "id" | "custom">) => {
      const ex: Exercise = { ...data, id: uid(), custom: true };
      setExercises((p) => [...p, ex]);
      return ex;
    },
    []
  );

  const addToToday = useCallback((exerciseId: string) => {
    setDraft((d) => {
      if (d.exerciseIds.includes(exerciseId)) return d;
      return {
        ...d,
        exerciseIds: [...d.exerciseIds, exerciseId],
        entries: {
          ...d.entries,
          [exerciseId]: { exerciseId, completed: false, pain: null, note: "" },
        },
      };
    });
  }, []);

  const removeFromToday = useCallback((exerciseId: string) => {
    setDraft((d) => {
      const { [exerciseId]: _, ...rest } = d.entries;
      return {
        ...d,
        exerciseIds: d.exerciseIds.filter((id) => id !== exerciseId),
        entries: rest,
      };
    });
  }, []);

  const updateEntry = useCallback((exerciseId: string, patch: Partial<SessionExercise>) => {
    setDraft((d) => ({
      ...d,
      entries: {
        ...d.entries,
        [exerciseId]: { ...(d.entries[exerciseId] ?? { exerciseId, completed: false, pain: null }), ...patch },
      },
    }));
  }, []);

  const setDraftField = useCallback(<K extends keyof DraftSession>(key: K, value: DraftSession[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
  }, []);

  const saveSession = useCallback(() => {
    const log: SessionLog = {
      id: uid(),
      date: new Date().toISOString(),
      exercises: draft.exerciseIds.map((id) => draft.entries[id]).filter(Boolean),
      overallPain: draft.overallPain,
      mood: draft.mood,
      note: draft.note,
    };
    setLogs((prev) => [log, ...prev]);
    setDraft({ exerciseIds: [], entries: {}, overallPain: null, mood: null, note: "" });
    storage.clearDraft();
    return log;
  }, [draft]);

  return {
    exercises,
    draft,
    logs,
    upsertExercise,
    addCustomExercise,
    addToToday,
    removeFromToday,
    updateEntry,
    setDraftField,
    saveSession,
  };
}
