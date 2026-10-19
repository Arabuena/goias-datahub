// Vercel serverless endpoint: inspeciona os cabeçalhos de incorporação
// (X-Frame-Options e Content-Security-Policy: frame-ancestors) das aplicações
// autorizadas e devolve evidência real sobre a possibilidade de uso em iframe.
//
// Não atua como proxy reverso: apenas lê cabeçalhos HTTP. O conteúdo das
// aplicações nunca é reescrito nem servido pelo DataHub.
import { APPLICATIONS, isAllowedUrl } from '../src/config/applications.js';

const TIMEOUT_MS = 6000;

function parseFrameAncestors(csp) {
  if (!csp) return null;
  const directives = csp.split(';').map((part) => part.trim());
  const directive = directives.find((part) => part.toLowerCase().startsWith('frame-ancestors'));
  if (!directive) return null;
  return directive.split(/\s+/).slice(1);
}

function evaluateFraming({ xFrameOptions, frameAncestors, parentOrigin }) {
  if (frameAncestors) {
    const allowsAny = frameAncestors.includes('*');
    const allowsParent = parentOrigin && frameAncestors.includes(parentOrigin);
    const allowsSelfOnly = frameAncestors.length === 1 && frameAncestors[0] === "'self'";
    if (allowsAny || allowsParent) {
      return { embeddable: 'embeddable', reason: 'CSP frame-ancestors autoriza o portal.' };
    }
    if (allowsSelfOnly) {
      return { embeddable: 'blocked', reason: "CSP frame-ancestors permite apenas 'self'." };
    }
    return { embeddable: 'blocked', reason: 'CSP frame-ancestors não autoriza este portal.' };
  }
  if (xFrameOptions) {
    const value = xFrameOptions.toLowerCase();
    if (value.includes('deny')) {
      return { embeddable: 'blocked', reason: 'X-Frame-Options: DENY.' };
    }
    if (value.includes('sameorigin')) {
      return { embeddable: 'blocked', reason: 'X-Frame-Options: SAMEORIGIN.' };
    }
  }
  return {
    embeddable: 'embeddable',
    reason: 'Nenhum cabeçalho de bloqueio de incorporação foi encontrado.',
  };
}

async function inspectApp(app, parentOrigin) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(app.url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: { Accept: 'text/html', 'User-Agent': 'GoiasDataHub-EmbedCheck/1.0' },
    });
    const xFrameOptions = response.headers.get('x-frame-options');
    const csp = response.headers.get('content-security-policy');
    const frameAncestors = parseFrameAncestors(csp);
    const finalUrl = response.url || app.url;
    const redirected = new URL(finalUrl).origin !== new URL(app.url).origin;
    const verdict = evaluateFraming({ xFrameOptions, frameAncestors, parentOrigin });
    return {
      id: app.id,
      httpStatus: response.status,
      finalUrl,
      redirected,
      xFrameOptions,
      frameAncestors,
      ...verdict,
      checkedAt: new Date().toISOString(),
    };
  } catch {
    return {
      id: app.id,
      httpStatus: null,
      finalUrl: app.url,
      redirected: false,
      xFrameOptions: null,
      frameAncestors: null,
      embeddable: 'unreachable',
      reason: 'Não foi possível alcançar a aplicação para inspecionar os cabeçalhos.',
      checkedAt: new Date().toISOString(),
    };
  } finally {
    clearTimeout(timer);
  }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') {
    return res.status(405).json({ embeddable: 'error', message: 'Método não permitido.' });
  }

  const requestUrl = new URL(req.url, `https://${req.headers.host ?? 'localhost'}`);
  const parentOrigin = requestUrl.searchParams.get('parentOrigin') || null;
  const requestedId = requestUrl.searchParams.get('id');

  let targets = APPLICATIONS.filter((app) => app.enabled && isAllowedUrl(app.url));
  if (requestedId) {
    targets = targets.filter((app) => app.id === requestedId);
    if (targets.length === 0) {
      return res.status(404).json({ embeddable: 'error', message: 'Aplicação não encontrada ou não autorizada.' });
    }
  }

  const results = await Promise.all(targets.map((app) => inspectApp(app, parentOrigin)));
  const apps = Object.fromEntries(results.map((result) => [result.id, result]));
  return res.status(200).json({ checkedAt: new Date().toISOString(), parentOrigin, apps });
}
