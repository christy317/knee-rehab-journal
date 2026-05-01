import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Category } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export const CATEGORY_ORDER: Category[] = ["Mobility", "Activation", "Strength", "Stability"];

export function categoryClasses(c: Category) {
  switch (c) {
    case "Mobility":
      return "bg-category-mobility/10 text-category-mobility border-category-mobility/20";
    case "Activation":
      return "bg-category-activation/10 text-category-activation border-category-activation/20";
    case "Strength":
      return "bg-category-strength/10 text-category-strength border-category-strength/20";
    case "Stability":
      return "bg-category-stability/10 text-category-stability border-category-stability/20";
  }
}

export function painColor(level: number) {
  // Returns a tailwind bg class for level 1-5
  return ["bg-pain-1", "bg-pain-2", "bg-pain-3", "bg-pain-4", "bg-pain-5"][level - 1];
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export function isoDay(iso: string) {
  return new Date(iso).toISOString().slice(0, 10);
}

export function computeStreak(logs: { date: string }[]): number {
  if (logs.length === 0) return 0;
  const days = new Set(logs.map((l) => isoDay(l.date)));
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 400; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (days.has(key)) streak++;
    else if (i === 0) continue; // allow today missing
    else break;
  }
  return streak;
}

export function avgPainLast14(logs: { date: string; overallPain: number | null }[]): number | null {
  const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
  const recent = logs.filter((l) => new Date(l.date).getTime() >= cutoff && l.overallPain != null);
  if (recent.length === 0) return null;
  const sum = recent.reduce((acc, l) => acc + (l.overallPain ?? 0), 0);
  return Math.round((sum / recent.length) * 10) / 10;
}
