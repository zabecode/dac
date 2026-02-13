<script setup lang="ts">
import { ref, watch } from 'vue'
import AppLayout from '../../layouts/AppLayout.vue'
import { Head, router, useForm } from '@inertiajs/vue3'
import { Plus, User, Shield, Trash2, Settings2, Search } from 'lucide-vue-next'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import DrawerView from '../../components/DrawerView.vue'

const props = defineProps<{
    users: Array<{
        id: number
        name: string
        email: string
        isSuperUser: boolean
        isEnabled: boolean
        createdAt: string
        code: number
    }>
    filters?: {
        search?: string
        role?: string
        status?: string
    }
}>()

const search = ref(props.filters?.search || '')
const role = ref(props.filters?.role || '')
const status = ref(props.filters?.status || '')

let debounceTimeout: any = null

const performSearch = () => {
    router.get('/users', {
        search: search.value,
        role: role.value,
        status: status.value
    }, {
        preserveState: true,
        replace: true,
        preserveScroll: true
    })
}

watch(search, () => {
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(performSearch, 500)
})

watch([role, status], () => {
    performSearch()
})

const toast = useToast()
const confirm = useConfirm()
const visible = ref(false)
const isEditing = ref(false)

const msgCleanPassword = '(deixe em branco para manter)'

const form = useForm({
    id: null as number | null,
    name: '',
    email: '',
    password: '',
    isSuperUser: false,
    isEnabled: true,
})

const openCreate = () => {
    isEditing.value = false
    form.reset()
    form.id = null
    form.isEnabled = true
    visible.value = true
}

const openEdit = (user: any) => {
    isEditing.value = true
    form.reset()
    form.id = user.id
    form.name = user.name
    form.email = user.email
    form.isSuperUser = Boolean(user.isSuperUser)
    form.isEnabled = Boolean(user.isEnabled)
    visible.value = true
}

const submit = () => {
    if (!form.name || !form.email) {
        toast.add({ severity: 'warn', summary: 'Campos Obrigatórios', detail: 'Preencha nome e e-mail.', life: 3000 })
        return
    }

    if (!isEditing.value && !form.password) {
        toast.add({ severity: 'warn', summary: 'Senha Necessária', detail: 'Informe uma senha para o novo usuário.', life: 3000 })
        return
    }

    if (isEditing.value && form.id) {
        form.put(`/users/${form.id}`, {
            onSuccess: () => {
                visible.value = false
                form.reset()
                toast.add({ severity: 'success', summary: 'Atualizado', detail: 'Usuário atualizado com sucesso.', life: 3000 })
            },
            onError: () => {
                toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao atualizar usuário.', life: 3000 })
            }
        })
    } else {
        form.post('/users', {
            onSuccess: () => {
                visible.value = false
                form.reset()
                toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário criado com sucesso.', life: 3000 })
            },
            onError: () => {
                toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao criar usuário.', life: 3000 })
            }
        })
    }
}

const destroy = (user: any) => {
    confirm.require({
        message: `Tem certeza que deseja excluir ${user.name}? Esta ação não pode ser desfeita.`,
        header: 'Excluir Usuário',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim, excluir',
        rejectLabel: 'Cancelar',
        rejectClass: 'p-button-secondary p-button-outlined',
        acceptClass: 'p-button-danger',
        accept: () => {
            router.delete(`/users/${user.id}`, {
                onSuccess: () => {
                    toast.add({ severity: 'info', summary: 'Excluído', detail: 'Usuário excluído com sucesso.', life: 3000 })
                }
            })
        }
    })
}


</script>

