import { useLanguage } from "../../i18n/LanguageProvider.jsx";

export default function LanguageSwitcher() {
  const { language, setLanguage, languages, t } = useLanguage();

  return (
    <div
      className="flex rounded-lg border border-hairline p-0.5"
      role="group"
      aria-label={t("topbar.language")}
    >
      {languages.map((item) => (
        <button
          key={item.code}
          type="button"
          title={item.name}
          onClick={() => setLanguage(item.code)}
          aria-pressed={language === item.code}
          className={`rounded-md px-2 py-1 text-[11px] font-semibold transition-colors ${
            language === item.code
              ? "bg-primary text-white"
              : "text-ink-faint hover:text-ink"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
