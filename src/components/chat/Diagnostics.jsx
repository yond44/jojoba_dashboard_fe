import Badge from "../ui/Badge.jsx";
import { useLanguage } from "../../i18n/LanguageProvider.jsx";

export default function Diagnostics({ result }) {
  const { t } = useLanguage();
  const sources = result.sources || [];

  return (
    <div className="mt-3 space-y-2 border-t border-hairline pt-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge tone="primary">{result.intent || "-"}</Badge>
        <Badge tone="neutral" className="numeric">
          {Number(result.elapsed_seconds || 0).toFixed(2)}s
        </Badge>
        <Badge tone="neutral">v{result.prompt_version}</Badge>
        {result.contains_forecast ? <Badge tone="projection">{t("chat.badge.forecast")}</Badge> : null}
        {result.degraded ? <Badge tone="caution">{t("chat.badge.degraded")}</Badge> : null}
      </div>

      {(result.tools_used || []).length > 0 ? (
        <p className="text-[11px] text-ink-faint">
          {t("chat.tools", { tools: (result.tools_used || []).join(", ") })}
        </p>
      ) : null}

      {sources.length > 0 ? (
        <details className="text-[11px]">
          <summary className="cursor-pointer text-ink-soft">
            {t("chat.sources", { count: sources.length })}
          </summary>
          <ul className="mt-2 space-y-1.5">
            {sources.map((source, index) => (
              <li key={`${source.id}-${index}`} className="rounded-md bg-canvas p-2">
                <span className="font-semibold text-ink">[{source.source_type}]</span>{" "}
                <span className="numeric text-ink-soft">{source.id}</span>{" "}
                <span className="numeric text-ink-faint">
                  {Number(source.score || 0).toFixed(3)}
                </span>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}
