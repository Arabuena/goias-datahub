import { ArrowUpRight } from 'lucide-react';
import StatusIndicator, { describeEmbed, describeHealth } from './StatusIndicator.jsx';
import { getAppIcon } from './appIcons.js';

export default function AppCard({ app, index, embedState, health, onOpen }) {
  const Icon = getAppIcon(app.icon);
  const indicator = app.healthCheckSupported
    ? describeHealth(health?.status)
    : describeEmbed(embedState);

  return (
    <article className="app-card" style={{ '--delay': `${index * 60}ms` }}>
      <div className="card-top">
        <div className={`app-icon ${app.color}`}>
          <Icon size={23} />
        </div>
        <StatusIndicator {...indicator} />
      </div>
      <div className="card-category">{app.category}</div>
      <h3>{app.name}</h3>
      <p>{app.description}</p>
      <button className="card-open" onClick={() => onOpen(app.id)}>
        Abrir ferramenta <ArrowUpRight size={16} />
      </button>
    </article>
  );
}
