import { Link } from "react-router-dom";
import Card from "../components/ui/Card.jsx";
import StatCard from "../components/ui/StatCard.jsx";
import { SkeletonBlock } from "../components/ui/Skeleton.jsx";
import { ErrorState } from "../components/ui/States.jsx";
import ChartCard from "../components/charts/ChartCard.jsx";
import { useApiQuery } from "../hooks/useApiQuery.js";
import { formatCurrency } from "../lib/format.js";
import { normalizeRows } from "../lib/rows.js";
import { VIEWS_BY_ID } from "../config/views.js";
import { shiftDays, toIsoDate } from "../lib/format.js";
import { useLanguage } from "../i18n/LanguageProvider.jsx";

const SHORTCUTS = ["revenue_destination", "campaigns", "churn", "reviews"];

export default function Overview() {
  const { t } = useLanguage();
  const today = toIsoDate(new Date());
  const current = useApiQuery("/current");
  const trend = useApiQuery("/period", {
    start_date: shiftDays(today, -365),
    end_date: today,
    granularity: "monthly",
  });

  const summary = current.data || {};
  const trendRows = normalizeRows(trend.data);

  return (
    <div className="space-y-5">
      {current.isLoading ? (
        <Card>
          <SkeletonBlock rows={3} />
        </Card>
      ) : current.error ? (
        <ErrorState message={current.error.message} onRetry={current.refetch} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label={t("overview.today")} value={formatCurrency(summary.today)} />
          <StatCard
            label={t("overview.lastSevenDays")}
            value={formatCurrency(summary.last_seven_day ?? summary.last_seven_days)}
          />
          <StatCard label={t("overview.currentMonth")} value={formatCurrency(summary.current_month)} />
          <StatCard label={t("overview.thisYear")} value={formatCurrency(summary.this_year)} />
        </div>
      )}

      {trend.isLoading ? (
        <Card>
          <SkeletonBlock rows={6} />
        </Card>
      ) : trend.error ? (
        <ErrorState message={trend.error.message} onRetry={trend.refetch} />
      ) : (
        <ChartCard
          title={t("overview.trendTitle")}
          subtitle={t("overview.trendSubtitle")}
          data={trendRows}
          chartType="area"
          xField="period"
          valueField="revenue"
          valueLabel={t("nav.group.revenue")}
          valueFormatter={formatCurrency}
          height={280}
        />
      )}

      <Card title={t("overview.shortcutsTitle")}
            subtitle={t("overview.shortcutsSubtitle")}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SHORTCUTS.map((viewId) => {
            const view = VIEWS_BY_ID[viewId];
            if (!view) return null;
            return (
              <Link
                key={viewId}
                to={view.path}
                className="rounded-xl border border-hairline px-4 py-3 text-sm text-ink-soft transition-colors hover:border-primary hover:text-primary"
              >
                <span className="block text-[10px] uppercase tracking-widest text-ink-faint">
                  {t(`nav.group.${view.group}`)}
                </span>
                {t(`view.${view.viewId}`)}
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
