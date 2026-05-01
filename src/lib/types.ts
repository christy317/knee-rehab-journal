export type Category = "Mobility" | "Activation" | "Strength" | "Stability";

export type Exercise = {
  id: string;
  name: string;
  category: Category;
  description: string;
  demo: string[];
  defaultPrescription: string; // e.g. "2 × 10 reps" or "3 × 30s hold"
  notes?: string;
  custom?: boolean;
};

export type SessionExercise = {
  exerciseId: string;
  completed: boolean;
  pain: number | null; // 1-5
  note?: string;
};

export type Mood = "Low" | "Medium" | "High";

export type SessionLog = {
  id: string;
  date: string; // ISO
  exercises: SessionExercise[];
  overallPain: number | null; // 1-5
  mood: Mood | null;
  note?: string;
};

export type DraftSession = {
  exerciseIds: string[]; // added to today's session
  entries: Record<string, SessionExercise>;
  overallPain: number | null;
  mood: Mood | null;
  note: string;
};
