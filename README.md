# DAC — Data Acquisition Controller

Plataforma IoT multi-tenant para gerenciamento de dispositivos, sensores e coleta de leituras. Autenticação dupla: sessão para frontend, API Key segura para integrações externas.

## Funcionalidades

- **Dispositivos IoT**: Registro e monitoramento de dispositivos via MAC address.
- **Sensores**: Gestão de sensores (Modbus, MQTT, HTTP, Custom) vinculados a dispositivos.
- **Leituras**: Coleta de dados de sensores com tipos (unique, multiple, custom) e modos de entrada (automatic, manual, scheduled).
- **Gateway API**: Endpoints especializados para publicação em lote (device upsert, batch readings).
- **API Keys**: Chaves seguras com hash SHA-256, permissões por módulo, expiração opcional e identificador de tenant.
- **Dashboard**: Painel administrativo com visão geral do sistema.
- **Multi-tenancy**: Isolamento de dados por `identifier` da API Key.

## Tech Stack

| Camada    | Tecnologia                                |
| --------- | ----------------------------------------- |
| Backend   | AdonisJS v6 (TypeScript)                  |
| Frontend  | Vue 3 + Inertia.js                        |
| UI        | PrimeVue v4 (Aura Theme) + TailwindCSS v4 |
| Icons     | lucide-vue-next                           |
| Database  | MySQL                                     |
| Real-time | AdonisJS Transmit                         |

## Quick Start

```bash
# 1. Instalar dependências
npm install

# 2. Configurar ambiente
cp .env.example .env
node ace generate:key

# 3. Rodar migrations
node ace migration:run

# 4. Servidor de desenvolvimento
npm run dev
```

## Deploy (Dokploy/Docker)

```bash
# Build de produção
node ace build
cd build
npm ci --omit="dev"
node bin/server.js
```

📖 Guia completo: [`DEPLOY.md`](./DEPLOY.md)

## Estrutura do Projeto

```
app/
├── controllers/          # 11 controllers (Inertia + API)
├── middleware/            # 9 middleware (auth, apiAuth, superUser...)
├── models/               # 5 models (User, ApiKey, Device, Sensor, Reading)
├── services/             # 6 services (ApiKeySecure, Device, Sensor, Reading...)
├── validators/           # Validação com VineJS
└── exceptions/           # Custom exceptions
config/
├── modules.ts            # Registry de módulos do sistema
database/
├── migrations/           # 8 migrations
inertia/
├── pages/                # Páginas Vue (dashboard, devices, sensors, api_keys...)
├── layouts/              # AdminLayout, ClientLayout, AppLayout
├── components/           # Listing, DrawerView, Sidebar, Topbar...
start/
├── routes/               # 9 arquivos de rotas separados
```

## API Endpoints

Todas as rotas IoT requerem header `Authorization: Bearer <API_KEY>`:

| Recurso  | Endpoints                                 | Permissão  |
| -------- | ----------------------------------------- | ---------- |
| Devices  | CRUD + `POST /api/v1/dac/devices/publish` | `devices`  |
| Sensors  | CRUD completo                             | `sensors`  |
| Readings | CRUD + `POST /api/v1/dac/readings/batch`  | `readings` |

## Documentação

- [`AI_CONTEXT.md`](./AI_CONTEXT.md) — Guia para IA/Assistentes
- [`DEPLOY.md`](./DEPLOY.md) — Deploy com Docker/Dokploy
