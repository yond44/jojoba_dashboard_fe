import { CalendarRange } from "lucide-react";
import Button from "./Button.jsx";
import { shiftDays, toIsoDate } from "../../lib/format.js";
import { useLanguage } from "../../i18n/LanguageProvider.jsx";

const PRESET_DAYS = [7, 30, 90, 365];

export default function DateRangeBar({ startDate, endDate, onChange }) {
  const { t } = useLanguage();
  const today = toIsoDate(new Date());

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2 rounded-lg border border-hairline bg-surface px-3 py-1.5">
        <CalendarRange size={15} className="text-ink-faint" aria-hidden="true" />
        <label className="sr-only" htmlFor="start-date">
          {t("range.start")}
        </label>
        <input
          id="start-date"
          type="date"
          value={startDate}
          max={endDate}
          onChange={(event) => onChange(event.target.value, endDate)}
          className="numeric bg-transparent text-xs text-ink outline-none"
        />
        <span className="text-ink-faint">–</span>
        <label className="sr-only" htmlFor="end-date">
          {t("range.end")}
        </label>
        <input
          id="end-date"
          type="date"
          value={endDate}
          min={startDate}
          onChange={(event) => onChange(startDate, event.target.value)}
          className="numeric bg-transparent text-xs text-ink outline-none"
        />
      </div>
      <div className="flex items-center gap-1">
        {PRESET_DAYS.map((days) => (
          <Button
            key={days}
            variant="ghost"
            size="sm"
            onClick={() => onChange(shiftDays(today, -days), today)}
          >
            {t(`range.preset.${days}`)}
          </Button>
        ))}
      </div>
    </div>
  );
}
