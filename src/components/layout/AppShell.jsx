import { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import ChatDock from "../chat/ChatDock.jsx";
import { useLanguage } from "../../i18n/LanguageProvider.jsx";

export default function AppShell({ title, businessToday, children }) {
  const { t } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar isOpen={isSidebarOpen} onNavigate={() => setIsSidebarOpen(false)} />

      {isSidebarOpen ? (
        <button
          type="button"
          aria-label={t("nav.close")}
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-20 bg-ink/20 lg:hidden"
        />
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          title={title}
          businessToday={businessToday}
          onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
          onToggleChat={() => setIsChatOpen((open) => !open)}
          isChatOpen={isChatOpen}
        />
        <div className="flex min-h-0 flex-1">
          <main className="min-w-0 flex-1 px-5 py-6">{children}</main>
          {isChatOpen ? <ChatDock onClose={() => setIsChatOpen(false)} /> : null}
        </div>
      </div>
    </div>
  );
}
