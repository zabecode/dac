<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AppLayout from '../../../layouts/AppLayout.vue'
import Listing from '../../../components/Listing.vue'
import DrawerView from '../../../components/DrawerView.vue'
import { Head, useForm, router, usePage } from '@inertiajs/vue3'
import Modal from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import DatePicker from 'primevue/datepicker'
import MultiSelect from 'primevue/multiselect'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import { Key, Trash2, Copy, Plus, Pencil, Shield, CalendarClock } from 'lucide-vue-next'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

interface SystemModule {
    slug: string
    name: string
    description?: string
}

const props = defineProps<{
    apiKeys: any[]
    modules: SystemModule[]
}>()

const visible = ref(false)
const toast = useToast()
const confirm = useConfirm()
const page = usePage()

const isEditing = ref(false)
const form = useForm({
    id: null as number | null,
    name: '',
    identifier: '',
    expiresAt: null as Date | null,
    permissions: [] as string[],
    isActive: true
})

const openCreate = () => {
    isEditing.value = false
    form.reset()
    form.id = null
    form.identifier = ''
    form.isActive = true
    form.permissions = []
    form.expiresAt = null
    visible.value = true
}

const openEdit = (key: any) => {
    isEditing.value = true
    form.reset()
    form.id = key.id
    form.name = key.name
    form.identifier = key.identifier || ''
    form.isActive = Boolean(key.isActive)
    form.permissions = key.permissions || []
    form.expiresAt = key.expiresAt ? new Date(key.expiresAt) : null
    visible.value = true
}

const submit = () => {
    if (!form.name.trim()) {
        toast.add({ severity: 'warn', summary: 'Atenção', detail: 'O nome da chave é obrigatório.', life: 3000 })
        return
    }

    if (form.permissions.length === 0) {
        toast.add({ severity: 'warn', summary: 'Atenção', detail: 'Selecione ao menos um módulo.', life: 3000 })
        return
    }

    if (isEditing.value && form.id) {
        form.put(`/api-keys/${form.id}`, {
            onSuccess: () => {
                visible.value = false
                form.reset()
                toast.add({ severity: 'success', summary: 'Atualizado', detail: 'Chave atualizada com sucesso.', life: 3000 })
            },
            onError: () => {
                toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao atualizar chave.', life: 3000 })
            }
        })
    } else {
        form.post('/api-keys', {
            onSuccess: () => {
                visible.value = false
                form.reset()
                toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Chave de API criada com sucesso.', life: 3000 })
            },
            onError: () => {
                toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao criar chave de API.', life: 3000 })
            }
        })
    }
}

const destroy = (id: number) => {
    confirm.require({
        message: 'Tem certeza? A aplicação que utiliza esta chave perderá o acesso imediatamente.',
        header: 'Revogar Chave',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim, revogar',
        rejectLabel: 'Cancelar',
        rejectClass: 'p-button-secondary p-button-outlined',
        acceptClass: 'p-button-danger',
        accept: () => {
            router.delete(`/api-keys/${id}`, {
                onSuccess: () => {
                    toast.add({ severity: 'info', summary: 'Revogada', detail: 'A chave foi revogada.', life: 3000 })
                }
            })
        }
    })
}

const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text)
        toast.add({ severity: 'success', summary: 'Copiado', detail: 'Copiado para a área de transferência', life: 2000 })
    } catch (err) {
        const textArea = document.createElement("textarea")
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
            document.execCommand('copy')
            toast.add({ severity: 'success', summary: 'Copiado', detail: 'Copiado para a área de transferência', life: 2000 })
        } catch (e) {
            toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao copiar. Copie manualmente.', life: 3000 })
        }
        document.body.removeChild(textArea)
    }
}

const newKey = computed(() => (page.props as any).flash?.newApiKey as string)
const showNewKeyModal = ref(false)

watch(newKey, (val) => {
    if (val) showNewKeyModal.value = true
})

if (newKey.value) showNewKeyModal.value = true

const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
}

const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('pt-BR')
}

const getModuleName = (slug: string) => {
    const mod = props.modules.find(m => m.slug === slug)
    return mod?.name || slug
}

// Minimum date for DatePicker (tomorrow)
const minDate = new Date()
minDate.setDate(minDate.getDate() + 1)
</script>

