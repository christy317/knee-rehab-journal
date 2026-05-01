import { cn, categoryClasses } from "@/lib/utils";
import type { Category } from "@/lib/types";

export function CategoryTag({ category, className }: { category: Category; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        categoryClasses(category),
        className
      )}
    >
      {category}
    </span>
  );
}
