# AI Context (Antigravity Guide)

## 1. Project Identity

- **Name**: Contextual Analytics SaaS
- **Stack**: AdonisJS v6, Vue 3, Inertia.js, TailwindCSS v4, PrimeVue v4, MySQL.
- **Goal**: Multi-tenant platform for managing hierarchical assets and integrations.

## 2. Critical Rules (DO NOT BREAK)

1.  **Framework Compliance**:
    - Use `node ace make:controller -k` (Kebab-case naming).
    - Use `node ace make:model` (Lucid ORM).
    - NO manual SQL unless absolutely necessary.
2.  **Design Aesthetic (STRICT)**:
    - **Vibe**: "Developer-first", "Supabase-like" (Clean, Dark, Minimal).
    - **Do NOT use**: High gloss, 3D effects, gradients, or round bubbles.
    - **Do NOT use**: Supabase name or official icons. Use `lucide-vue-next`.
3.  **Real-time (Transmit)**:
    - **Backend**: Always use `BroadcastService.refreshDashboard()` or `refreshWorkspace()` in `afterSave/afterDelete` hooks.
    - **Frontend**: Always `await subscription.create()` before listening.
4.  **Authentication**:
    - Use `@adonisjs/auth` session guard.
    - `auth.user` is available in Inertia props.
5.  **Database**:
    - `isEnabled` fields are boolean (0/1).
    - `metadata` fields are JSON.
    - `code` fields (Integer) are used for relationships, NOT `id`.

## 3. Architecture Map

- **Auth**: `start/routes/auth.ts` -> `AuthController` -> `User` model.
- **Workspaces**: `start/routes/workspaces.ts` -> `WorkspacesController` -> `Workspace` model.
- **Spaces**: `start/routes/spaces.ts` -> `SpacesController` -> `Space` model (Recursive).
- **Assets**: `start/routes/assets.ts` -> `AssetsController` -> `Asset` model.
- **Integrations**: `start/routes/integrations.ts` -> `IntegrationsController`.

## 4. Frontend Patterns (STRICT)

- **Listings**: MUST use `<Listing>`. DO NOT build tables from scratch.
- **Drawers**: MUST use `<DrawerView>` for side panels.
- **Charts**: MUST use `<DashboardChart>`.
- **Icons**: Import from `lucide-vue-next`.
- **Navigation**: Use `<Link>` or `router.visit()`.
- **Theme**: PrimeVue **Aura** (Blue Preset).
- **Colors**:
  - Primary: `#3b82f6` (Blue-500).
  - Dark BG: `#1a1a1a`.
  - Border: `border-zinc-200` (Light) / `border-white/5` (Dark).

## 5. Documentation Links

- [Overview](./PROJECT_OVERVIEW.md)
- [Modules](./MODULES_GUIDE.md)
- [Database](./DATABASE_SCHEMA.md)
- [Frontend](./FRONTEND_GUIDE.md)
