import { NavLink } from "react-router-dom";
import { Compass } from "lucide-react";
import { VIEW_GROUPS } from "../../config/views.js";
import { useLanguage } from "../../i18n/LanguageProvider.jsx";

export default function Sidebar({ isOpen, onNavigate }) {
  const { t } = useLanguage();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-64 shrink-0 border-r border-hairline bg-surface transition-transform lg:static lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-16 items-center gap-2 border-b border-hairline px-5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-white">
          <Compass size={17} aria-hidden="true" />
        </span>
        <div>
          <p className="font-display text-sm font-bold leading-none text-ink">
            {t("app.name")}
          </p>
          <p className="text-[10px] uppercase tracking-widest text-ink-faint">
            {t("app.tagline")}
          </p>
        </div>
      </div>

      <nav
        className="h-[calc(100%-4rem)] overflow-y-auto px-3 py-4"
        aria-label={t("nav.aria")}
      >
        {VIEW_GROUPS.map((group) => (
          <div key={group.name} className="mb-5">
            <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-widest text-ink-faint">
              {t(`nav.group.${group.name}`)}
            </p>
            <ul className="space-y-0.5">
              {group.views.map((view) => (
                <li key={view.viewId}>
                  <NavLink
                    to={view.path}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2 text-sm transition-colors ${
                        isActive
                          ? "bg-primary-soft font-semibold text-primary"
                          : "text-ink-soft hover:bg-canvas hover:text-ink"
                      }`
                    }
                  >
                    {t(`view.${view.viewId}`)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
