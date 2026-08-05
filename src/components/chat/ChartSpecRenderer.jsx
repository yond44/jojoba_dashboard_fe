import ChartCard from "../charts/ChartCard.jsx";
import ForecastChart from "../charts/ForecastChart.jsx";
import { formatCurrency } from "../../lib/format.js";

export default function ChartSpecRenderer({ spec }) {
  if (!spec || !spec.series || spec.series.length === 0) return null;

  const hasForecast = spec.series.some((series) => series.is_forecast);

  if (hasForecast) {
    const rowsByLabel = new Map();
    spec.series.forEach((series) => {
      const seriesKey = series.is_forecast ? "forecast" : "actual";
      series.points.forEach((point) => {
        const existing = rowsByLabel.get(point.x_value) || {
          period: point.x_value,
        };
        existing[seriesKey] = point.y_value;
        rowsByLabel.set(point.x_value, existing);
      });
    });

    const rows = [...rowsByLabel.values()].sort((left, right) =>
      String(left.period).localeCompare(String(right.period))
    );
    const firstForecastRow = rows.find((row) => row.forecast !== undefined);

    return (
      <div className="mt-3">
        <ForecastChart
          series={rows}
          businessToday={firstForecastRow?.period}
          note={spec.note}
          height={260}
        />
      </div>
    );
  }

  const primarySeries = spec.series[0];
  const rows = primarySeries.points.map((point) => ({
    label: point.x_value,
    [primarySeries.name]: point.y_value,
  }));

  return (
    <div className="mt-3">
      <ChartCard
        title={spec.title}
        subtitle={spec.note}
        data={rows}
        chartType={spec.chart_type === "table" ? "bar" : spec.chart_type}
        xField="label"
        valueField={primarySeries.name}
        valueLabel={primarySeries.name}
        valueFormatter={formatCurrency}
        height={240}
      />
    </div>
  );
}
