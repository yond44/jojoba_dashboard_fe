const TONE_CLASSES = {
  neutral: "bg-canvas text-ink-soft border-hairline",
  primary: "bg-primary-soft text-primary border-primary/20",
  projection: "bg-projection-soft text-projection border-projection/20",
  positive: "bg-emerald-50 text-positive border-positive/20",
  caution: "bg-amber-50 text-caution border-caution/20",
  danger: "bg-red-50 text-danger border-danger/20",
};

export default function Badge({ children, tone = "neutral", className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${TONE_CLASSES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
