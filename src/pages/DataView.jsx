import ChartCard from "../components/charts/ChartCard.jsx";
import Card from "../components/ui/Card.jsx";
import DataTable from "../components/ui/DataTable.jsx";
import DateRangeBar from "../components/ui/DateRangeBar.jsx";
import { SkeletonBlock } from "../components/ui/Skeleton.jsx";
import { ErrorState } from "../components/ui/States.jsx";
import { useApiQuery } from "../hooks/useApiQuery.js";
import { useDateRange } from "../hooks/useDateRange.js";
import { formatCurrency, formatNumber } from "../lib/format.js";
import { detectFields, isCurrencyField, normalizeRows } from "../lib/rows.js";
import { useLanguage } from "../i18n/LanguageProvider.jsx";

export default function DataView({ view }) {
  const { t } = useLanguage();
  const { startDate, endDate, setRange } = useDateRange();

  const params = {
    ...(view.acceptsDateRange
      ? { start_date: startDate, end_date: endDate }
      : {}),
    ...(view.extraParams || {}),
  };

  const { data, error, isLoading, refetch } = useApiQuery(view.apiPath, params);

  const rows = normalizeRows(data);
  const { xField, valueField } = detectFields(rows, view.xField, view.valueField);
  const valueFormatter = isCurrencyField(valueField)
    ? formatCurrency
    : formatNumber;

  return (
    <div className="space-y-5">
      {view.acceptsDateRange ? (
        <DateRangeBar
          startDate={startDate}
          endDate={endDate}
          onChange={setRange}
        />
      ) : null}

      {isLoading ? (
        <Card>
          <SkeletonBlock rows={6} />
        </Card>
      ) : error ? (
        <ErrorState message={error.message} onRetry={refetch} />
      ) : (
        <>
          {view.kind === "scalar" ? (
            <Card title={t(`view.${view.viewId}`)}>
              <DataTable rows={rows} />
            </Card>
          ) : (
            <ChartCard
              title={t(`view.${view.viewId}`)}
              subtitle={
                view.acceptsDateRange ? `${startDate} — ${endDate}` : undefined
              }
              data={rows}
              chartType={view.chartType}
              xField={xField}
              valueField={valueField}
              valueLabel={t(`view.${view.viewId}`)}
              valueFormatter={valueFormatter}
            />
          )}

          <Card title={t("table.rawTitle")}
                subtitle={t("table.rowCount", { count: rows.length })}>
            <DataTable rows={rows} />
          </Card>
        </>
      )}
    </div>
  );
}
