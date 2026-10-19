// Indicador visual de estado. Nunca apresenta um selo de "funcionando" sem
// evidência: estados sem prova conclusiva ficam como "unknown"/"unverified".

export function describeHealth(status) {
  switch (status) {
    case 'online':
      return { tone: 'online', label: 'IA ativa' };
    case 'offline':
      return { tone: 'offline', label: 'IA indisponível' };
    default:
      return { tone: 'unknown', label: 'Status desconhecido' };
  }
}

export function describeEmbed(state) {
  switch (state?.embeddable) {
    case 'embeddable':
      return { tone: 'embeddable', label: 'Incorporável' };
    case 'blocked':
      return { tone: 'blocked', label: 'Incorporação bloqueada' };
    case 'unreachable':
      return { tone: 'unreachable', label: 'Indisponível' };
    case 'error':
      return { tone: 'error', label: 'Erro de comunicação' };
    default:
      return { tone: 'unverified', label: 'Não verificado' };
  }
}

export default function StatusIndicator({ tone = 'unknown', label, className = '' }) {
  return (
    <span className={`status-chip ${tone} ${className}`.trim()}>
      <i />
      {label}
    </span>
  );
}
