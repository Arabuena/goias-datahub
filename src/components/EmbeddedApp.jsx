import { useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  ExternalLink,
  LoaderCircle,
  PanelLeftClose,
  RefreshCw,
  ShieldCheck,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { isAllowedUrl } from '../config/applications.js';
import StatusIndicator, { describeEmbed, describeHealth } from './StatusIndicator.jsx';
import { getAppIcon } from './appIcons.js';

export default function EmbeddedApp({
  app,
  embedState,
  health,
  checking,
  onCheck,
  checkEmbed,
  onBack,
  onOpenExternal,
}) {
  const [failed, setFailed] = useState(false);
  const Icon = getAppIcon(app.icon);
  const allowed = isAllowedUrl(app.url);
  const verdict = embedState?.embeddable;
  const cannotEmbed = !allowed || verdict === 'blocked' || verdict === 'unreachable' || failed;
  const embedIndicator = describeEmbed(embedState);
  const healthIndicator = describeHealth(health?.status);

  const reason = !allowed
    ? 'A URL desta aplicação não está na lista de domínios autorizados do portal.'
    : embedState?.reason ||
      'O navegador não expõe de forma confiável o motivo do bloqueio. A aplicação original pode impedir a exibição dentro de outro domínio.';

  return (
    <section className="workspace">
      <div className="workspace-heading">
        <button className="outline-btn" onClick={onBack}>
          <ArrowLeft size={15} /> Voltar ao painel
        </button>
        <div className={`app-icon large ${app.color}`}>
          <Icon size={25} />
        </div>
        <div className="workspace-title">
          <div className="eyebrow">FERRAMENTA INTEGRADA</div>
          <h1>{app.name}</h1>
          <p>{app.description}</p>
        </div>
        <div className="workspace-actions">
          <StatusIndicator {...embedIndicator} />
          <button
            className="icon-btn"
            onClick={checkEmbed}
            disabled={checking}
            title="Verificar incorporação novamente"
          >
            {checking ? <LoaderCircle className="spin" size={17} /> : <RefreshCw size={17} />}
          </button>
          <button className="outline-btn external-btn" onClick={onOpenExternal}>
            <ExternalLink size={15} /> Abrir original
          </button>
        </div>
      </div>

      {app.healthCheckSupported && (
        <div className={`health-banner ${healthIndicator.tone}`}>
          <div className="health-symbol">
            {health?.status === 'online' ? (
              <Wifi size={18} />
            ) : health?.status === 'offline' ? (
              <WifiOff size={18} />
            ) : (
              <Activity size={18} />
            )}
          </div>
          <div className="health-copy">
            <strong>{healthIndicator.label}</strong>
            <p>
              {health?.message || 'Verificando o serviço de IA.'}
              {health?.checkedAt
                ? ` · Verificado às ${new Date(health.checkedAt).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`
                : ''}
            </p>
          </div>
          <button className="icon-btn" onClick={onCheck} disabled={checking} title="Verificar novamente">
            {checking ? <LoaderCircle className="spin" size={17} /> : <RefreshCw size={17} />}
          </button>
        </div>
      )}

      <div className="frame-shell">
        <div className="frame-top">
          <div className="traffic">
            <i />
            <i />
            <i />
          </div>
          <div className="frame-address">
            <ShieldCheck size={13} />
            <span>{new URL(app.url).hostname}</span>
          </div>
          <button
            className="frame-reload"
            onClick={() => {
              setFailed(false);
              const frame = document.getElementById('app-frame');
              if (frame) frame.src = app.url;
            }}
            title="Recarregar aplicação"
          >
            <RefreshCw size={14} />
          </button>
        </div>

        {cannotEmbed ? (
          <div className="embed-fallback">
            <div className="fallback-icon">
              <PanelLeftClose size={27} />
            </div>
            <h2>Não foi possível incorporar esta aplicação</h2>
            <p>{reason}</p>
            <button className="primary-btn" onClick={onOpenExternal}>
              Abrir aplicação original <ArrowUpRight size={16} />
            </button>
          </div>
        ) : (
          <iframe
            id="app-frame"
            key={app.id}
            src={app.url}
            title={`${app.name} — aplicação externa incorporada no Goiás DataHub`}
            referrerPolicy="strict-origin-when-cross-origin"
            allow={app.embed?.allow}
            sandbox={app.embed?.sandbox ?? undefined}
            loading="lazy"
            onError={() => setFailed(true)}
          />
        )}
      </div>
      <p className="frame-note">
        <ShieldCheck size={14} /> Aplicação externa incorporada. Os dados e serviços continuam
        sendo fornecidos pelo site original.
      </p>
    </section>
  );
}
