const COMPACT_UNITS = {
  id: [
    { limit: 1e12, suffix: " T", divisor: 1e12 },
    { limit: 1e9, suffix: " M", divisor: 1e9 },
    { limit: 1e6, suffix: " jt", divisor: 1e6 },
    { limit: 1e3, suffix: " rb", divisor: 1e3 },
  ],
  en: [
    { limit: 1e12, suffix: " T", divisor: 1e12 },
    { limit: 1e9, suffix: " B", divisor: 1e9 },
    { limit: 1e6, suffix: " M", divisor: 1e6 },
    { limit: 1e3, suffix: " K", divisor: 1e3 },
  ],
};

const INTL_LOCALE = { id: "id-ID", en: "en-US" };

let activeLanguage = "id";

export function setFormatterLanguage(language) {
  activeLanguage = COMPACT_UNITS[language] ? language : "id";
}

export function formatCurrency(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  const numeric = Number(value);
  const unit = COMPACT_UNITS[activeLanguage].find(
    (item) => Math.abs(numeric) >= item.limit
  );
  if (!unit) return `Rp ${numeric.toFixed(0)}`;
  return `Rp ${(numeric / unit.divisor).toFixed(numeric / unit.divisor >= 100 ? 0 : 2)}${unit.suffix}`;
}

export function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat(INTL_LOCALE[activeLanguage]).format(Number(value));
}

export function formatPercent(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return `${Number(value).toFixed(digits)}%`;
}

export function formatDate(value) {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleDateString(INTL_LOCALE[activeLanguage], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function toIsoDate(dateObject) {
  return dateObject.toISOString().slice(0, 10);
}

export function shiftDays(isoDate, days) {
  const parsed = new Date(isoDate);
  parsed.setDate(parsed.getDate() + days);
  return toIsoDate(parsed);
}

export function humanizeKey(key) {
  return String(key)
    .replace(/_idr$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
