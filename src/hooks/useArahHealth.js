import { useCallback, useEffect, useState } from 'react';
import { fetchArahHealth } from '../services/health.js';

const INITIAL = { status: 'unknown', message: 'Aguardando verificação.' };

// Monitora a ARAH IA por meio de `/api/health`. Sem `ARAH_HEALTH_URL`
// configurada no servidor, o status permanece `unknown` de propósito.
export function useArahHealth(intervalMs = 60000) {
  const [health, setHealth] = useState(INITIAL);
  const [checking, setChecking] = useState(false);

  const check = useCallback(async () => {
    setChecking(true);
    try {
      setHealth(await fetchArahHealth());
    } catch {
      setHealth({ status: 'unknown', message: 'Não foi possível consultar o monitor de saúde.' });
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    check();
    const id = setInterval(check, intervalMs);
    return () => clearInterval(id);
  }, [check, intervalMs]);

  return { health, checking, check };
}
