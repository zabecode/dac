<script setup lang="ts">
import { computed } from 'vue'
import AppLayout from '../layouts/AppLayout.vue'
import { Head, usePage } from '@inertiajs/vue3'
import StatCard from '../components/StatCard.vue'
import DataCard from '../components/DataCard.vue'
import { Users, Key, Building2, LayoutDashboard } from 'lucide-vue-next'

const props = defineProps<{
    stats: Record<string, { value: number; limit?: number | null }>
}>()

const page = usePage()
const user = computed(() => (page.props.auth as any)?.user)
const isSuperUser = computed(() => Boolean(user.value?.isSuperUser))
</script>

<template>

    <Head title="Visão Geral" />

    <AppLayout>
        <template #header>
            <div class="flex flex-col gap-1">
                <h1 class="text-2xl font-bold text-zinc-900 dark:text-white">Visão Geral</h1>
                <p class="text-zinc-500 text-sm">Bem-vindo(a), {{ user?.fullName }}. Aqui está um resumo do sistema.
                </p>
            </div>
        </template>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard v-if="isSuperUser" label="Usuários" :value="stats.users?.value || 0" :icon="Users"
                color="text-[#3b82f6]" />

            <StatCard v-if="isSuperUser" label="Chaves de API" :value="stats.apiKeys?.value || 0" :icon="Key"
                color="text-amber-500" />

            <StatCard v-if="isSuperUser" label="Clientes" :value="stats.clients?.value || 0" :icon="Building2"
                color="text-emerald-500" />

            <StatCard label="Dashboard" value="Ativo" :icon="LayoutDashboard" color="text-zinc-500" />
        </div>

        <!-- Content Area -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DataCard title="Bem-vindo ao Template" subtitle="Personalize conforme sua necessidade">
                <p class="text-sm text-zinc-600 dark:text-zinc-400">
                    Este é um template base de SaaS com AdonisJS + Inertia + Vue 3.
                    Adicione seus módulos de negócio conforme necessário.
                </p>
                <ul class="mt-4 space-y-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <li>✅ Autenticação completa (login, registro, reset de senha)</li>
                    <li>✅ Gerenciamento de usuários (admin)</li>
                    <li>✅ API Keys</li>
                    <li>✅ Componentes reutilizáveis</li>
                    <li>✅ Layout responsivo premium</li>
                    <li>✅ Dark mode</li>
                </ul>
            </DataCard>

            <DataCard title="Componentes Disponíveis" subtitle="Reutilize em seus módulos">
                <div class="space-y-3">
                    <div v-for="comp in [
                        { name: 'StatCard', desc: 'Cards de estatísticas com ícone e barra de progresso' },
                        { name: 'PageHeader', desc: 'Cabeçalho de página com título e ação' },
                        { name: 'StatusBadge', desc: 'Badge de status com cores dinâmicas' },
                        { name: 'ConfirmDelete', desc: 'Zona de perigo com confirmação por nome' },
                        { name: 'FormField', desc: 'Wrapper de campo de formulário com label e erro' },
                        { name: 'EmptyState', desc: 'Estado vazio com ícone e ação' },
                        { name: 'DataCard', desc: 'Painel com header e conteúdo' },
                        { name: 'DrawerView', desc: 'Drawer lateral para CRUD' },
                        { name: 'Listing', desc: 'Tabela genérica com ações' },
                    ]" :key="comp.name"
                        class="flex items-start gap-3 p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                        <span
                            class="text-[10px] font-mono font-bold text-[#3b82f6] bg-[#3b82f6]/10 px-2 py-0.5 rounded shrink-0">
                            {{ comp.name }}
                        </span>
                        <span class="text-xs text-zinc-500 dark:text-zinc-400">{{ comp.desc }}</span>
                    </div>
                </div>
            </DataCard>
        </div>
    </AppLayout>
</template>
