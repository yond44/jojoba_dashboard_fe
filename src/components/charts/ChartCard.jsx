import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card from "../ui/Card.jsx";
import ChartTooltip from "./ChartTooltip.jsx";
import { CATEGORY_COLORS, CHART_COLORS } from "./palette.js";
import { EmptyState } from "../ui/States.jsx";
import { useLanguage } from "../../i18n/LanguageProvider.jsx";

const AXIS_STYLE = { fontSize: 11, fill: "#94a3b8" };

export default function ChartCard({
  title,
  subtitle,
  actions,
  data,
  chartType = "bar",
  xField,
  valueField,
  valueLabel = "Nilai",
  valueFormatter,
  todayMarker,
  height = 300,
}) {
  const { t } = useLanguage();

  if (!data || data.length === 0) {
    return (
      <Card title={title} subtitle={subtitle} actions={actions}>
        <EmptyState hint={t("state.emptyHint")} />
      </Card>
    );
  }

  const commonAxes = (
    <>
      <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey={xField} tick={AXIS_STYLE} stroke={CHART_COLORS.grid} />
      <YAxis
        tick={AXIS_STYLE}
        stroke={CHART_COLORS.grid}
        tickFormatter={(value) =>
          valueFormatter ? valueFormatter(value) : value
        }
        width={78}
      />
      <Tooltip content={<ChartTooltip valueFormatter={valueFormatter} />} />
      {todayMarker ? (
        <ReferenceLine
          x={todayMarker}
          stroke={CHART_COLORS.projection}
          strokeDasharray="4 4"
          label={{
            value: t("chart.today"),
            position: "top",
            fontSize: 10,
            fill: CHART_COLORS.projection,
          }}
        />
      ) : null}
    </>
  );

  return (
    <Card title={title} subtitle={subtitle} actions={actions}>
      <ResponsiveContainer width="100%" height={height}>
        {chartType === "pie" ? (
          <PieChart>
            <Tooltip content={<ChartTooltip valueFormatter={valueFormatter} />} />
            <Pie
              data={data}
              dataKey={valueField}
              nameKey={xField}
              innerRadius="52%"
              outerRadius="80%"
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry[xField] ?? index}
                  fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        ) : chartType === "area" ? (
          <AreaChart data={data} margin={{ top: 12, right: 12, bottom: 0, left: 0 }}>
            {commonAxes}
            <Area
              type="monotone"
              dataKey={valueField}
              name={valueLabel}
              stroke={CHART_COLORS.actual}
              strokeWidth={2}
              fill={CHART_COLORS.actual}
              fillOpacity={0.1}
            />
          </AreaChart>
        ) : chartType === "line" ? (
          <LineChart data={data} margin={{ top: 12, right: 12, bottom: 0, left: 0 }}>
            {commonAxes}
            <Line
              type="monotone"
              dataKey={valueField}
              name={valueLabel}
              stroke={CHART_COLORS.actual}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        ) : (
          <BarChart data={data} margin={{ top: 12, right: 12, bottom: 0, left: 0 }}>
            {commonAxes}
            <Bar dataKey={valueField} name={valueLabel} radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={entry[xField] ?? index}
                  fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </Card>
  );
}
