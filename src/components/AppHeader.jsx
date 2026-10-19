import { CircleHelp, Menu } from 'lucide-react';
import { describeHealth } from './StatusIndicator.jsx';

export default function AppHeader({ activeName, health, onOpenMenu }) {
  const status = describeHealth(health?.status);

  return (
    <header className="topbar">
      <button className="icon-btn mobile-menu-btn" onClick={onOpenMenu} aria-label="Abrir menu">
        <Menu size={18} />
      </button>
      <div className="breadcrumbs">
        <span>Goiás DataHub</span>
        <span className="crumb-slash">/</span>
        <strong>{activeName || 'Visão geral'}</strong>
      </div>
      <div className="top-actions">
        <span className="top-status" title={health?.message}>
          <i className={`tiny-dot ${status.tone}`} />
          {status.label}
        </span>
        <button
          className="icon-btn help-btn"
          title="Sobre o portal"
          onClick={() =>
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          <CircleHelp size={18} />
        </button>
        <div className="avatar">GD</div>
      </div>
    </header>
  );
}
