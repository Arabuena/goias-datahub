import { LayoutDashboard, ShieldCheck, X } from 'lucide-react';
import { getAppIcon } from './appIcons.js';

export default function AppSidebar({
  apps,
  activeId,
  onSelect,
  onOpenApp,
  mobileOpen,
  onClose,
  health,
}) {
  return (
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <div className="brand">
        <div className="brand-mark">
          <LayoutDashboard size={23} />
        </div>
        <div>
          <strong>
            Goiás <span>DataHub</span>
          </strong>
          <small>INTELIGÊNCIA EM UM SÓ LUGAR</small>
        </div>
        <button className="icon-btn mobile-close" onClick={onClose} aria-label="Fechar menu">
          <X size={18} />
        </button>
      </div>

      <div className="nav-caption">ESPAÇO DE TRABALHO</div>
      <button
        className={`nav-item ${!activeId ? 'selected' : ''}`}
        onClick={() => onSelect(null)}
      >
        <LayoutDashboard size={18} /> Visão geral
      </button>

      <div className="nav-caption tools-caption">
        SUAS FERRAMENTAS <span>{String(apps.length).padStart(2, '0')}</span>
      </div>
      {apps.map((app) => {
        const Icon = getAppIcon(app.icon);
        return (
          <button
            key={app.id}
            className={`nav-item ${activeId === app.id ? 'selected' : ''}`}
            onClick={() => onOpenApp(app.id)}
          >
            <span className={`mini-icon ${app.color}`}>
              <Icon size={18} />
            </span>
            {app.name}
            {app.healthCheckSupported && (
              <i className={`tiny-dot ${health?.status || 'unknown'}`} style={{ marginLeft: 'auto' }} />
            )}
          </button>
        );
      })}

      <div className="sidebar-bottom">
        <div className="secure-icon">
          <ShieldCheck size={18} />
        </div>
        <div>
          <strong>Integração sem duplicar sistemas</strong>
          <p>O DataHub reúne as interfaces; cada aplicação cuida dos próprios dados.</p>
        </div>
      </div>
      <div className="sidebar-foot">
        <span className="live-dot" /> Portal operacional
        <span className="version">v1.0.0</span>
      </div>
    </aside>
  );
}