<template>

    <Head title="Chaves de API" />

    <AppLayout>
        <Listing :items="apiKeys" title="Chaves de API" subtitle="Gerencie chaves de acesso para integração via API."
            actionLabel="Nova Chave" emptyMessage="Nenhuma chave gerada"
            emptySubtitle="Crie sua primeira chave de acesso." @create="openCreate">
            <template #icon>
                <Key class="w-7 h-7 text-[#3b82f6]" />
            </template>

            <template #action-icon>
                <Plus class="w-3.5 h-3.5" />
            </template>

            <template #empty-icon>
                <Key class="w-8 h-8 text-zinc-400 dark:text-zinc-600" />
            </template>

            <!-- Columns -->
            <Column header="Chave" class="!text-xs">
                <template #body="{ data }">
                    <div class="flex items-center gap-3">
                        <div
                            class="w-8 h-8 rounded border border-[#3b82f6]/20 bg-[#3b82f6]/5 flex items-center justify-center text-[#3b82f6] shrink-0">
                            <Key class="w-3.5 h-3.5" />
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs font-bold text-zinc-900 dark:text-zinc-100">{{ data.name }}</span>
                            <span class="text-[9px] text-zinc-500 font-mono uppercase tracking-tight">
                                #{{ data.code }}
                            </span>
                        </div>
                    </div>
                </template>
            </Column>

            <Column header="Identificação" class="!text-xs">
                <template #body="{ data }">
                    <span
                        class="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono bg-zinc-100 dark:bg-black/40 px-2 py-0.5 rounded border border-zinc-200 dark:border-white/5">
                        {{ data.prefix }}••••••••
                    </span>
                </template>
            </Column>

            <Column header="Identificador" class="!text-xs">
                <template #body="{ data }">
                    <span v-if="data.identifier"
                        class="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-black/40 px-2 py-0.5 rounded border border-zinc-200 dark:border-white/5">
                        {{ data.identifier }}
                    </span>
                    <span v-else class="text-[10px] text-zinc-400 italic">—</span>
                </template>
            </Column>

            <Column header="Permissões" class="!text-xs">
                <template #body="{ data }">
                    <div class="flex flex-wrap gap-1">
                        <Tag v-for="perm in (data.permissions || []).slice(0, 3)" :key="perm"
                            :value="getModuleName(perm)" severity="info" class="!text-[9px] !px-1.5 !py-0.5" />
                        <Tag v-if="(data.permissions || []).length > 3" :value="`+${data.permissions.length - 3}`"
                            severity="secondary" class="!text-[9px] !px-1.5 !py-0.5" />
                    </div>
                </template>
            </Column>

            <Column header="Expiração" class="!text-xs">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <div class="w-1.5 h-1.5 rounded-full"
                            :class="isExpired(data.expiresAt) ? 'bg-red-500' : data.expiresAt ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'">
                        </div>
                        <span class="text-[10px] font-bold"
                            :class="isExpired(data.expiresAt) ? 'text-red-500' : 'text-zinc-700 dark:text-zinc-300'">
                            {{ data.expiresAt ? formatDate(data.expiresAt) : 'Sem expiração' }}
                        </span>
                    </div>
                </template>
            </Column>

            <Column header="Último Uso" class="!text-xs">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <div class="w-1.5 h-1.5 rounded-full"
                            :class="data.lastUsedAt ? 'bg-[#3b82f6]' : 'bg-zinc-300 dark:bg-zinc-700'"></div>
                        <span class="text-[10px] font-bold"
                            :class="data.lastUsedAt ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-400 dark:text-zinc-600 italic'">
                            {{ data.lastUsedAt ? formatDate(data.lastUsedAt) : 'Nunca utilizada' }}
                        </span>
                    </div>
                </template>
            </Column>

            <Column header="Ações" class="!text-xs text-right">
                <template #body="{ data }">
                    <div class="flex items-center justify-end gap-1">
                        <button @click="openEdit(data)"
                            class="p-1.5 text-zinc-400 hover:text-[#3b82f6] hover:bg-[#3b82f6]/10 rounded-md transition-colors"
                            title="Editar">
                            <Pencil class="w-3.5 h-3.5" />
                        </button>
                        <button @click="destroy(data.id)"
                            class="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                            title="Revogar">
                            <Trash2 class="w-3.5 h-3.5" />
                        </button>
                    </div>
                </template>
            </Column>
        </Listing>

        <!-- Drawer: Create/Edit -->
        <DrawerView v-model:visible="visible" :title="isEditing ? 'Configurações da Chave' : 'Nova Chave de API'"
            :loading="form.processing" @save="submit">
            <div class="flex flex-col gap-8 pb-10">

                <!-- Identificação -->
                <div class="space-y-4">
                    <h3
                        class="text-[10px] font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-[0.2em] border-b border-zinc-200 dark:border-white/5 pb-2">
                        Identificação</h3>
                    <div class="flex flex-col gap-1.5">
                        <label class="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 ml-1">Nome da
                            Chave</label>
                        <InputText v-model="form.name" placeholder="ex: Produção Principal"
                            class="!bg-zinc-50 dark:!bg-[#1c1c1c] !border-zinc-200 dark:!border-white/10 !text-xs !text-zinc-900 dark:!text-white focus:!border-[#3b82f6] !rounded-md !py-2" />
                        <small class="text-red-400 text-[10px] ml-1" v-if="form.errors.name">{{ form.errors.name
                            }}</small>
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label class="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 ml-1">Identificador
                            <span class="text-red-400">*</span></label>
                        <InputText v-model="form.identifier" placeholder="ex: Empresa X, Cliente Y"
                            class="!bg-zinc-50 dark:!bg-[#1c1c1c] !border-zinc-200 dark:!border-white/10 !text-xs !text-zinc-900 dark:!text-white focus:!border-[#3b82f6] !rounded-md !py-2" />
                        <small class="text-zinc-400 text-[10px] ml-1">Proprietário da chave (client, company). Carregado
                            no
                            contexto via middleware.</small>
                        <small class="text-red-400 text-[10px] ml-1" v-if="form.errors.identifier">{{
                            form.errors.identifier
                            }}</small>
                    </div>
                </div>

                <!-- Expiração -->
                <div class="space-y-4">
                    <h3
                        class="text-[10px] font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-[0.2em] border-b border-zinc-200 dark:border-white/5 pb-2 flex items-center gap-2">
                        <CalendarClock class="w-3 h-3" />
                        Expiração
                    </h3>
                    <div class="flex flex-col gap-1.5">
                        <label class="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 ml-1">Data de Expiração
                            <span class="text-zinc-400">(opcional)</span></label>
                        <DatePicker v-model="form.expiresAt" :minDate="minDate" dateFormat="dd/mm/yy" showIcon
                            showButtonBar placeholder="Sem expiração"
                            class="!bg-zinc-50 dark:!bg-[#1c1c1c] !border-zinc-200 dark:!border-white/10 !text-xs !rounded-md"
                            :pt="{
                                root: { class: '!bg-zinc-50 dark:!bg-[#1c1c1c] !border-zinc-200 dark:!border-white/10 !text-zinc-900 dark:!text-white' },
                                input: { class: '!text-zinc-900 dark:!text-white !text-xs !py-2 !bg-zinc-50 dark:!bg-[#1c1c1c] !border-zinc-200 dark:!border-white/10' },
                                panel: { class: '!bg-white dark:!bg-[#0d0d0d] !border !border-zinc-200 dark:!border-white/10 !shadow-2xl' }
                            }" />
                        <small class="text-zinc-400 text-[10px] ml-1">Deixe vazio para chave sem
                            expiração.</small>
                    </div>
                </div>

                <!-- Permissões -->
                <div class="space-y-4">
                    <h3
                        class="text-[10px] font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-[0.2em] border-b border-zinc-200 dark:border-white/5 pb-2 flex items-center gap-2">
                        <Shield class="w-3 h-3" />
                        Permissões
                    </h3>
                    <div class="flex flex-col gap-1.5">
                        <label class="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 ml-1">Módulos com
                            Acesso</label>
                        <MultiSelect v-model="form.permissions" :options="modules" optionLabel="name" optionValue="slug"
                            placeholder="Selecione os módulos..." display="chip" filter
                            class="!bg-zinc-50 dark:!bg-[#1c1c1c] !border-zinc-200 dark:!border-white/10 !text-xs !rounded-md w-full"
                            :pt="{
                                root: { class: '!bg-zinc-50 dark:!bg-[#1c1c1c] !border-zinc-200 dark:!border-white/10 !text-zinc-900 dark:!text-white !min-h-[36px]' },
                                label: { class: '!text-zinc-900 dark:!text-white !text-xs' },
                                trigger: { class: '!text-zinc-500 dark:!text-zinc-600 !w-8' },
                                panel: { class: '!bg-white dark:!bg-[#0d0d0d] !border !border-zinc-200 dark:!border-white/10 !shadow-2xl' },
                                item: { class: '!text-zinc-600 dark:!text-zinc-400 hover:!bg-[#3b82f6]/10 hover:!text-[#3b82f6] !text-xs !py-2 !px-3' },
                                filterInput: { class: '!bg-zinc-50 dark:!bg-[#1c1c1c] !border-zinc-200 dark:!border-white/10 !text-zinc-900 dark:!text-white !text-xs' },
                                chip: { class: '!bg-[#3b82f6]/10 !text-[#3b82f6] !text-[9px] !font-bold !px-2 !py-0.5 !rounded' }
                            }" />
                        <small class="text-red-400 text-[10px] ml-1" v-if="form.errors.permissions">{{
                            form.errors.permissions }}</small>
                        <small class="text-zinc-400 text-[10px] ml-1">Defina quais módulos esta chave pode
                            acessar.</small>
                    </div>
                </div>

                <!-- Controle (apenas edição) -->
                <div v-if="isEditing" class="space-y-4">
                    <h3
                        class="text-[10px] font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-[0.2em] border-b border-zinc-200 dark:border-white/5 pb-2">
                        Controle</h3>
                    <div
                        class="flex items-center justify-between p-3 bg-zinc-50 dark:bg-black/20 rounded-lg border border-zinc-200 dark:border-white/5">
                        <div class="flex flex-col">
                            <span
                                class="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-widest">Chave
                                Ativa</span>
                            <span class="text-[9px] text-zinc-500 dark:text-zinc-600">Permite requisições via
                                API.</span>
                        </div>
                        <button @click="form.isActive = !form.isActive" type="button"
                            class="relative inline-flex h-4.5 w-8.5 items-center rounded-full transition-all duration-300"
                            :class="form.isActive ? 'bg-[#3b82f6]' : 'bg-zinc-300 dark:bg-zinc-800'">
                            <span class="inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform"
                                :class="form.isActive ? 'translate-x-[1.2rem]' : 'translate-x-1'" />
                        </button>
                    </div>
                </div>
            </div>
        </DrawerView>

        <!-- Modal: Nova Chave Gerada -->
        <Modal v-model:visible="showNewKeyModal" header="Chave Gerada" :modal="true" :closable="false" :pt="{
            root: { class: '!bg-white dark:!bg-[#111] !border !border-zinc-200 dark:!border-white/10 !rounded-lg !shadow-2xl w-[450px]' },
            header: { class: '!bg-zinc-50 dark:!bg-black/40 !text-zinc-900 dark:!text-white !border-b !border-zinc-200 dark:!border-white/5 !p-4' },
            content: { class: '!bg-transparent !p-0 px-6 py-8' },
            footer: { class: '!bg-transparent !border-t !border-zinc-200 dark:!border-white/5 !p-4' }
        }">
            <div class="flex flex-col gap-6 text-center">
                <div
                    class="w-14 h-14 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center mx-auto text-[#3b82f6]">
                    <Key class="w-6 h-6" />
                </div>
                <div class="space-y-2">
                    <h3 class="text-lg font-bold text-zinc-900 dark:text-white">Guarde esta chave!</h3>
                    <p class="text-[11px] text-zinc-500 leading-relaxed">
                        Por segurança, esta chave <strong>nunca será exibida novamente</strong>. Copie e salve em um
                        local seguro.
                    </p>
                </div>
                <div class="bg-zinc-100 dark:bg-black/60 p-4 rounded border border-zinc-200 dark:border-white/5 flex items-center justify-between gap-4 group cursor-pointer active:scale-[0.98] transition-all"
                    @click="copyToClipboard(newKey)">
                    <code class="text-[#3b82f6] font-mono text-sm truncate select-all">{{ newKey }}</code>
                    <Copy
                        class="w-4 h-4 text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors flex-shrink-0" />
                </div>
            </div>
            <template #footer>
                <Button label="Copiei e estou ciente" @click="showNewKeyModal = false"
                    class="!bg-[#3b82f6] !text-white !text-xs font-black w-full !py-3 !border-none hover:!bg-[#2563eb]" />
            </template>
        </Modal>
    </AppLayout>
</template>
