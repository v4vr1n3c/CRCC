<div align="center">

# ⚡ Cyber Risk Command Center

**Dashboard Executivo de Cibersegurança — Self-hosted, estático, sem backend**

[![Docker](https://img.shields.io/badge/Docker-nginx%3Aalpine-2496ED?logo=docker&logoColor=white)](https://hub.docker.com/_/nginx)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla%20ES6%2B-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.4.1-FF6384?logo=chart.js&logoColor=white)](https://www.chartjs.org/)
[![Web Crypto](https://img.shields.io/badge/Web%20Crypto%20API-PBKDF2%20SHA--256-4CAF50?logo=webauthn&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![i18n](https://img.shields.io/badge/i18n-PT%20%7C%20EN%20%7C%20ES-orange)](/)

*Executive Cybersecurity Dashboard — Self-hosted, fully static, no backend required*

</div>

---

## 📋 Sobre o Projeto / About

O **CRCC** é um dashboard executivo de cibersegurança que centraliza **150 indicadores de risco (KPIs e KRIs)** em **14 domínios de segurança**, com 4 scores executivos animados, 7 gráficos analíticos, documentação técnica completa e painel de gestão de indicadores — tudo rodando como um app estático no Docker.

> **CRCC** is an executive cybersecurity dashboard that centralizes **150 risk indicators (KPIs and KRIs)** across **14 security domains**, featuring 4 animated executive score gauges, 7 analytical charts, full technical documentation, and an indicator management panel — all running as a static app in Docker.

---

## 📸 Preview

> **Dashboard** — 4 executive score gauges (Hygiene, Resilience, Human, Risk) + indicator cards with color-coded status

> **Analytics** — 7 Chart.js charts: executive score evolution, domain health radar, KPI/KRI doughnut, compliance bars, annual trends, incident severity, domain trend lines

> **Admin** — Inline indicator editing with live score recalculation, import/export JSON, per-tab domain management

*Add your own screenshots to a `/docs/screenshots/` folder and reference them here.*

---

## ✨ Funcionalidades / Features

| Feature | Descrição |
|---|---|
| 🔐 **Autenticação** | PBKDF2 SHA-256 (100k iterações), bloqueio após 5 tentativas, sessionStorage |
| 📝 **Cadastro de Usuários** | Validação de senha forte, hash seguro, sem plaintext |
| 📊 **Dashboard Executivo** | 4 gauges SVG animados: Hygiene, Resilience, Human e Risk Score |
| 📈 **Analytics** | 7 gráficos Chart.js com dados históricos (31 meses) e predições |
| 📚 **Documentação** | Metodologia de cálculo + definição de todos os 150 indicadores |
| ⚙️ **Painel Admin** | Edição inline de indicadores, recálculo ao vivo, import/export JSON |
| 🌍 **Multilíngue** | Português 🇧🇷, Inglês 🇺🇸 e Espanhol 🇪🇸 |
| 🎯 **150 Indicadores** | KPIs e KRIs em 14 domínios de segurança |
| 🔄 **Auto-atualização** | Mudanças no Admin refletem no Dashboard em tempo real (cross-tab) |
| 🔒 **Nginx Hardened** | CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy |
| 📦 **Zero Dependências** | HTML + Vanilla JS + CSS — sem npm, sem build tool |
| 🐳 **Docker Ready** | Um comando para rodar em qualquer ambiente |

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| **Servidor** | nginx:alpine |
| **Frontend** | HTML5 + Vanilla JavaScript ES6+ + CSS3 |
| **Gráficos** | [Chart.js 4.4.1](https://www.chartjs.org/) (via CDN) |
| **Criptografia** | Web Crypto API — PBKDF2 SHA-256, 100.000 iterações |
| **Armazenamento** | `localStorage` (usuários, overrides, idioma) + `sessionStorage` (tokens) |
| **i18n** | Sistema próprio com `data-i18n` attributes (PT / EN / ES) |
| **Container** | Docker + docker-compose |

---

## ⚡ Quick Start

### Pré-requisitos

- **Docker 20.10+** e **docker-compose v2** — [instalar Docker](https://docs.docker.com/get-docker/)
- **OU** qualquer servidor de arquivos estáticos (`npx serve`, `python -m http.server`, etc.)
- Navegador moderno com suporte a **Web Crypto API**: Chrome 90+, Firefox 88+, Safari 14+

### 🐳 Com Docker (recomendado)

```bash
# 1. Clone o repositório
git clone https://github.com/<seu-usuario>/crcc.git
cd crcc

# 2. Suba o container
docker-compose up --build

# 3. Acesse no navegador
# http://localhost:8080
```

### 💻 Desenvolvimento (sem Docker)

```bash
# Servir a pasta app localmente
npx serve app -p 3333

# Ou com Python
python -m http.server 3333 --directory app

# Acesse: http://localhost:3333
```

---

## 🔑 Credenciais Padrão

> ⚠️ **Altere imediatamente em produção!**

| Campo | Valor |
|---|---|
| **E-mail** | `admin@crcc.io` |
| **Senha** | `Admin@1234` |
| **Role** | `admin` |

A conta admin é criada automaticamente no primeiro acesso via `seedDefaultAdmin()` caso não haja usuários cadastrados.

---

## 📁 Estrutura do Projeto

```
CRCC/
├── Dockerfile                    # nginx:alpine — copia app/ para webroot
├── docker-compose.yml            # Porta 8080:80, restart: unless-stopped
├── nginx.conf                    # Security headers + estratégia de cache
└── app/
    ├── index.html                # 📊 Dashboard (requer autenticação)
    ├── charts.html               # 📈 Analytics — 7 gráficos (requer autenticação)
    ├── docs.html                 # 📚 Documentação técnica (requer autenticação)
    ├── admin.html                # ⚙️  Painel Admin (requer autenticação)
    ├── login.html                # 🔐 Página de login
    ├── register.html             # 📝 Cadastro de usuários
    ├── shared.js                 # 🔧 Auth, crypto, i18n, utilitários (553 linhas)
    └── data/
        ├── indicators.json       # 150 definições de KPI/KRI em 14 domínios (107 KB)
        └── history.json          # Scores históricos + predições (31 meses)
```

---

## 📄 Páginas

| Página | URL | Auth | Descrição |
|---|---|:---:|---|
| Login | `/login.html` | ❌ | Autenticação PBKDF2 com lockout de 5 tentativas |
| Cadastro | `/register.html` | ❌ | Criação de conta com validação de senha forte |
| Dashboard | `/index.html` | ✅ | 4 gauges executivos + 150 cards de indicadores |
| Analytics | `/charts.html` | ✅ | 7 gráficos com histórico, predições e tendências |
| Documentação | `/docs.html` | ✅ | Metodologia + definição dos 150 indicadores |
| Admin | `/admin.html` | ✅ | Edição inline, score ao vivo, import/export |

---

## 🎯 Domínios de Segurança (14)

| Label | Domínio |
|---|---|
| `SOC` | Security Operations Center — Detection & Response |
| `VULN` | Vulnerability Management |
| `IAM` | Identity & Access Management |
| `ASM` | Attack Surface Management |
| `PPL` | People & Culture |
| `3RD` | Third Party Risk Management |
| `FIN` | Financial Risk & Business Impact |
| `GRC` | Governance, Risk & Compliance |
| `CLOUD` | Cloud Security Posture |
| `APPSEC` | Application Security |
| `INFRA` | Infrastructure & Network Security |
| `BISO` | Business Information Security |
| `RED` | Red Team & Offensive Security |
| `TI` | Threat Intelligence |

---

## 📐 Metodologia de Cálculo

### Scores Executivos

| Score | Ícone | Descrição |
|---|---|---|
| **Hygiene Score** | 🛡️ | Controles preventivos e postura de segurança |
| **Resilience Score** | ⚡ | Capacidade de detecção e resposta a incidentes |
| **Human Score** | 👥 | Cultura de segurança e fator humano |
| **Risk Score** | 🎯 | Exposição a riscos e ameaças externas |

### Fórmulas de Score por Indicador

```
higher_better (KPIs):
  score = min(100, (value / target) × 100)

lower_better (KRIs):
  se value ≤ target → score = 100
  senão → score = max(0, 100 - ((value - target) / target × 100))

target = 0 (contagens de incidentes):
  score = max(0, 100 - (value / warningThreshold × 100))
```

### Status por Score

| Range | Status | Cor |
|---|---|---|
| ≥ 85% | 🟢 No Alvo / On Target | `#3FB950` |
| 50–84% | 🟡 Atenção / Warning | `#D29922` |
| < 50% | 🔴 Alerta / Alert | `#F85149` |

---

## 🗃️ Schema dos Indicadores

```json
{
  "id": "mttd",
  "name": "MTTD — Mean Time to Detect",
  "type": "KRI",
  "unit": "h",
  "direction": "lower_better",
  "target": 4,
  "warningThreshold": null,
  "targetDisplay": "< 4h",
  "value": 3.2,
  "valueDisplay": "3.2h",
  "scores": ["resilience"],
  "isImprovement": false,
  "description": "Tempo médio desde a ocorrência até a detecção pelo SOC.",
  "rationale": "Detecção rápida limita o tempo de exposição a ameaças ativas."
}
```

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | string | Identificador único |
| `type` | `KPI` \| `KRI` | Tipo do indicador |
| `direction` | `higher_better` \| `lower_better` | Direção do score |
| `target` | number | Meta numérica |
| `warningThreshold` | number \| null | Threshold para indicadores com `target=0` |
| `scores` | string[] | Scores executivos que este indicador alimenta |
| `isImprovement` | boolean | Se é uma iniciativa de melhoria (roadmap) |

---

## ⚙️ Personalizando os Dados

### Opção 1 — Editar via Painel Admin (sem reiniciar Docker)

1. Acesse `/admin.html`
2. Selecione o domínio na aba correspondente
3. Edite os campos **Valor** e **Meta** inline
4. Clique em **Salvar Alterações** — as mudanças ficam no `localStorage` e refletem imediatamente em todas as abas abertas
5. Use **Exportar JSON** para baixar o arquivo atualizado

### Opção 2 — Editar o arquivo diretamente

1. Edite `app/data/indicators.json`
2. Rebuild o Docker: `docker-compose up --build`

> O nginx serve `/data/` com `Cache-Control: no-store`, garantindo que alterações no JSON sejam refletidas sem cache.

---

## 🔐 Arquitetura de Autenticação

> **Client-side only** — sem backend, sem servidor de autenticação.

```
Registro → PBKDF2(senha + salt aleatório, 100k iterações) → {name, email, salt, hash} → localStorage
Login    → PBKDF2(entrada + salt do usuário) → comparação de hash → token 32 bytes → sessionStorage
Sessão   → sessionStorage.crcc_token (apagado ao fechar a aba)
Auth     → requireAuth() checa sessionStorage antes de renderizar qualquer página protegida
```

**Armazenamento:**

| Chave | Onde | O que guarda |
|---|---|---|
| `crcc_users` | `localStorage` | Array de usuários `{name, email, salt, hash, role}` |
| `crcc_token` | `sessionStorage` | Token de sessão (64 chars base64) |
| `crcc_user` | `sessionStorage` | Nome do usuário logado |
| `crcc_lang` | `localStorage` | Idioma preferido (`pt`/`en`/`es`) |
| `crcc_indicators_override` | `localStorage` | Override do JSON de indicadores (opcional) |

> ⚠️ **Nota de produção**: Para uso enterprise multi-usuário, substitua o auth client-side por uma API backend + JWT. O localStorage é legível por qualquer JS na página.

---

## 🛡️ Segurança — Headers HTTP

Configurados no `nginx.conf` para todas as respostas:

```nginx
X-Frame-Options:           DENY
X-Content-Type-Options:    nosniff
Referrer-Policy:           strict-origin-when-cross-origin
X-XSS-Protection:          1; mode=block
Permissions-Policy:        camera=(), microphone=(), geolocation=()
Content-Security-Policy:   default-src 'self'; script-src 'self' 'unsafe-inline'
                           https://cdnjs.cloudflare.com; object-src 'none'; ...
```

**Proteções aplicadas no código:**

| Vetor | Proteção |
|---|---|
| XSS via dados JSON | `escapeHtml()` em todos os campos inseridos via `innerHTML` |
| Open Redirect | `?next=` validado contra allowlist de páginas internas |
| Brute Force | Lockout de 5 tentativas × 15 min (sessionStorage) |
| Clickjacking | `X-Frame-Options: DENY` |
| Senhas | PBKDF2, 100k iterações, salt aleatório por usuário |

---

## 🌍 Internacionalização (i18n)

O app suporta 3 idiomas configurados em `app/shared.js`:

- 🇧🇷 **Português** (padrão)
- 🇺🇸 **English**
- 🇪🇸 **Español**

A preferência é salva em `localStorage('crcc_lang')` e aplicada via atributos `data-i18n` no DOM. Para adicionar um idioma:

```js
// Em shared.js → TRANSLATIONS
fr: {
  login_title: 'Se connecter',
  // ... demais chaves
}
```

---

## 🐳 Docker — Detalhes

```yaml
# docker-compose.yml
services:
  cyber-risk-command-center:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
```

```dockerfile
# Dockerfile
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY app/ /usr/share/nginx/html/
EXPOSE 80
```

**Comandos úteis:**

```bash
# Iniciar
docker-compose up --build -d

# Parar
docker-compose down

# Ver logs
docker-compose logs -f

# Rebuildar após mudanças
docker-compose up --build
```

---

## 🤝 Contribuindo

1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Commit suas mudanças: `git commit -m 'feat: adiciona nova funcionalidade'`
4. Push: `git push origin feature/minha-feature`
5. Abra um Pull Request

**Diretrizes:**
- Use Vanilla JS — sem frameworks, sem npm
- Siga o padrão de tradução com `data-i18n` para qualquer texto visível
- Aplique `escapeHtml()` em todo conteúdo dinâmico inserido via `innerHTML`
- Mantenha o schema de `indicators.json` para novos indicadores

---

## 📜 Licença

Distribuído sob a licença **MIT**. Veja [`LICENSE`](LICENSE) para mais informações.

---

## 👤 Autor

**Arthur Paixão**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-arthurpaixao-0077B5?logo=linkedin&logoColor=white)](https://linkedin.com/in/arthurpaixao/)

---

<div align="center">

Feito com ❤️ por **Arthur Paixão**

⚡ *Cyber Risk Command Center — porque segurança executiva merece visibilidade.*

</div>
