// Vercel serverless endpoint: checks the ARAH IA service without exposing secrets.
// Configure ARAH_HEALTH_URL in Vercel with the real backend health endpoint.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ status: 'unknown', message: 'Método não permitido.' });
  const target = process.env.ARAH_HEALTH_URL;
  if (!target) return res.status(503).json({ status: 'unknown', message: 'Configure ARAH_HEALTH_URL com o endpoint de saúde real da IA.' });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);
  try {
    const response = await fetch(target, { method: 'GET', signal: controller.signal, headers: { Accept: 'application/json' } });
    let payload = {};
    try { payload = await response.json(); } catch {}
    if (!response.ok) return res.status(503).json({ status: 'offline', message: 'O serviço de IA não está respondendo normalmente.' });
    const ready = payload.status === 'ok' || payload.status === 'healthy' || payload.status === 'ready' || payload.healthy === true || payload.ready === true;
    if (!ready) return res.status(503).json({ status: 'unknown', message: 'O endpoint respondeu, mas não confirmou que o modelo está pronto.' });
    return res.status(200).json({ status: 'online', checkedAt: new Date().toISOString(), message: 'Serviço de IA disponível.' });
  } catch {
    return res.status(503).json({ status: 'offline', message: 'Não foi possível alcançar o serviço de IA.' });
  } finally { clearTimeout(timeout); }
}
