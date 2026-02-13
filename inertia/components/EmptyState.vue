<script setup lang="ts">
import type { Component } from 'vue'
import { FolderOpen } from 'lucide-vue-next'

defineProps<{
    icon?: Component
    title?: string
    subtitle?: string
    actionLabel?: string
}>()

const emit = defineEmits(['action'])
</script>

<template>
    <div class="flex flex-col items-center justify-center py-16 text-center">
        <div class="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center mb-4">
            <component :is="icon || FolderOpen" class="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
        </div>
        <h3 class="text-lg font-bold text-zinc-900 dark:text-white mb-1">
            {{ title || 'Nenhum item encontrado' }}
        </h3>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mb-6">
            {{ subtitle || 'Comece criando seu primeiro item.' }}
        </p>
        <button v-if="actionLabel" @click="emit('action')"
            class="px-5 py-2.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-[#3b82f6]/20">
            {{ actionLabel }}
        </button>
    </div>
</template>
