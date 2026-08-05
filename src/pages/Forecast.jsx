import Badge from "../components/ui/Badge.jsx";
import Card from "../components/ui/Card.jsx";
import DataTable from "../components/ui/DataTable.jsx";
import DateRangeBar from "../components/ui/DateRangeBar.jsx";
import StatCard from "../components/ui/StatCard.jsx";
import ForecastChart from "../components/charts/ForecastChart.jsx";
import { SkeletonBlock } from "../components/ui/Skeleton.jsx";
import { EmptyState, ErrorState } from "../components/ui/States.jsx";
import { useApiQuery } from "../hooks/useApiQuery.js";
import { useDateRange } from "../hooks/useDateRange.js";
import { formatCurrency, formatPercent } from "../lib/format.js";
import { useLanguage } from "../i18n/LanguageProvider.jsx";

function buildSeries(segments) {
  const rows = [];
  segments.forEach((segment) => {
    const breakdown = segment.periods || [];
    if (breakdown.length > 0) {
      breakdown.forEach((item) => {
        rows.push({
          period: item.period_start || item.period,
          [segment.kind === "forecast" ? "forecast" : "actual"]:
            item.forecast_idr ?? item.revenue_idr ?? item.total_idr,
        });
      });
    } else {
      rows.push({
        period: `${segment.start} → ${segment.end}`,
        [segment.kind === "forecast" ? "forecast" : "actual"]: segment.total_idr,
      });
    }
  });
  return rows;
}

export default function Forecast() {
  const { t } = useLanguage();
  const { startDate, endDate, setRange } = useDateRange();
  const { data, error, isLoading, refetch } = useApiQuery("/revenue", {
    start: startDate,
    end: endDate,
  });

  const segments = data?.segments || [];
  const forecastSegment = segments.find((segment) => segment.kind === "forecast");
  const actualSegment = segments.find((segment) => segment.kind === "actual");
  const series = buildSeries(segments);
  const businessToday = forecastSegment?.start;

  return (
    <div className="space-y-5">
      <DateRangeBar startDate={startDate} endDate={endDate} onChange={setRange} />

      {isLoading ? (
        <Card>
          <SkeletonBlock rows={6} />
        </Card>
      ) : error ? (
        <ErrorState message={error.message} onRetry={refetch} />
      ) : segments.length === 0 ? (
        <EmptyState
          title={t("forecast.emptyTitle")}
          hint={t("forecast.emptyHint")}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {actualSegment ? (
              <StatCard
                label={t("forecast.actualInRange")}
                value={formatCurrency(actualSegment.total_idr)}
                delta={actualSegment.vs_previous_period_pct}
                note={t("forecast.days", { count: actualSegment.days })}
              />
            ) : null}
            {forecastSegment ? (
              <>
                <StatCard
                  label={t("forecast.projectedInRange")}
                  value={formatCurrency(forecastSegment.total_idr)}
                  tone="projection"
                  note={t("forecast.days", { count: forecastSegment.days })}
                />
                <StatCard
                  label={t("forecast.meanError")}
                  value={formatPercent(forecastSegment.model_mape_pct)}
                  note={forecastSegment.granularity_used}
                />
              </>
            ) : null}
          </div>

          <ForecastChart
            series={series}
            businessToday={businessToday}
            note={
              forecastSegment?.warning ||
              t("forecast.defaultNote")
            }
          />

          {forecastSegment?.periods?.length ? (
            <Card
              title={t("forecast.breakdownTitle")}
              subtitle={t("forecast.breakdownSubtitle")}
              actions={<Badge tone="projection">{t("forecast.badge")}</Badge>}
            >
              <DataTable
                rows={forecastSegment.periods}
                formatters={{ forecast_idr: formatCurrency }}
              />
            </Card>
          ) : null}
        </>
      )}
    </div>
  );
}
