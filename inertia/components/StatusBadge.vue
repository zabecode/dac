<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    status: string
    variant?: 'dot' | 'pill'
    colorMap?: Record<string, string>
}>()

const defaultColors: Record<string, string> = {
    'Ativo': 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    'Inativo': 'bg-zinc-500/20 text-zinc-600 dark:text-zinc-400',
    'Pendente': 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
    'Erro': 'bg-red-500/20 text-red-600 dark:text-red-400',
    'Conectado': 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    'Desconectado': 'bg-zinc-500/20 text-zinc-600 dark:text-zinc-400',
}

const colors = computed(() => ({ ...defaultColors, ...props.colorMap }))
const colorClass = computed(() => colors.value[props.status] || defaultColors['Inativo'])
const variant = computed(() => props.variant || 'pill')
</script>

<template>
    <span v-if="variant === 'pill'"
        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
        :class="colorClass">
        <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
        {{ status }}
    </span>
    <span v-else class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full" :class="colorClass.replace('text-', 'bg-').split(' ')[0]"></span>
        <span class="text-xs text-zinc-600 dark:text-zinc-400">{{ status }}</span>
    </span>
</template>
