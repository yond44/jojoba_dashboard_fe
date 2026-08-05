import { useLanguage } from "../../i18n/LanguageProvider.jsx";

export default function Skeleton({ className = "h-4 w-full" }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-hairline/70 ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonBlock({ rows = 4 }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-3" role="status" aria-label={t("state.loading")}>
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className={`h-4 ${index === 0 ? "w-1/3" : "w-full"}`} />
      ))}
    </div>
  );
}
