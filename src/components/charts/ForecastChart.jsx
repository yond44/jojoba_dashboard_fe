import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card from "../ui/Card.jsx";
import ChartTooltip from "./ChartTooltip.jsx";
import { CHART_COLORS } from "./palette.js";
import { formatCurrency } from "../../lib/format.js";
import { useLanguage } from "../../i18n/LanguageProvider.jsx";

export default function ForecastChart({ series, businessToday, note, height = 340 }) {
  const { t } = useLanguage();

  return (
    <Card
      title={t("forecast.chartTitle")}
      subtitle={note}
      actions={
        <div className="flex items-center gap-3 text-[11px] text-ink-soft">
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-5 bg-primary" aria-hidden="true" />
            {t("forecast.legendActual")}
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="h-0.5 w-5"
              style={{
                backgroundImage: `repeating-linear-gradient(90deg, ${CHART_COLORS.projection} 0 4px, transparent 4px 7px)`,
              }}
              aria-hidden="true"
            />
            {t("forecast.legendForecast")}
          </span>
        </div>
      }
    >
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={series} margin={{ top: 12, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="period" tick={{ fontSize: 11, fill: "#94a3b8" }} />
          <YAxis
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            tickFormatter={formatCurrency}
            width={86}
          />
          <Tooltip content={<ChartTooltip valueFormatter={formatCurrency} />} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {businessToday ? (
            <ReferenceLine
              x={businessToday}
              stroke={CHART_COLORS.projection}
              strokeDasharray="4 4"
              label={{
                value: t("chart.today"),
                position: "insideTopRight",
                fontSize: 10,
                fill: CHART_COLORS.projection,
              }}
            />
          ) : null}
          <Line
            type="monotone"
            dataKey="actual"
            name={t("forecast.legendActual")}
            stroke={CHART_COLORS.actual}
            strokeWidth={2.2}
            dot={false}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="forecast"
            name={t("forecast.legendForecast")}
            stroke={CHART_COLORS.projection}
            strokeWidth={2.2}
            strokeDasharray="5 4"
            dot={false}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
