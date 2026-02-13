# Deployment Guide (Dokploy)

This project is configured to be deployed using **Docker**.

## Prerequisites

- A Dokploy instance set up.
- A database (MySQL/PostgreSQL) and Redis 7 accessible by the application container.

## Configuration

1.  **Project Type**: Select **Dockerfile**.
2.  **Source**: Your Git repository (Github/Gitlab/etc).
3.  **Branch**: `main`.
4.  **Build Path**: `/` (Root directory).
5.  **Docker Context**: `/` (Root directory).

## Environment Variables

Copy the content of `.env.example` and update the values for production:

- `NODE_ENV=production`
- `PORT=3333`
- `APP_KEY`: Generate one using `node ace generate:key` locally and paste it.
- `APP_URL`: The full public URL of your app (e.g. `https://app.yourdomain.com`).
- **Database**:
  - `DB_HOST`: Service name or IP of your database.
  - `DB_PORT`: `3306` (MySQL) or `5432` (PostgreSQL).
  - `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`.
- **Redis**:
  - `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`.

## Commands

### Build Command

(Leave empty if using Dockerfile, handled automatically)

### Start Command

(Leave empty if using Dockerfile, handled automatically by `CMD`)

### Post-Deployment Command

Run database migrations after every deployment:

```bash
node ace migration:run --force
```

## Troubleshooting

If the application fails to start, check the logs. Common issues:

- Missing environment variables.
- Database connection failure.
- Incorrect `APP_URL`.
