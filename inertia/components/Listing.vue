<script setup lang="ts">
import DataTable from 'primevue/datatable'
import { Inbox } from 'lucide-vue-next'

const props = defineProps<{
    items: any[]
    title: string
    subtitle?: string
    actionLabel?: string
    emptyMessage?: string
    emptySubtitle?: string
    showAction?: boolean
    dataKey?: string
}>()

const emit = defineEmits(['create'])
</script>

<template>
    <!-- Header -->
    <div class="mb-8 border-b border-zinc-200 dark:border-white/5 pb-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-3">
                    <slot name="icon"></slot>
                    {{ title }}
                </h1>
                <p v-if="subtitle" class="text-zinc-500 text-sm">{{ subtitle }}</p>
            </div>

            <div class="flex items-center gap-3">
                <slot name="extra-actions"></slot>
                <button v-if="actionLabel" @click="emit('create')"
                    class="bg-[#3b82f6] text-white text-xs font-bold px-4 py-2.5 rounded-md hover:bg-[#3b82f6]/90 flex items-center justify-center gap-2 transition-colors shadow-sm">
                    <slot name="action-icon"></slot>
                    {{ actionLabel }}
                </button>
            </div>
        </div>
    </div>

    <!-- Table Container -->
    <div
        class="border border-zinc-200 dark:border-white/10 rounded-lg overflow-hidden bg-white dark:bg-black/20 shadow-sm dark:shadow-none">

        <!-- Empty State -->
        <div v-if="items.length === 0" class="text-center py-12 flex flex-col items-center justify-center">
            <div class="w-16 h-16 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center mb-4">
                <slot name="empty-icon">
                    <Inbox class="w-8 h-8 text-zinc-400 dark:text-zinc-600" />
                </slot>
            </div>
            <h3 class="text-zinc-900 dark:text-white font-medium text-lg mb-1">
                {{ emptyMessage || 'Nenhum registro encontrado' }}
            </h3>
            <p class="text-zinc-500 text-xs max-w-xs mx-auto">
                {{ emptySubtitle || 'Crie seu primeiro registro para começar.' }}
            </p>
            <div class="mt-6" v-if="actionLabel">
                <button @click="emit('create')"
                    class="bg-zinc-900 dark:bg-white text-white dark:text-black text-xs font-bold px-4 py-2 rounded flex items-center gap-2 hover:opacity-90 transition-opacity">
                    <slot name="action-icon"></slot>
                    {{ actionLabel }}
                </button>
            </div>
        </div>

        <!-- Data Table -->
        <DataTable v-else :value="items" :dataKey="dataKey || 'id'" stripedRows
            class="w-full text-left [&_.p-datatable-header]:!bg-transparent [&_.p-datatable-thead_th]:!bg-zinc-50 dark:[&_.p-datatable-thead_th]:!bg-white/5 [&_.p-datatable-thead_th]:!font-bold [&_.p-datatable-thead_th]:!text-zinc-500 [&_.p-datatable-tbody_td]:!border-b [&_.p-datatable-tbody_td]:!border-zinc-100 dark:[&_.p-datatable-tbody_td]:!border-white/5">
            <slot></slot>
        </DataTable>
    </div>
</template>
