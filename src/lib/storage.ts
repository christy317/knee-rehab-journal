import type { DraftSession, Exercise, SessionLog } from "./types";
import { SEED_EXERCISES } from "./seed";

const KEYS = {
  exercises: "kneedle.exercises.v1",
  draft: "kneedle.draft.v1",
  logs: "kneedle.logs.v1",
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  loadExercises(): Exercise[] {
    const existing = read<Exercise[] | null>(KEYS.exercises, null);
    if (!existing || existing.length === 0) {
      write(KEYS.exercises, SEED_EXERCISES);
      return SEED_EXERCISES;
    }
    return existing;
  },
  saveExercises(list: Exercise[]) {
    write(KEYS.exercises, list);
  },
  loadDraft(): DraftSession {
    return read<DraftSession>(KEYS.draft, {
      exerciseIds: [],
      entries: {},
      overallPain: null,
      mood: null,
      note: "",
    });
  },
  saveDraft(d: DraftSession) {
    write(KEYS.draft, d);
  },
  clearDraft() {
    localStorage.removeItem(KEYS.draft);
  },
  loadLogs(): SessionLog[] {
    return read<SessionLog[]>(KEYS.logs, []);
  },
  saveLogs(logs: SessionLog[]) {
    write(KEYS.logs, logs);
  },
};
