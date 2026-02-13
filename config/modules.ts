/**
 * System Modules Registry
 *
 * Define all modules available in the system.
 * API Keys use these slugs to control access permissions.
 * Add new modules here as the system grows.
 */
export interface SystemModule {
  slug: string
  name: string
  description?: string
}

export const systemModules: SystemModule[] = [
  { slug: 'users', name: 'Usuários', description: 'Gerenciamento de usuários' },
  { slug: 'api-keys', name: 'Chaves de API', description: 'Gerenciamento de chaves de API' },
  { slug: 'dashboard', name: 'Dashboard', description: 'Acesso ao dashboard' },
]
