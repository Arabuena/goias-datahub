import { useCallback, useState } from 'react';
import { APPLICATIONS } from './config/applications.js';
import { useArahHealth } from './hooks/useArahHealth.js';
import { useEmbedStatus } from './hooks/useEmbedStatus.js';
import AppSidebar from './components/AppSidebar.jsx';
import AppHeader from './components/AppHeader.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  const apps = APPLICATIONS.filter((app) => app.enabled);
  const [activeId, setActiveId] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  const { health, checking, check } = useArahHealth();
  const { embedStates, embedChecking, checkEmbed } = useEmbedStatus();

  const activeApp = apps.find((app) => app.id === activeId) ?? null;

  const openApp = useCallback((id) => {
    setActiveId(id);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const selectOverview = useCallback((id) => {
    setActiveId(id);
    setMobileMenu(false);
  }, []);

  const backToPanel = useCallback(() => {
    setActiveId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="shell">
      <AppSidebar
        apps={apps}
        activeId={activeId}
        onSelect={selectOverview}
        onOpenApp={openApp}
        mobileOpen={mobileMenu}
        onClose={() => setMobileMenu(false)}
        health={health}
      />
      {mobileMenu && (
        <button className="scrim" onClick={() => setMobileMenu(false)} aria-label="Fechar menu" />
      )}
      <main className="main">
        <AppHeader
          activeName={activeApp?.name}
          health={health}
          onOpenMenu={() => setMobileMenu(true)}
        />
        <Dashboard
          apps={apps}
          activeApp={activeApp}
          embedStates={embedStates}
          embedChecking={embedChecking}
          checkEmbed={checkEmbed}
          health={health}
          checking={checking}
          checkHealth={check}
          onOpenApp={openApp}
          onBack={backToPanel}
        />
        <footer className="footer">
          <span>© {new Date().getFullYear()} Goiás DataHub</span>
          <span>Central de ferramentas políticas e eleitorais</span>
          <span className="footer-right">
            <span className="live-dot" /> Portal operacional
          </span>
        </footer>
      </main>
    </div>
  );
}
