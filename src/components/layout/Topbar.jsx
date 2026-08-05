import { Menu, MessageSquare } from "lucide-react";
import Badge from "../ui/Badge.jsx";
import Button from "../ui/Button.jsx";
import LanguageSwitcher from "./LanguageSwitcher.jsx";
import { useLanguage } from "../../i18n/LanguageProvider.jsx";

export default function Topbar({
  title,
  businessToday,
  onToggleSidebar,
  onToggleChat,
  isChatOpen,
}) {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-hairline bg-surface/90 px-5 backdrop-blur">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          icon={Menu}
          onClick={onToggleSidebar}
          className="lg:hidden"
          aria-label={t("nav.open")}
        />
        <h1 className="font-display text-lg font-semibold text-ink">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {businessToday ? (
          <Badge tone="neutral" className="numeric hidden sm:inline-flex">
            {t("topbar.dataAsOf", { date: businessToday })}
          </Badge>
        ) : null}
        <LanguageSwitcher />
        <Button
          variant={isChatOpen ? "primary" : "secondary"}
          size="sm"
          icon={MessageSquare}
          onClick={onToggleChat}
        >
          {t("topbar.advisor")}
        </Button>
      </div>
    </header>
  );
}
