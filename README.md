# Zabe Analytic

Zabe Analytic is a monitoring and observability platform for n8n workflows. It allows users to ingest error logs from n8n via webhooks, visualize them on a dashboard, and receive notifications.

## Features

- **Dashboard**: Real-time stats and error trends.
- **Error Logging**: Detailed error storage with stack traces and JSON payloads.
- **Workflow Management**: Organize workflows and assign them to clients.
- **Notification Channels**: Webhook integration for Slack, Discord, etc.
- **Role-Based Access**: separate views for Admins and Clients.
- **Internationalization**: Fully translated to Portuguese (pt-BR).

## Quick Start (Development)

1.  **Install Dependencies**

    ```bash
    npm install
    ```

2.  **Environment Setup**
    Copy `.env.example` to `.env` and configure your database credentials.

    ```bash
    cp .env.example .env
    node ace generate:key
    ```

3.  **Database Migration**

    ```bash
    node ace migration:run
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

## 🐳 Deploy no Coolify

O projeto está **100% pronto** para deploy no Coolify via Git!

### Pré-requisitos

- MySQL 8.0 configurado no Coolify
- Redis 7 configurado no Coolify

### Deploy Rápido

1. **Criar aplicação no Coolify**
   - Source: Git Repository
   - Build Pack: **Dockerfile**
   - Port: **3333**

2. **Configurar variáveis de ambiente** (ver `.env.production.template`)

3. **Executar migrations após primeiro deploy**
   ```bash
   node ace migration:run --force
   ```

📖 **Guia completo de deploy**: Ver [`DEPLOY.md`](./DEPLOY.md)

## Production Build

```bash
node ace build
cd build
npm ci --omit="dev"
node bin/server.js
```

## Documentation

- [`DEPLOY.md`](./DEPLOY.md) - **Guia completo de deploy no Coolify**
- [`PROJECT_REPORT.md`](./PROJECT_REPORT.md) - Detailed audit of the current project status
- [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) - Design system documentation
