import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, LayoutDashboard } from "lucide-react";
import Button from "../ui/Button.jsx";
import { useLanguage } from "../../i18n/LanguageProvider.jsx";

export function buildViewPath(spec) {
  const query = new URLSearchParams(spec.query_params || {}).toString();
  return query ? `${spec.dashboard_path}?${query}` : spec.dashboard_path;
}

export default function NavigationCard({ navigation, autoNavigated = false }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const target = navigation?.target;
  const alternatives = navigation?.alternatives || [];

  return (
    <div className="mt-3 rounded-xl border border-primary/20 bg-primary-soft/60 p-3">
      {target ? (
        <>
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
            {autoNavigated ? (
              <Check size={13} aria-hidden="true" />
            ) : (
              <LayoutDashboard size={13} aria-hidden="true" />
            )}
            {autoNavigated
              ? t("chat.nav.opened", { label: target.label })
              : t("chat.nav.related")}
          </p>
          {!autoNavigated ? (
            <Button
              variant="primary"
              size="sm"
              icon={ArrowRight}
              className="mt-2"
              onClick={() => navigate(buildViewPath(target))}
            >
              {t("chat.nav.open", { label: target.label })}
            </Button>
          ) : null}
        </>
      ) : (
        <p className="text-xs text-ink-soft">{t("chat.nav.choose")}</p>
      )}

      {alternatives.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {alternatives.map((option) => (
            <Button
              key={option.view_id}
              variant="ghost"
              size="sm"
              onClick={() => navigate(option.dashboard_path)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
