export default function Card({ title, subtitle, actions, children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-hairline bg-surface shadow-[0_1px_2px_rgba(11,18,32,0.04)] ${className}`}
    >
      {(title || actions) && (
        <header className="flex items-start justify-between gap-4 border-b border-hairline px-5 py-4">
          <div>
            {title ? (
              <h2 className="font-display text-base font-semibold text-ink">{title}</h2>
            ) : null}
            {subtitle ? (
              <p className="mt-0.5 text-xs text-ink-soft">{subtitle}</p>
            ) : null}
          </div>
          {actions}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}
