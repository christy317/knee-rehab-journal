import { cn, painColor } from "@/lib/utils";

type Props = {
  value: number | null;
  onChange: (v: number) => void;
  size?: "sm" | "md";
};

const LABELS = ["None", "Mild", "Moderate", "Strong", "Severe"];

export function PainScale({ value, onChange, size = "md" }: Props) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = value === n;
        return (
          <button
            key={n}
            type="button"
            aria-label={`Pain ${n} — ${LABELS[n - 1]}`}
            onClick={() => onChange(n)}
            data-active={active}
            className={cn(
              "pain-chip",
              painColor(n),
              "text-white border-transparent",
              !active && "opacity-55 hover:opacity-90",
              size === "sm" && "h-7 w-7 text-xs"
            )}
            style={{ ["--tw-ring-color" as never]: `hsl(var(--pain-${n}))` }}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}