<template>

    <Head title="Gerenciamento de Usuários" />

    <AppLayout>
        <div class="flex justify-between items-end mb-8 border-b border-zinc-200 dark:border-white/5 pb-6">
            <div>
                <h1 class="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Usuários</h1>
                <p class="text-xs text-zinc-500 mt-1">Gerencie os membros da sua equipe e os acessos de clientes.</p>
            </div>
            <Button @click="openCreate"
                class="!text-[11px] !bg-[#3b82f6] !border-none !text-white font-bold !px-5 !py-2 !rounded-md hover:!bg-[#3b82f6]/90 transition-all shadow-lg shadow-[#3b82f6]/10">
                <Plus class="w-3.5 h-3.5 mr-2" />
                Novo Usuário
            </Button>
        </div>

        <!-- Filters -->
        <div
            class="mb-6 flex flex-wrap gap-4 items-center bg-white dark:bg-white/5 p-4 rounded-lg border border-zinc-200 dark:border-white/10 shadow-sm">
            <div class="relative flex-1 min-w-[200px]">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <InputText v-model="search" placeholder="Buscar por nome ou e-mail..."
                    class="pl-9 w-full !bg-zinc-50 dark:!bg-black/20 !border-zinc-200 dark:!border-white/10 !text-sm" />
            </div>

            <div class="w-40">
                <Dropdown v-model="role"
                    :options="[{ label: 'Todos os Tipos', value: null }, { label: 'Super Usuário', value: 'superuser' }, { label: 'Padrão', value: 'standard' }]"
                    optionLabel="label" optionValue="value" placeholder="Tipo de Usuário"
                    class="w-full !text-sm !bg-zinc-50 dark:!bg-black/20 !border-zinc-200 dark:!border-white/10" :pt="{
                        root: { class: '!bg-zinc-50 dark:!bg-black/20 !border-zinc-200 dark:!border-white/10 !text-zinc-900 dark:!text-white h-10 flex items-center' },
                        input: { class: '!text-zinc-900 dark:!text-white !py-0 !text-sm' },
                        trigger: { class: '!text-zinc-400 dark:!text-zinc-600 !w-8' },
                        panel: { class: '!bg-white dark:!bg-[#0d0d0d] !border !border-zinc-200 dark:!border-white/10' },
                        item: { class: '!text-zinc-600 dark:!text-zinc-400 hover:!bg-[#3b82f6]/10 hover:!text-[#3b82f6] !text-xs !py-2 !px-3' }
                    }" />
            </div>

            <div class="w-40">
                <Dropdown v-model="status"
                    :options="[{ label: 'Todos os Status', value: null }, { label: 'Ativo', value: 'active' }, { label: 'Inativo', value: 'inactive' }]"
                    optionLabel="label" optionValue="value" placeholder="Status"
                    class="w-full !text-sm !bg-zinc-50 dark:!bg-black/20 !border-zinc-200 dark:!border-white/10" :pt="{
                        root: { class: '!bg-zinc-50 dark:!bg-black/20 !border-zinc-200 dark:!border-white/10 !text-zinc-900 dark:!text-white h-10 flex items-center' },
                        input: { class: '!text-zinc-900 dark:!text-white !py-0 !text-sm' },
                        trigger: { class: '!text-zinc-400 dark:!text-zinc-600 !w-8' },
                        panel: { class: '!bg-white dark:!bg-[#0d0d0d] !border !border-zinc-200 dark:!border-white/10' },
                        item: { class: '!text-zinc-600 dark:!text-zinc-400 hover:!bg-[#3b82f6]/10 hover:!text-[#3b82f6] !text-xs !py-2 !px-3' }
                    }" />
            </div>
        </div>

        <div
            class="border border-zinc-200 dark:border-white/10 overflow-hidden rounded-lg bg-white dark:bg-black/20 shadow-xl">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr
                        class="bg-zinc-50 dark:bg-white/5 border-b border-zinc-200 dark:border-white/10 uppercase tracking-widest text-[10px] font-bold text-zinc-500">
                        <th class="px-5 py-3">Usuário</th>
                        <th class="px-5 py-3">Tipo</th>
                        <th class="px-5 py-3 text-center">Status</th>
                        <th class="px-5 py-3 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-zinc-100 dark:divide-white/5">
                    <tr v-for="user in users" :key="user.id"
                        class="hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors group">
                        <td class="px-5 py-4">
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/5 flex items-center justify-center text-zinc-400 dark:text-zinc-500">
                                    <span class="text-[10px] font-bold uppercase">{{ user.name?.charAt(0) }}</span>
                                </div>
                                <div class="flex flex-col min-w-0 text-xs">
                                    <span class="font-bold text-zinc-900 dark:text-zinc-100 truncate">{{ user.name
                                    }}</span>
                                    <span class="text-[10px] text-zinc-500 truncate mt-0.5">{{ user.email }}</span>
                                </div>
                            </div>
                        </td>
                        <td class="px-5 py-4">
                            <span :class="[
                                'px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border inline-flex items-center gap-1.5',
                                user.isSuperUser
                                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                    : 'bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20'
                            ]">
                                <Shield v-if="user.isSuperUser" class="w-2.5 h-2.5" />
                                <User v-else class="w-2.5 h-2.5" />
                                {{ user.isSuperUser ? 'Super User' : 'Standard' }}
                            </span>
                        </td>


                        <td class="px-5 py-4">
                            <div class="flex items-center justify-center gap-2">
                                <div :class="[
                                    'w-1.5 h-1.5 rounded-full',
                                    user.isEnabled ? 'bg-[#3b82f6] shadow-[0_0_8px_#3b82f666]' : 'bg-red-500 shadow-[0_0_8px_#ef444466]'
                                ]"></div>
                                <span
                                    class="text-[10px] font-medium uppercase tracking-tight text-zinc-600 dark:text-white/50">
                                    {{ user.isEnabled ? 'Ativo' : 'Inativo' }}
                                </span>
                            </div>
                        </td>
                        <td class="px-5 py-4 text-right">
                            <div class="flex items-center justify-end gap-1">
                                <button @click="openEdit(user)" class="text-zinc-500 hover:text-[#3b82f6] p-2">
                                    <Settings2 class="w-3.5 h-3.5" />
                                </button>
                                <button @click="destroy(user)" class="text-zinc-500 hover:text-red-400 p-2">
                                    <Trash2 class="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-if="users.length === 0" class="py-20 text-center text-zinc-500 flex flex-col items-center">
                <User class="w-10 h-10 opacity-10 mb-4 text-zinc-400" />
                <p class="text-xs font-medium">Nenhum usuário cadastrado</p>
            </div>
        </div>

        <DrawerView v-model:visible="visible" :title="isEditing ? 'Editar Usuário' : 'Novo Usuário'"
            :loading="form.processing" @save="submit">
            <div class="flex flex-col gap-8 pb-10">
                <div class="space-y-5">
                    <h3
                        class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] border-b border-zinc-100 dark:border-white/5 pb-2">
                        Informações Gerais</h3>

                    <div class="flex flex-col gap-1.5">
                        <label class="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 ml-1">Nome
                            Completo</label>
                        <InputText v-model="form.name" size="small"
                            class="!bg-white dark:!bg-[#1c1c1c] !border-zinc-200 dark:!border-white/10 !text-xs !text-zinc-900 dark:!text-white !rounded-md !py-2" />
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label class="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 ml-1">E-mail</label>
                        <InputText v-model="form.email" type="email" size="small"
                            class="!bg-white dark:!bg-[#1c1c1c] !border-zinc-200 dark:!border-white/10 !text-xs !text-zinc-900 dark:!text-white !rounded-md !py-2" />
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label class="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 ml-1">Senha {{ isEditing
                            ? msgCleanPassword
                            : '' }}</label>
                        <InputText v-model="form.password" type="password" size="small"
                            class="!bg-white dark:!bg-[#1c1c1c] !border-zinc-200 dark:!border-white/10 !text-xs !text-zinc-900 dark:!text-white !rounded-md !py-2" />
                    </div>
                </div>

                <div class="space-y-5">
                    <h3
                        class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] border-b border-zinc-100 dark:border-white/5 pb-2">
                        Permissões e Acesso</h3>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex flex-col gap-1.5">
                            <label class="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 ml-1">Super
                                Usuário</label>
                            <Dropdown v-model="form.isSuperUser"
                                :options="[{ label: 'Sim', value: true }, { label: 'Não', value: false }]"
                                optionLabel="label" optionValue="value" size="small"
                                class="!bg-white dark:!bg-[#1c1c1c] !border-zinc-200 dark:!border-white/10 !text-xs !rounded-md"
                                :pt="{
                                    root: { class: '!bg-white dark:!bg-[#1c1c1c] !border-zinc-200 dark:!border-white/10 !text-zinc-900 dark:!text-white h-9 flex items-center' },
                                    input: { class: '!text-zinc-900 dark:!text-white !py-0' },
                                    trigger: { class: '!text-zinc-400 dark:!text-zinc-600 !w-8' }
                                }" />
                        </div>
                        <div class="flex flex-col gap-1.5">
                            <label class="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 ml-1">Status</label>
                            <Dropdown v-model="form.isEnabled"
                                :options="[{ label: 'Ativo', value: true }, { label: 'Inativo', value: false }]"
                                optionLabel="label" optionValue="value" size="small"
                                class="!bg-white dark:!bg-[#1c1c1c] !border-zinc-200 dark:!border-white/10 !text-xs !rounded-md"
                                :pt="{
                                    root: { class: '!bg-white dark:!bg-[#1c1c1c] !border-zinc-200 dark:!border-white/10 !text-zinc-900 dark:!text-white h-9 flex items-center' },
                                    input: { class: '!text-zinc-900 dark:!text-white !py-0' },
                                    trigger: { class: '!text-zinc-400 dark:!text-zinc-600 !w-8' }
                                }" />
                        </div>
                    </div>
                </div>
            </div>
        </DrawerView>
    </AppLayout>
</template>
