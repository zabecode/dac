<script setup lang="ts">
defineProps<{
    title: string
    subtitle?: string
}>()
</script>

<template>
    <div class="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl overflow-hidden">
        <div class="px-5 py-4 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between">
            <div>
                <h3 class="text-sm font-bold text-zinc-900 dark:text-white">{{ title }}</h3>
                <p v-if="subtitle" class="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">{{ subtitle }}</p>
            </div>
            <slot name="actions" />
        </div>
        <div class="p-5">
            <slot />
        </div>
    </div>
</template>
