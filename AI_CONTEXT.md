# AI Context (Antigravity Guide)

## 1. Project Identity

- **Name**: DAC (Data Acquisition Controller)
- **Stack**: AdonisJS v6, Vue 3, Inertia.js, TailwindCSS v4, PrimeVue v4, MySQL.
- **Goal**: Multi-tenant IoT platform for device management, sensor monitoring, and reading collection via API Key authentication.

## 2. Critical Rules (DO NOT BREAK)

1.  **Framework Compliance**:
    - Use `node ace make:controller -k` (Kebab-case naming).
    - Use `node ace make:model` (Lucid ORM).
    - NO manual SQL unless absolutely necessary.
2.  **Design Aesthetic (STRICT)**:
    - **Vibe**: "Developer-first", "Supabase-like" (Clean, Dark, Minimal).
    - **Do NOT use**: High gloss, 3D effects, gradients, or round bubbles.
    - **Icons**: Use `lucide-vue-next` only.
3.  **Multi-tenancy**:
    - All IoT data (devices, sensors, readings) is scoped by `identifier` from the API Key.
    - The `identifier` field acts as the tenant/client discriminator.
    - Never return data from other identifiers.
4.  **API Key Authentication**:
    - External API uses `Authorization: Bearer <KEY>` header.
    - Keys are SHA-256 hashed in database (only shown once at creation).
    - Each key has a `permissions: string[]` array referencing module slugs.
    - The `apiAuth` middleware validates key, checks expiration, and injects `apiKey` into context.
5.  **Authentication (Frontend)**:
    - Use `@adonisjs/auth` session guard for Inertia pages.
    - `auth.user` is available in Inertia props.
6.  **Database**:
    - `active` fields are boolean (0/1).
    - `metadata` fields are JSON.
    - `code` fields (BigInteger) are auto-generated unique identifiers.

## 3. Architecture Map

### Route Files (`start/routes/`)

| File           | Purpose                                            | Auth                |
| -------------- | -------------------------------------------------- | ------------------- |
| `auth.ts`      | Login, register, logout                            | Guest / Session     |
| `dashboard.ts` | Dashboard page                                     | Session + SuperUser |
| `api_keys.ts`  | API Keys CRUD (frontend)                           | Session + SuperUser |
| `admin.ts`     | User management                                    | Session + SuperUser |
| `docs.ts`      | Documentation page                                 | Session             |
| `docs_api.ts`  | Docs API endpoints                                 | Session             |
| `dac.ts`       | IoT pages (Devices, Sensors)                       | Session + SuperUser |
| `dac_api.ts`   | IoT REST API (Devices, Sensors, Readings, Gateway) | API Key             |
| `api.ts`       | General API endpoints                              | API Key             |

### Models (`app/models/`)

| Model     | Scoped By    | Description                                         |
| --------- | ------------ | --------------------------------------------------- |
| `User`    | —            | System users (SuperUser / regular)                  |
| `ApiKey`  | —            | API keys with permissions, identifier, expiration   |
| `Device`  | `identifier` | IoT devices (MAC, IP, metadata)                     |
| `Sensor`  | `identifier` | Sensors attached to devices (code, kind, metadata)  |
| `Reading` | `identifier` | Sensor readings (value, kind, entry type, grouping) |

### Services (`app/services/`)

| Service               | Purpose                                                |
| --------------------- | ------------------------------------------------------ |
| `ApiKeySecureService` | Hash-based key creation, validation, permission checks |
| `DeviceService`       | Device CRUD + `publicDevice` (gateway upsert)          |
| `SensorService`       | Sensor CRUD scoped by identifier                       |
| `ReadingService`      | Reading CRUD + `batchPublish` (gateway batch insert)   |
| `GlobalService`       | Shared utilities                                       |
| `BroadcastService`    | Real-time events via AdonisJS Transmit                 |

### Middleware (`app/middleware/`)

| Middleware  | Purpose                                                            |
| ----------- | ------------------------------------------------------------------ |
| `apiAuth`   | Validates API Key, checks permissions, injects `apiKey` in context |
| `auth`      | Session-based authentication                                       |
| `superUser` | Restricts to admin users                                           |
| `throttle`  | Rate limiting                                                      |

## 4. Frontend Patterns (STRICT)

- **Listings**: MUST use `<Listing>`. DO NOT build tables from scratch.
- **Drawers**: MUST use `<DrawerView>` for side panels.
- **Icons**: Import from `lucide-vue-next`.
- **Navigation**: Use `<Link>` or `router.visit()`.
- **Theme**: PrimeVue **Aura** (Blue Preset).
- **Colors**:
  - Primary: `#3b82f6` (Blue-500).
  - Dark BG: `#1a1a1a`.
  - Border: `border-zinc-200` (Light) / `border-white/5` (Dark).

## 5. System Modules

Defined in `config/modules.ts`. Used by API Keys to control access:

| Slug        | Name          |
| ----------- | ------------- |
| `users`     | Usuários      |
| `api-keys`  | Chaves de API |
| `dashboard` | Dashboard     |
| `devices`   | Dispositivos  |
| `sensors`   | Sensores      |
| `readings`  | Leituras      |

## 6. API Endpoints Reference

All IoT endpoints require `Authorization: Bearer <API_KEY>` header.

### Devices

- `GET /api/v1/devices` — List devices (scoped by identifier)
- `POST /api/v1/devices` — Create device
- `GET /api/v1/devices/:id` — Show device
- `PUT /api/v1/devices/:id` — Update device
- `DELETE /api/v1/devices/:id` — Delete device
- `POST /api/v1/dac/devices/publish` — Gateway upsert (create or update by MAC)

### Sensors

- `GET /api/v1/sensors` — List sensors (scoped by identifier)
- `POST /api/v1/sensors` — Create sensor
- `GET /api/v1/sensors/:id` — Show sensor
- `PUT /api/v1/sensors/:id` — Update sensor
- `DELETE /api/v1/sensors/:id` — Delete sensor

### Readings

- `GET /api/v1/readings` — List readings (scoped by identifier)
- `POST /api/v1/readings` — Create reading
- `GET /api/v1/readings/:id` — Show reading
- `PUT /api/v1/readings/:id` — Update reading
- `DELETE /api/v1/readings/:id` — Delete reading
- `POST /api/v1/dac/readings/batch` — Batch publish readings
