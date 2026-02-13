<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'

const props = defineProps<{
    label: string
    value: string | number
    icon?: Component
    color?: string
    limit?: number | null
}>()

const percentage = computed(() => {
    if (!props.limit || props.limit === Infinity) return null
    return Math.min(100, Math.round((Number(props.value) / props.limit) * 100))
})

const colorClass = computed(() => props.color || 'text-[#3b82f6]')
</script>

<template>
    <div class="relative overflow-hidden bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl p-5 transition-all hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 group">
        <!-- Watermark icon -->
        <component v-if="icon" :is="icon"
            class="absolute -bottom-3 -right-3 w-20 h-20 opacity-[0.04] dark:opacity-[0.06] group-hover:opacity-[0.08] transition-opacity" />

        <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
                <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">
                    {{ label }}
                </p>
                <p class="text-3xl font-black text-zinc-900 dark:text-white tabular-nums">
                    {{ value }}
                </p>
                <p v-if="limit && limit !== Infinity" class="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">
                    de {{ limit }} ({{ percentage }}%)
                </p>
            </div>
            <div v-if="icon"
                class="w-10 h-10 rounded-lg flex items-center justify-center bg-zinc-100 dark:bg-white/10 shrink-0">
                <component :is="icon" class="w-5 h-5" :class="colorClass" />
            </div>
        </div>

        <!-- Progress bar -->
        <div v-if="percentage !== null" class="mt-3">
            <div class="h-1 bg-zinc-100 dark:bg-white/10 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500"
                    :class="percentage > 80 ? 'bg-amber-500' : 'bg-[#3b82f6]'"
                    :style="{ width: `${percentage}%` }">
                </div>
            </div>
        </div>
    </div>
</template>
