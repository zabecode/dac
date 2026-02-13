<script setup lang="ts">
import { ref, computed } from 'vue'
import AppLayout from '../../layouts/AppLayout.vue'
import Listing from '../../components/Listing.vue'
import DrawerView from '../../components/DrawerView.vue'
import { Head } from '@inertiajs/vue3'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import { Cpu, Wifi, WifiOff, Activity } from 'lucide-vue-next'

const props = defineProps<{
    devices: any[]
}>()

const selectedDevice = ref<any>(null)
const drawerVisible = ref(false)

const openDetail = (device: any) => {
    selectedDevice.value = device
    drawerVisible.value = true
}

const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}
</script>

<template>

    <Head title="Dispositivos" />

    <AppLayout>
        <Listing :items="devices" title="Dispositivos" subtitle="Gerencie os dispositivos IoT conectados."
            emptyMessage="Nenhum dispositivo"
            emptySubtitle="Os dispositivos aparecem aqui quando se conectam via gateway.">
            <template #icon>
                <Cpu class="w-7 h-7 text-[#3b82f6]" />
            </template>

            <template #empty-icon>
                <Cpu class="w-8 h-8 text-zinc-400 dark:text-zinc-600" />
            </template>

            <Column header="Dispositivo" class="!text-xs">
                <template #body="{ data }">
                    <div class="flex items-center gap-3 cursor-pointer" @click="openDetail(data)">
                        <div
                            class="w-8 h-8 rounded border border-[#3b82f6]/20 bg-[#3b82f6]/5 flex items-center justify-center text-[#3b82f6] shrink-0">
                            <Cpu class="w-3.5 h-3.5" />
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs font-bold text-zinc-900 dark:text-zinc-100">{{ data.mac }}</span>
                            <span v-if="data.description" class="text-[9px] text-zinc-500 truncate max-w-[200px]">
                                {{ data.description }}
                            </span>
                        </div>
                    </div>
                </template>
            </Column>

            <Column header="IP" class="!text-xs">
                <template #body="{ data }">
                    <span
                        class="text-[10px] font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-black/40 px-2 py-0.5 rounded border border-zinc-200 dark:border-white/5">
                        {{ data.lastIp || '—' }}
                    </span>
                </template>
            </Column>

            <Column header="Sensores" class="!text-xs">
                <template #body="{ data }">
                    <div class="flex items-center gap-1.5">
                        <Activity class="w-3 h-3 text-zinc-400" />
                        <span class="text-[10px] font-bold text-zinc-700 dark:text-zinc-300">
                            {{ data.sensors?.length || 0 }}
                        </span>
                    </div>
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
                    <div class="flex items-center gap-1.5">
                        <component :is="data.active ? Wifi : WifiOff" class="w-3 h-3"
                            :class="data.active ? 'text-emerald-500' : 'text-zinc-400'" />
                        <Tag :value="data.active ? 'Ativo' : 'Inativo'"
                            :severity="data.active ? 'success' : 'secondary'" class="!text-[9px] !px-1.5 !py-0.5" />
                    </div>
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

        <!-- Device Detail Drawer -->
        <DrawerView v-model:visible="drawerVisible" title="Detalhes do Dispositivo" :showSave="false">
            <div v-if="selectedDevice" class="flex flex-col gap-8 pb-10">
                <!-- Info -->
                <div class="space-y-4">
                    <h3
                        class="text-[10px] font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-[0.2em] border-b border-zinc-200 dark:border-white/5 pb-2">
                        Informações</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex flex-col gap-0.5">
                            <span class="text-[9px] text-zinc-500 uppercase tracking-wider">MAC</span>
                            <span class="text-xs font-mono font-bold text-zinc-900 dark:text-white">{{
                                selectedDevice.mac
                                }}</span>
                        </div>
                        <div class="flex flex-col gap-0.5">
                            <span class="text-[9px] text-zinc-500 uppercase tracking-wider">IP</span>
                            <span class="text-xs font-mono text-zinc-700 dark:text-zinc-300">{{ selectedDevice.lastIp ||
                                '—'
                                }}</span>
                        </div>
                        <div class="flex flex-col gap-0.5">
                            <span class="text-[9px] text-zinc-500 uppercase tracking-wider">Identifier</span>
                            <span class="text-xs font-bold text-zinc-700 dark:text-zinc-300">{{
                                selectedDevice.identifier || '—'
                                }}</span>
                        </div>
                        <div class="flex flex-col gap-0.5">
                            <span class="text-[9px] text-zinc-500 uppercase tracking-wider">Status</span>
                            <Tag :value="selectedDevice.active ? 'Ativo' : 'Inativo'"
                                :severity="selectedDevice.active ? 'success' : 'secondary'"
                                class="!text-[9px] !px-1.5 !py-0.5 w-fit" />
                        </div>
                    </div>
                    <div v-if="selectedDevice.description" class="flex flex-col gap-0.5">
                        <span class="text-[9px] text-zinc-500 uppercase tracking-wider">Descrição</span>
                        <span class="text-xs text-zinc-700 dark:text-zinc-300">{{ selectedDevice.description }}</span>
                    </div>
                </div>

                <!-- Sensors -->
                <div class="space-y-4">
                    <h3
                        class="text-[10px] font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-[0.2em] border-b border-zinc-200 dark:border-white/5 pb-2 flex items-center gap-2">
                        <Activity class="w-3 h-3" />
                        Sensores ({{ selectedDevice.sensors?.length || 0 }})
                    </h3>
                    <div v-if="selectedDevice.sensors?.length" class="space-y-2">
                        <div v-for="sensor in selectedDevice.sensors" :key="sensor.id"
                            class="flex items-center justify-between p-3 bg-zinc-50 dark:bg-black/20 rounded-lg border border-zinc-200 dark:border-white/5">
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-6 h-6 rounded bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center text-[#3b82f6]">
                                    <Activity class="w-3 h-3" />
                                </div>
                                <div class="flex flex-col">
                                    <span class="text-[10px] font-bold text-zinc-900 dark:text-zinc-100">{{ sensor.name
                                        }}</span>
                                    <span class="text-[9px] text-zinc-500">Code: {{ sensor.code }} · {{ sensor.kind
                                        }}</span>
                                </div>
                            </div>
                            <Tag :value="sensor.active ? 'Ativo' : 'Off'"
                                :severity="sensor.active ? 'success' : 'secondary'"
                                class="!text-[8px] !px-1.5 !py-0.5" />
                        </div>
                    </div>
                    <div v-else class="text-center py-6">
                        <Activity class="w-6 h-6 mx-auto text-zinc-300 dark:text-zinc-700 mb-2" />
                        <p class="text-[10px] text-zinc-400">Nenhum sensor registrado.</p>
                    </div>
                </div>

                <!-- Metadata -->
                <div v-if="selectedDevice.metadata" class="space-y-4">
                    <h3
                        class="text-[10px] font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-[0.2em] border-b border-zinc-200 dark:border-white/5 pb-2">
                        Metadata</h3>
                    <pre
                        class="text-[10px] font-mono bg-zinc-50 dark:bg-black/40 text-zinc-600 dark:text-zinc-400 p-3 rounded border border-zinc-200 dark:border-white/5 overflow-x-auto">
                {{ JSON.stringify(selectedDevice.metadata, null, 2) }}</pre>
                </div>
            </div>
        </DrawerView>
    </AppLayout>
</template>
