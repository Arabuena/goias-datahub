import test from 'node:test';
import assert from 'node:assert/strict';
import { APPLICATIONS, ALLOWED_ORIGINS, getApplication, isAllowedUrl } from '../src/config/applications.js';

const EXPECTED_IDS = ['xadrez-politico', 'presidentelab', 'arah-ia', 'tse-section-finder'];
const REQUIRED_FIELDS = ['id', 'name', 'url', 'fallbackUrl', 'description', 'icon', 'enabled', 'healthCheckSupported'];

test('registra exatamente as aplicações do SPEC', () => {
  assert.deepEqual(
    APPLICATIONS.map((app) => app.id),
    EXPECTED_IDS,
  );
});

test('os identificadores são únicos', () => {
  const ids = APPLICATIONS.map((app) => app.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('todos os campos obrigatórios estão presentes', () => {
  for (const app of APPLICATIONS) {
    for (const field of REQUIRED_FIELDS) {
      assert.ok(app[field] !== undefined && app[field] !== '', `${app.id} sem campo ${field}`);
    }
  }
});

test('todas as URLs de produção usam HTTPS', () => {
  for (const app of APPLICATIONS) {
    assert.equal(new URL(app.url).protocol, 'https:', `${app.id} não usa HTTPS`);
    assert.equal(new URL(app.fallbackUrl).protocol, 'https:', `${app.id} fallback não usa HTTPS`);
  }
});

test('define uma única origem autorizada por aplicação', () => {
  assert.equal(ALLOWED_ORIGINS.length, APPLICATIONS.length);
  assert.equal(new Set(ALLOWED_ORIGINS).size, APPLICATIONS.length);
});

test('isAllowedUrl aceita apenas URLs HTTPS autorizadas', () => {
  for (const app of APPLICATIONS) {
    assert.equal(isAllowedUrl(app.url), true, `${app.id} deveria ser autorizada`);
    assert.equal(isAllowedUrl(app.fallbackUrl), true, `${app.id} fallback deveria ser autorizada`);
  }
});

test('isAllowedUrl rejeita HTTP, domínios arbitrários e entradas inválidas', () => {
  assert.equal(isAllowedUrl('http://xadrez-politico-mu.vercel.app/'), false);
  assert.equal(isAllowedUrl('https://exemplo-malicioso.com/'), false);
  assert.equal(isAllowedUrl('javascript:alert(1)'), false);
  assert.equal(isAllowedUrl('não é uma url'), false);
});

test('getApplication recupera por id e retorna null quando ausente', () => {
  assert.equal(getApplication('arah-ia').name, 'ARAH IA');
  assert.equal(getApplication('inexistente'), null);
});
