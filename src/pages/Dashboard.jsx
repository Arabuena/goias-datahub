import { ArrowUpRight, LayoutDashboard, ShieldCheck } from 'lucide-react';
import AppCard from '../components/AppCard.jsx';
import EmbeddedApp from '../components/EmbeddedApp.jsx';
import StatusIndicator, { describeHealth } from '../components/StatusIndicator.jsx';
import { getAppIcon } from '../components/appIcons.js';

function Overview({ apps, health, checking, checkHealth, embedStates, onOpenApp }) {
  const healthIndicator = describeHealth(health?.status);

  return (
    <>
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-content">
          <div className="hero-pill">
            <span /> CENTRAL DE INTELIGÊNCIA
          </div>
          <h1>
            Suas ferramentas.
            <br />
            <em>Um só lugar.</em>
          </h1>
          <p>
            Um espaço unificado para explorar aplicações políticas, dados eleitorais e
            inteligência artificial sem perder o contexto.
          </p>
          <button
            className="hero-btn"
            onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explorar ferramentas <ArrowUpRight size={16} />
          </button>
        </div>
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="hero-art">
          <div className="art-center">
            <LayoutDashboard size={35} />
          </div>
          {apps.slice(0, 4).map((app, index) => {
            const Icon = getAppIcon(app.icon);
            const nodeClass = ['node-a', 'node-b', 'node-c', 'node-d'][index] ?? 'node-d';
            return (
              <div className={`art-node ${nodeClass}`} key={app.id}>
                <Icon size={18} />
              </div>
            );
          })}
          <div className="art-line line-a" />
          <div className="art-line line-b" />
          <div className="art-line line-c" />
          <div className="art-line line-d" />
        </div>
        <div className="hero-index">
          <span>GOIÁS · DATAHUB</span>
          <span>{String(apps.length).padStart(2, '0')} APLICAÇÕES</span>
        </div>
      </section>

      <section className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">
            <LayoutDashboard size={18} />
          </div>
          <div>
            <strong>{String(apps.length).padStart(2, '0')}</strong>
            <span>Aplicações registradas</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <ShieldCheck size={18} />
          </div>
          <div>
            <strong>Camada de integração</strong>
            <span>Sem banco de dados próprio</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <StatusIndicator {...healthIndicator} />
          </div>
          <div>
            <strong className="status-stat">Disponibilidade verificada</strong>
            <span>Monitoramento server-side quando configurado</span>
          </div>
        </div>
      </section>

      <section className="tools-section" id="tools">
        <div className="section-heading">
          <div>
            <div className="eyebrow">SUAS FERRAMENTAS</div>
            <h2>Escolha uma aplicação</h2>
          </div>
          <span className="tool-count">{apps.length} INTEGRADAS</span>
        </div>
        <div className="app-grid">
          {apps.map((app, index) => (
            <AppCard
              key={app.id}
              app={app}
              index={index}
              embedState={embedStates[app.id]}
              health={health}
              onOpen={onOpenApp}
            />
          ))}
        </div>
      </section>

      <section className="about-strip" id="about">
        <div className="about-symbol">
          <ShieldCheck size={21} />
        </div>
        <div>
          <strong>O portal integra, não substitui</strong>
          <p>
            Cada aplicação original permanece independente e responsável por seus próprios dados.
            O Goiás DataHub é uma camada de apresentação, navegação e monitoramento.
          </p>
        </div>
        <span className="about-tag">SEM BANCO DE DADOS</span>
      </section>
    </>
  );
}

export default function Dashboard({
  apps,
  activeApp,
  embedStates,
  embedChecking,
  checkEmbed,
  health,
  checking,
  checkHealth,
  onOpenApp,
  onBack,
}) {
  const isChecking = checking || Boolean(embedChecking);
  const doCheckEmbed = checkEmbed || (() => {});
  if (activeApp) {
    return (
      <EmbeddedApp
        app={activeApp}
        embedState={embedStates[activeApp.id]}
        health={health}
        checking={isChecking}
        onCheck={checkHealth}
        checkEmbed={doCheckEmbed}
        onBack={onBack}
        onOpenExternal={() => window.open(activeApp.fallbackUrl || activeApp.url, '_blank', 'noopener,noreferrer')}
      />
    );
  }

  return (
    <Overview
      apps={apps}
      health={health}
      checking={checking}
      checkHealth={checkHealth}
      embedStates={embedStates}
      onOpenApp={onOpenApp}
    />
  );
}
