<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
    title: string
    subtitle?: string
    actionLabel?: string
    actionIcon?: Component
}>()

const emit = defineEmits(['action'])
</script>

<template>
    <div class="flex items-center justify-between gap-4 mb-6">
        <div class="flex flex-col gap-1">
            <h1 class="text-2xl font-bold text-zinc-900 dark:text-white">{{ title }}</h1>
            <p v-if="subtitle" class="text-zinc-500 text-sm">{{ subtitle }}</p>
        </div>
        <div class="flex items-center gap-3">
            <slot name="extra" />
            <button v-if="actionLabel" @click="emit('action')"
                class="flex items-center gap-2 px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-[#3b82f6]/20 hover:shadow-[#3b82f6]/30">
                <component v-if="actionIcon" :is="actionIcon" class="w-4 h-4" />
                {{ actionLabel }}
            </button>
        </div>
    </div>
</template>
