export default function ChartTooltip({ active, payload, label, valueFormatter }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg border border-hairline bg-surface px-3 py-2 shadow-lg">
      <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
        {label}
      </p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="mt-1 flex items-center gap-2 text-xs">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
            aria-hidden="true"
          />
          <span className="text-ink-soft">{entry.name}</span>
          <span className="numeric font-semibold text-ink">
            {valueFormatter ? valueFormatter(entry.value) : entry.value}
          </span>
        </p>
      ))}
    </div>
  );
}
