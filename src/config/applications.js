// Registro centralizado das aplicações integradas ao Goiás DataHub.
// Este módulo é JS puro (sem JSX/React) para poder ser importado tanto pelo
// frontend quanto pelas funções serverless em `api/`.
//
// Cada URL é tratada como configuração: altere aqui, não nos componentes.

const ARAH_API_BASE = 'https://desktop-avf9fhc.tail4e8a8a.ts.net';
const ARAH_EMBED_URL = `https://arah-ia.vercel.app/preview?api=${encodeURIComponent(ARAH_API_BASE)}`;

export const APPLICATIONS = [
  {
    id: 'xadrez-politico',
    name: 'Xadrez Político',
    short: 'Análise política e votos por seção',
    description:
      'Análise política com acompanhamento de votos por seção. Aplicação original mantida independente pelo projeto Xadrez Político.',
    url: 'https://xadrez-politico-mu.vercel.app/',
    fallbackUrl: 'https://xadrez-politico-mu.vercel.app/',
    icon: 'chart',
    color: 'mint',
    category: 'Análise e política',
    enabled: true,
    healthCheckSupported: false,
    embed: { sandbox: null, allow: 'clipboard-read; clipboard-write' },
  },
  {
    id: 'presidentelab',
    name: 'PresidenteLab',
    short: 'Laboratório presidencial',
    description:
      'Ferramentas e consultas do Presidente DataLab, laboratório de análise do cenário presidencial.',
    url: 'https://presidentelab.vercel.app/',
    fallbackUrl: 'https://presidentelab.vercel.app/',
    icon: 'landmark',
    color: 'gold',
    category: 'Presidência',
    enabled: true,
    healthCheckSupported: false,
    embed: { sandbox: null, allow: 'clipboard-read; clipboard-write' },
  },
  {
    id: 'arah-ia',
    name: 'ARAH IA',
    short: 'Assistente de inteligência artificial',
    description:
      'Assistente de inteligência artificial. A disponibilidade do serviço pode depender de um backend/modelo externo ativo e é verificada pelo portal.',
    url: ARAH_EMBED_URL,
    fallbackUrl: ARAH_EMBED_URL,
    icon: 'bot',
    color: 'violet',
    category: 'Inteligência artificial',
    enabled: true,
    healthCheckSupported: true,
    embed: { sandbox: null, allow: 'clipboard-read; clipboard-write' },
  },
  {
    id: 'tse-section-finder',
    name: 'TSE Section Finder',
    short: 'Busca por seção e zona eleitoral',
    description:
      'Consulta de resultados eleitorais do TSE por município, zona e seção.',
    url: 'https://tse-section-finder.vercel.app/',
    fallbackUrl: 'https://tse-section-finder.vercel.app/',
    icon: 'search',
    color: 'blue',
    category: 'Dados eleitorais',
    enabled: true,
    healthCheckSupported: false,
    embed: { sandbox: null, allow: 'clipboard-read; clipboard-write' },
  },
];

// Lista de origens autorizadas para incorporação. Derivada da configuração
// acima para existir uma única fonte de verdade.
export const ALLOWED_ORIGINS = APPLICATIONS.map((app) => new URL(app.url).origin);

export function getApplication(id) {
  return APPLICATIONS.find((app) => app.id === id) ?? null;
}

// Aceita apenas HTTPS e origens explicitamente autorizadas. Evita que o portal
// se torne um mecanismo genérico de incorporação de URLs arbitrárias.
export function isAllowedUrl(value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return false;
  }
  if (parsed.protocol !== 'https:') return false;
  return ALLOWED_ORIGINS.includes(parsed.origin);
}
