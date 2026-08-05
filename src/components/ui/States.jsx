import { AlertTriangle, Inbox, RefreshCw } from "lucide-react";
import Button from "./Button.jsx";
import { useLanguage } from "../../i18n/LanguageProvider.jsx";

export function ErrorState({ message, onRetry }) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-start gap-3 rounded-xl border border-danger/20 bg-red-50/60 p-5">
      <div className="flex items-center gap-2 text-danger">
        <AlertTriangle size={18} aria-hidden="true" />
        <p className="font-display text-sm font-semibold">
          {t("state.errorTitle")}
        </p>
      </div>
      <p className="text-sm text-ink-soft">{message}</p>
      {onRetry ? (
        <Button variant="outline" size="sm" icon={RefreshCw} onClick={onRetry}>
          {t("state.retry")}
        </Button>
      ) : null}
    </div>
  );
}

export function EmptyState({ title, hint }) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-hairline py-10 text-center">
      <Inbox size={20} className="text-ink-faint" aria-hidden="true" />
      <p className="font-display text-sm font-semibold text-ink">
        {title || t("state.emptyTitle")}
      </p>
      {hint ? <p className="max-w-sm text-xs text-ink-soft">{hint}</p> : null}
    </div>
  );
}
