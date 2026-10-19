# Goiás DataHub

Portal integrador que reúne quatro aplicações web em uma única interface. As aplicações originais permanecem independentes e são exibidas em `iframe` dentro do portal quando as políticas de incorporação dos respectivos domínios permitem.

- **Stack:** React + Vite (JavaScript).
- **Backend:** funções serverless da Vercel (`api/`) apenas para monitoramento.
- **Persistência:** nenhuma. O portal não usa banco de dados nem armazena dados eleitorais.
- **Idioma:** português brasileiro.

## Aplicações integradas

| Aplicação | Identificador | URL |
|---|---|---|
| Xadrez Político | `xadrez-politico` | https://xadrez-politico-mu.vercel.app |
| PresidenteLab | `presidentelab` | https://presidentelab.vercel.app |
| ARAH IA | `arah-ia` | https://arah-ia.vercel.app/preview |
| TSE Section Finder | `tse-section-finder` | https://tse-section-finder.vercel.app |

Todas as URLs ficam em `src/config/applications.js` (configuração centralizada). Os componentes não contêm URLs hardcoded.

## Estrutura

```text
goias-datahub/
├── api/
│   ├── embed-check.js        # inspeção de cabeçalhos de incorporação
│   └── health.js             # monitor da ARAH IA
├── public/favicon.svg
├── src/
│   ├── components/           # AppCard, AppHeader, AppSidebar, EmbeddedApp, StatusIndicator
│   ├── config/applications.js
│   ├── hooks/                # useArahHealth, useEmbedStatus
│   ├── pages/Dashboard.jsx
│   ├── services/health.js
│   ├── styles/globals.css
│   ├── App.jsx
│   └── main.jsx
├── tests/config.test.js
├── .env.example
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Desenvolvimento

```bash
npm install
npm run dev
```

`npm run dev` serve apenas o frontend; as funções em `api/` não são executadas pelo Vite. Nesse modo, os indicadores de incorporação e de saúde aparecem como "não verificado / desconhecido". Para rodar frontend + funções juntos localmente, use a Vercel CLI:

```bash
npx vercel dev
```

## Testes e build

```bash
npm test          # valida a configuração central (node --test)
npm run build     # gera dist/
```

## Publicação na Vercel

1. Importe este diretório em um repositório Git novo (`goias-datahub`) ou faça deploy pela Vercel CLI.
2. Framework: Vite · build: `npm run build` · output: `dist`.
3. Configure `ARAH_HEALTH_URL` (ver `.env.example`).
4. Publique e teste `/api/health` e `/api/embed-check`.

## Monitoramento da ARAH IA (`/api/health`)

Faz uma consulta server-side ao endpoint em `ARAH_HEALTH_URL`, com timeout de 4,5 s e sem cache. Sem essa variável o status é `unknown` de propósito: a URL pública `/preview` é apenas a interface, não prova que o modelo está ativo. Nenhum selo verde é exibido sem confirmação real.

## Incorporação por iframe (`/api/embed-check`)

O navegador não permite que o portal leia a política de framing de outra origem nem detecta de forma confiável bloqueios por CSP/`X-Frame-Options` via JavaScript. Por isso o portal não depende de `onError`: a função `api/embed-check.js` consulta os domínios autorizados no servidor e lê os cabeçalhos `X-Frame-Options` e `Content-Security-Policy: frame-ancestors`, retornando:

- `embeddable` — nenhum cabeçalho de bloqueio encontrado;
- `blocked` — `X-Frame-Options` ou `frame-ancestors` impedem a incorporação pelo portal;
- `unreachable` — a aplicação não respondeu.

Ela **não** atua como proxy reverso: apenas lê cabeçalhos, sem reescrever conteúdo.

### Verificação manual realizada

Cabeçalhos inspecionados via requisição HTTP direta em 2026-10-19: nenhum dos quatro domínios retornou `X-Frame-Options` nem `Content-Security-Policy: frame-ancestors`, portanto a incorporação é **esperada como permitida** no nível de cabeçalhos HTTP. Todas são SPAs com renderização no cliente.

**Pendente de confirmação manual:** validar em navegador real o carregamento e o uso de cada aplicação dentro do iframe. Este passo não é automatizável no ambiente atual e deve ser refeito após qualquer mudança nos domínios de origem. Enquanto isso, os estados exibidos refletem exatamente a evidência disponível (e ficam `unverified` sem resposta conclusiva).

## Segurança do iframe

- `title` descritivo e `referrerPolicy="strict-origin-when-cross-origin"`.
- `allow` mínimo (`clipboard-read; clipboard-write`); sem permissões de câmera, microfone ou localização.
- `sandbox` não é aplicado por padrão para não quebrar as aplicações; pode ser definido por app em `embed.sandbox`.
- Apenas origens em HTTPS presentes na configuração podem ser incorporadas (`isAllowedUrl`).

## Princípios

Não modificar o código-fonte das aplicações originais, não replicar/baixar bases de dados, não usar proxy reverso para contornar políticas de segurança e não afirmar disponibilidade sem evidência. O botão "Abrir original" é sempre uma alternativa manual, nunca acionada automaticamente.
