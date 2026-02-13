<script setup lang="ts">
import Drawer from 'primevue/drawer'
import { Save, Trash2, X } from 'lucide-vue-next'
import { computed } from 'vue'

const visible = defineModel<boolean>('visible')
const props = defineProps<{
    title: string,
    width?: string,
    loading?: boolean,
    showDelete?: boolean,
    saveLabel?: string,
    hideFooter?: boolean
}>()

const emit = defineEmits<{
    (e: 'save'): void
    (e: 'delete'): void
    (e: 'close'): void
}>()

// Responsive width
const drawerWidth = computed(() => {
    if (typeof window === 'undefined') return props.width || '640px'
    const screenWidth = window.innerWidth
    if (screenWidth < 640) return '100vw'
    if (screenWidth < 1024) return '90vw'
    return props.width || '640px'
})
</script>

<template>
    <Drawer v-model:visible="visible" position="right" :style="{ width: drawerWidth }" :header="title" :modal="true"
        @hide="emit('close')" :pt="{
            root: { class: '!bg-white dark:!bg-[#1a1a1a] !shadow-2xl !border-l !border-zinc-200 dark:!border-[#2e2e2e]' },
            header: { class: '!bg-white dark:!bg-[#1a1a1a] !text-zinc-900 dark:!text-white !border-b !border-zinc-200 dark:!border-[#2e2e2e] !px-6 !py-4 flex items-center justify-between' },
            content: { class: '!bg-white dark:!bg-[#1a1a1a] !text-zinc-600 dark:!text-zinc-300 !p-0 !h-full' },
            closeButton: { class: '!text-zinc-400 hover:!text-zinc-900 dark:hover:!text-white !w-8 !h-8 !rounded hover:!bg-zinc-100 dark:hover:!bg-white/5 disabled:opacity-50' },
            mask: { class: '!bg-black/30 backdrop-blur-[1px]' }
        }">

        <template #header>
            <div class="flex items-center justify-between w-full">
                <h2 class="text-base font-bold text-zinc-900 dark:text-white">{{ title }}</h2>
            </div>
        </template>

        <div class="h-full flex flex-col">
            <!-- Scrollable Content -->
            <div class="flex-1 overflow-y-auto overflow-x-hidden p-6">
                <slot />
            </div>

            <!-- Action Buttons -->
            <div v-if="!hideFooter"
                class="border-t border-zinc-200 dark:border-[#2e2e2e] px-6 py-4 bg-zinc-50 dark:bg-[#1a1a1a] flex items-center justify-between gap-3 shrink-0">
                <div>
                    <!-- Delete Button (Left side) -->
                    <button v-if="showDelete" @click="emit('delete')" type="button"
                        class="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-xs font-bold px-3 py-2 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 border border-red-200 dark:border-red-500/20 transition-colors flex items-center gap-2">
                        <Trash2 class="w-3.5 h-3.5" />
                        Excluir
                    </button>
                    <slot name="footer-left" />
                </div>
                <div class="flex gap-3">
                    <button @click="visible = false" type="button"
                        class="text-zinc-500 hover:text-zinc-900 dark:hover:text-white text-xs font-bold px-4 py-2 rounded-md hover:bg-zinc-200 dark:hover:bg-white/5 border border-zinc-300 dark:border-zinc-700 transition-colors">
                        Cancelar
                    </button>
                    <button @click="emit('save')" type="button" :disabled="loading"
                        class="bg-[#3b82f6] text-white text-xs font-bold px-6 py-2 rounded-md hover:bg-[#3b82f6]/90 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                        <Save v-if="!loading" class="w-3.5 h-3.5" />
                        <span v-else
                            class="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                        {{ loading ? 'Salvando...' : (saveLabel || 'Salvar') }}
                    </button>
                </div>
            </div>
        </div>
    </Drawer>
</template>
