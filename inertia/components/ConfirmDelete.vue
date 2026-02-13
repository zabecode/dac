<script setup lang="ts">
import { ref, computed } from 'vue'
import { Trash2 } from 'lucide-vue-next'

const props = defineProps<{
    itemName: string
    confirmText?: string
    title?: string
    description?: string
}>()

const emit = defineEmits(['confirm'])

const confirmInput = ref('')
const isMatch = computed(() => confirmInput.value === props.itemName)
</script>

<template>
    <div class="border border-red-300/50 dark:border-red-500/20 rounded-xl p-5 bg-red-50/50 dark:bg-red-500/5">
        <h3 class="text-sm font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
            <Trash2 class="w-4 h-4" />
            {{ title || 'Zona de Perigo' }}
        </h3>
        <p class="text-xs text-zinc-600 dark:text-zinc-400 mb-4">
            {{ description || `Esta ação é irreversível. Para confirmar, digite "${itemName}" abaixo.` }}
        </p>

        <div class="flex gap-3 items-end">
            <div class="flex-1">
                <label class="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1 block">
                    {{ confirmText || 'Confirmar Nome' }}
                </label>
                <input v-model="confirmInput" type="text"
                    :placeholder="`Digite: ${itemName}`"
                    class="w-full px-3 py-2 text-sm bg-white dark:bg-black/40 border border-zinc-300 dark:border-white/10 rounded-lg focus:ring-1 focus:ring-red-500/30 focus:border-red-500 text-zinc-900 dark:text-white placeholder-zinc-400" />
            </div>
            <button @click="emit('confirm')" :disabled="!isMatch"
                class="px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all shrink-0"
                :class="isMatch
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20'
                    : 'bg-zinc-200 dark:bg-white/10 text-zinc-400 cursor-not-allowed'">
                Excluir
            </button>
        </div>
    </div>
</template>
