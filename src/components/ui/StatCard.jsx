import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Badge from "./Badge.jsx";

export default function StatCard({ label, value, unit, delta, tone = "neutral", note }) {
  const hasDelta = delta !== null && delta !== undefined;
  const isPositive = hasDelta && Number(delta) >= 0;
  const DeltaIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="rounded-2xl border border-hairline bg-surface p-5">
      <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
        {label}
      </p>
      <div className="mt-2 flex items-end gap-2">
        <p className="numeric text-2xl font-semibold text-ink">{value}</p>
        {unit ? <span className="pb-1 text-xs text-ink-soft">{unit}</span> : null}
      </div>
      <div className="mt-3 flex items-center gap-2">
        {hasDelta ? (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-medium ${
              isPositive ? "text-positive" : "text-danger"
            }`}
          >
            <DeltaIcon size={13} aria-hidden="true" />
            <span className="numeric">{Math.abs(Number(delta)).toFixed(1)}%</span>
          </span>
        ) : null}
        {tone === "projection" ? <Badge tone="projection">proyeksi</Badge> : null}
        {note ? <span className="text-xs text-ink-soft">{note}</span> : null}
      </div>
    </div>
  );
}
