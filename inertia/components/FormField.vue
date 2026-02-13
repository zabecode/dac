<script setup lang="ts">
defineProps<{
    label: string
    error?: string
    required?: boolean
    hint?: string
}>()
</script>

<template>
    <div class="space-y-1.5">
        <label class="text-[11px] font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-widest block">
            {{ label }}
            <span v-if="required" class="text-red-500">*</span>
        </label>
        <slot />
        <p v-if="hint && !error" class="text-[10px] text-zinc-400 dark:text-zinc-500">{{ hint }}</p>
        <p v-if="error" class="text-[10px] text-red-500 dark:text-red-400 font-medium">{{ error }}</p>
    </div>
</template>
