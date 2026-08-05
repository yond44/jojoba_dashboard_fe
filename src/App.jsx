import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AppShell from "./components/layout/AppShell.jsx";
import Churn from "./pages/Churn.jsx";
import DataView from "./pages/DataView.jsx";
import Forecast from "./pages/Forecast.jsx";
import Overview from "./pages/Overview.jsx";
import { DASHBOARD_ROOT, VIEWS } from "./config/views.js";
import { useLanguage } from "./i18n/LanguageProvider.jsx";

const PAGE_BY_KIND = {
  overview: Overview,
  forecast: Forecast,
  churn: Churn,
};

function renderView(view) {
  const SpecialPage = PAGE_BY_KIND[view.kind];
  return SpecialPage ? <SpecialPage /> : <DataView view={view} />;
}

export default function App() {
  const { t } = useLanguage();
  const location = useLocation();
  const activeView =
    VIEWS.find((view) => view.path === location.pathname) || VIEWS[0];

  return (
    <AppShell title={t(`view.${activeView.viewId}`)}>
      <Routes>
        <Route path="/" element={<Navigate to={`${DASHBOARD_ROOT}/overview`} replace />} />
        {VIEWS.map((view) => (
          <Route key={view.viewId} path={view.path} element={renderView(view)} />
        ))}
        <Route
          path="*"
          element={<Navigate to={`${DASHBOARD_ROOT}/overview`} replace />}
        />
      </Routes>
    </AppShell>
  );
}
