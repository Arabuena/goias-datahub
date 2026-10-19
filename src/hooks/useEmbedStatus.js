import { useCallback, useEffect, useState } from 'react';
import { fetchEmbedStatus } from '../services/health.js';

// Carrega a evidência de incorporação (cabeçalhos HTTP) das aplicações.
// Enquanto não houver resposta conclusiva, o estado é `unverified`.
export function useEmbedStatus(intervalMs = 300000) {
  const [states, setStates] = useState({});
  const [checking, setChecking] = useState(false);

  const check = useCallback(async () => {
    setChecking(true);
    try {
      const parentOrigin = typeof window !== 'undefined' ? window.location.origin : undefined;
      setStates(await fetchEmbedStatus(parentOrigin));
    } catch {
      setStates({});
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    check();
    const id = setInterval(check, intervalMs);
    return () => clearInterval(id);
  }, [check, intervalMs]);

  return { embedStates: states, embedChecking: checking, checkEmbed: check };
}
