<script setup lang="ts">
import { ref } from 'vue'
import AppLayout from '../../layouts/AppLayout.vue'
import Listing from '../../components/Listing.vue'
import DrawerView from '../../components/DrawerView.vue'
import { Head } from '@inertiajs/vue3'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import { Activity, Cpu } from 'lucide-vue-next'

const props = defineProps<{
    sensors: any[]
}>()

const selectedSensor = ref<any>(null)
const drawerVisible = ref(false)

const openDetail = (sensor: any) => {
    selectedSensor.value = sensor
    drawerVisible.value = true
}

const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

const kindLabel: Record<string, string> = {
    modbus: 'Modbus',
    mqtt: 'MQTT',
    http: 'HTTP',
    custom: 'Custom',
}

const kindSeverity = (kind: string): string => {
    const map: Record<string, string> = { modbus: 'info', mqtt: 'warn', http: 'success', custom: 'secondary' }
    return map[kind] || 'secondary'
}
</script>

<template>

    <Head title="Sensores" />

    <AppLayout>
        <Listing :items="sensors" title="Sensores" subtitle="Visualize os sensores registrados no sistema."
            emptyMessage="Nenhum sensor"
            emptySubtitle="Os sensores aparecem quando dispositivos se conectam via gateway.">
            <template #icon>
                <Activity class="w-7 h-7 text-[#3b82f6]" />
            </template>

            <template #empty-icon>
                <Activity class="w-8 h-8 text-zinc-400 dark:text-zinc-600" />
            </template>

            <Column header="Sensor" class="!text-xs">
                <template #body="{ data }">
                    <div class="flex items-center gap-3 cursor-pointer" @click="openDetail(data)">
                        <div
                            class="w-8 h-8 rounded border border-[#3b82f6]/20 bg-[#3b82f6]/5 flex items-center justify-center text-[#3b82f6] shrink-0">
                            <Activity class="w-3.5 h-3.5" />
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs font-bold text-zinc-900 dark:text-zinc-100">{{ data.name }}</span>
                            <span class="text-[9px] text-zinc-500 font-mono">Code: {{ data.code }}</span>
                        </div>
                    </div>
                </template>
            </Column>

            <Column header="Dispositivo" class="!text-xs">
                <template #body="{ data }">
                    <div v-if="data.device" class="flex items-center gap-2">
                        <Cpu class="w-3 h-3 text-zinc-400" />
                        <span class="text-[10px] font-mono text-zinc-600 dark:text-zinc-400">
                            {{ data.device.mac }}
                        </span>
                    </div>
                    <span v-else class="text-[10px] text-zinc-400 italic">—</span>
                </template>
            </Column>

            <Column header="Tipo" class="!text-xs">
                <template #body="{ data }">
                    <Tag :value="kindLabel[data.kind] || data.kind" :severity="kindSeverity(data.kind)"
                        class="!text-[9px] !px-1.5 !py-0.5" />
                </template>
            </Column>

            <Column header="Identifier" class="!text-xs">
                <template #body="{ data }">
                    <span v-if="data.identifier"
                        class="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-black/40 px-2 py-0.5 rounded border border-zinc-200 dark:border-white/5">
                        {{ data.identifier }}
                    </span>
                    <span v-else class="text-[10px] text-zinc-400 italic">—</span>
                </template>
            </Column>

            <Column header="Status" class="!text-xs">
                <template #body="{ data }">
                    <Tag :value="data.active ? 'Ativo' : 'Inativo'" :severity="data.active ? 'success' : 'secondary'"
                        class="!text-[9px] !px-1.5 !py-0.5" />
                </template>
            </Column>

            <Column header="Última Conexão" class="!text-xs">
                <template #body="{ data }">
                    <span class="text-[10px] font-bold"
                        :class="data.lastConnectionAt ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-400 italic'">
                        {{ formatDate(data.lastConnectionAt) }}
                    </span>
                </template>
            </Column>
        </Listing>

        <!-- Sensor Detail Drawer -->
        <DrawerView v-model:visible="drawerVisible" title="Detalhes do Sensor" :showSave="false">
            <div v-if="selectedSensor" class="flex flex-col gap-8 pb-10">
                <!-- Info -->
                <div class="space-y-4">
                    <h3
                        class="text-[10px] font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-[0.2em] border-b border-zinc-200 dark:border-white/5 pb-2">
                        Informações</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex flex-col gap-0.5">
                            <span class="text-[9px] text-zinc-500 uppercase tracking-wider">Nome</span>
                            <span class="text-xs font-bold text-zinc-900 dark:text-white">{{ selectedSensor.name
                                }}</span>
                        </div>
                        <div class="flex flex-col gap-0.5">
                            <span class="text-[9px] text-zinc-500 uppercase tracking-wider">Código</span>
                            <span class="text-xs font-mono text-zinc-700 dark:text-zinc-300">{{ selectedSensor.code
                                }}</span>
                        </div>
                        <div class="flex flex-col gap-0.5">
                            <span class="text-[9px] text-zinc-500 uppercase tracking-wider">Tipo</span>
                            <Tag :value="kindLabel[selectedSensor.kind] || selectedSensor.kind"
                                :severity="kindSeverity(selectedSensor.kind)"
                                class="!text-[9px] !px-1.5 !py-0.5 w-fit" />
                        </div>
                        <div class="flex flex-col gap-0.5">
                            <span class="text-[9px] text-zinc-500 uppercase tracking-wider">Status</span>
                            <Tag :value="selectedSensor.active ? 'Ativo' : 'Inativo'"
                                :severity="selectedSensor.active ? 'success' : 'secondary'"
                                class="!text-[9px] !px-1.5 !py-0.5 w-fit" />
                        </div>
                        <div class="flex flex-col gap-0.5">
                            <span class="text-[9px] text-zinc-500 uppercase tracking-wider">Identifier</span>
                            <span class="text-xs font-bold text-zinc-700 dark:text-zinc-300">{{
                                selectedSensor.identifier || '—'
                                }}</span>
                        </div>
                        <div class="flex flex-col gap-0.5">
                            <span class="text-[9px] text-zinc-500 uppercase tracking-wider">Última Conexão</span>
                            <span class="text-xs text-zinc-700 dark:text-zinc-300">{{
                                formatDate(selectedSensor.lastConnectionAt) }}</span>
                        </div>
                    </div>
                    <div v-if="selectedSensor.description" class="flex flex-col gap-0.5">
                        <span class="text-[9px] text-zinc-500 uppercase tracking-wider">Descrição</span>
                        <span class="text-xs text-zinc-700 dark:text-zinc-300">{{ selectedSensor.description }}</span>
                    </div>
                </div>

                <!-- Device -->
                <div v-if="selectedSensor.device" class="space-y-4">
                    <h3
                        class="text-[10px] font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-[0.2em] border-b border-zinc-200 dark:border-white/5 pb-2 flex items-center gap-2">
                        <Cpu class="w-3 h-3" />
                        Dispositivo
                    </h3>
                    <div
                        class="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-black/20 rounded-lg border border-zinc-200 dark:border-white/5">
                        <div
                            class="w-8 h-8 rounded bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center text-[#3b82f6]">
                            <Cpu class="w-3.5 h-3.5" />
                        </div>
                        <div class="flex flex-col">
                            <span class="text-[10px] font-bold text-zinc-900 dark:text-zinc-100">{{
                                selectedSensor.device.mac
                                }}</span>
                            <span class="text-[9px] text-zinc-500">IP: {{ selectedSensor.device.lastIp || '—' }}</span>
                        </div>
                    </div>
                </div>

                <!-- Metadata -->
                <div v-if="selectedSensor.metadata" class="space-y-4">
                    <h3
                        class="text-[10px] font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-[0.2em] border-b border-zinc-200 dark:border-white/5 pb-2">
                        Metadata</h3>
                    <pre
                        class="text-[10px] font-mono bg-zinc-50 dark:bg-black/40 text-zinc-600 dark:text-zinc-400 p-3 rounded border border-zinc-200 dark:border-white/5 overflow-x-auto">
                {{ JSON.stringify(selectedSensor.metadata, null, 2) }}</pre>
                </div>
            </div>
        </DrawerView>
    </AppLayout>
</template>
