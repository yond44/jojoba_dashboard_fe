import { humanizeKey } from "../../lib/format.js";
import { EmptyState } from "./States.jsx";
import { useLanguage } from "../../i18n/LanguageProvider.jsx";

export default function DataTable({ rows, columns, formatters = {}, maxRows = 50 }) {
  const { t } = useLanguage();

  if (!rows || rows.length === 0) {
    return <EmptyState title={t("state.tableEmpty")} />;
  }

  const resolvedColumns = columns || Object.keys(rows[0]);
  const visibleRows = rows.slice(0, maxRows);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-hairline">
            {resolvedColumns.map((column) => (
              <th
                key={column}
                scope="col"
                className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-faint"
              >
                {humanizeKey(column)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-hairline/60 last:border-0 hover:bg-canvas/70"
            >
              {resolvedColumns.map((column) => {
                const formatter = formatters[column];
                const raw = row[column];
                const isNumeric = typeof raw === "number";
                return (
                  <td
                    key={column}
                    className={`px-3 py-2 text-ink ${isNumeric ? "numeric text-right" : ""}`}
                  >
                    {formatter ? formatter(raw) : String(raw ?? "—")}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > maxRows ? (
        <p className="mt-3 text-xs text-ink-faint">
          {t("table.showing", { shown: maxRows, total: rows.length })}
        </p>
      ) : null}
    </div>
  );
}
