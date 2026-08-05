import { useSearchParams } from "react-router-dom";
import { shiftDays, toIsoDate } from "../lib/format.js";

const DEFAULT_LOOKBACK_DAYS = 30;

export function useDateRange() {
  const [searchParams, setSearchParams] = useSearchParams();
  const today = toIsoDate(new Date());
  const startDate =
    searchParams.get("start_date") || shiftDays(today, -DEFAULT_LOOKBACK_DAYS);
  const endDate = searchParams.get("end_date") || today;

  function setRange(nextStart, nextEnd) {
    const next = new URLSearchParams(searchParams);
    next.set("start_date", nextStart);
    next.set("end_date", nextEnd);
    setSearchParams(next, { replace: true });
  }

  return { startDate, endDate, setRange };
}
