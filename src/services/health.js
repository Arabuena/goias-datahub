// Acesso aos endpoints serverless do DataHub. Nenhum dado eleitoral é
// baixado ou armazenado: apenas status de disponibilidade/incorporação.

export async function fetchArahHealth() {
  const response = await fetch('/api/health', { cache: 'no-store' });
  const data = await response.json().catch(() => ({}));
  return {
    status: data.status || 'unknown',
    message: data.message || 'Status não confirmado.',
    checkedAt: data.checkedAt,
  };
}

export async function fetchEmbedStatus(parentOrigin) {
  const query = parentOrigin ? `?parentOrigin=${encodeURIComponent(parentOrigin)}` : '';
  const response = await fetch(`/api/embed-check${query}`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`embed-check respondeu ${response.status}`);
  const data = await response.json();
  return data.apps || {};
}
