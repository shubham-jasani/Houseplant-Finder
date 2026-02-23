import type { ReactNode } from "react";

export type Tone =
  // semantic tones used across the app
  | "leaf" |"water" |"care" |"warning" |"neutral"
  // also allow raw color tones (in case you use them elsewhere)
  | "emerald" |"sky" |"amber" |"rose" |"gray";

const toneStyles: Record<Tone, string> = {
  // semantic tones
  leaf: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  water: "bg-sky-50 text-sky-800 ring-sky-200",
  care: "bg-slate-100 text-slate-800 ring-slate-200",
  warning: "bg-amber-50 text-amber-900 ring-amber-200",
  neutral: "bg-stone-100 text-stone-800 ring-stone-200",

  // raw tones (aliases)
  emerald: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  sky: "bg-sky-50 text-sky-800 ring-sky-200",
  amber: "bg-amber-50 text-amber-900 ring-amber-200",
  rose: "bg-rose-50 text-rose-800 ring-rose-200",
  gray: "bg-slate-100 text-slate-800 ring-slate-200",
};

export default function Chip({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ring-1",
        toneStyles[tone],
      ].join(" ")}
    >
      {children}
    </span>
  );
}
