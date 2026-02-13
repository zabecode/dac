<script setup lang="ts">
import AppLayout from '../../layouts/AppLayout.vue'
import { Head, useForm } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { useToast } from 'primevue/usetoast'
import { User, Shield, Lock, Fingerprint } from 'lucide-vue-next'

const props = defineProps<{
    user: {
        id: number
        name: string
        email: string
        isSuperUser: boolean
    }
}>()

const toast = useToast()
const activeTab = ref('general')

const profileForm = useForm({
    name: props.user.name || '',
    email: props.user.email || '',
})

const securityForm = useForm({
    currentPassword: '',
    password: '',
    confirmPassword: ''
})

const roleLabel = computed(() => props.user.isSuperUser ? 'Admin' : 'User')
const roleColor = computed(() => props.user.isSuperUser ? 'text-[#3b82f6] bg-[#3b82f6]/10 border-[#3b82f6]/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20')

const updateProfile = () => {
    profileForm.put('/settings/profile', {
        onSuccess: () => {
            toast.add({ severity: 'success', summary: 'Perfil Atualizado', detail: 'Suas informações foram salvas com sucesso.', life: 3000 })
        },
        onError: () => {
            toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao atualizar perfil.', life: 3000 })
        }
    })
}

const updatePassword = () => {
    if (securityForm.password !== securityForm.confirmPassword) {
        toast.add({ severity: 'warn', summary: 'Aviso', detail: 'As senhas não coincidem.', life: 3000 })
        return
    }

    if (!securityForm.currentPassword) {
        toast.add({ severity: 'warn', summary: 'Aviso', detail: 'A senha atual é obrigatória.', life: 3000 })
        return
    }

    securityForm.put('/settings/profile', {
        onSuccess: () => {
            toast.add({ severity: 'success', summary: 'Segurança Atualizada', detail: 'Sua senha foi alterada com sucesso.', life: 3000 })
            securityForm.reset()
        },
        onError: (errors: any) => {
            if (errors.currentPassword) {
                toast.add({ severity: 'error', summary: 'Erro', detail: errors.currentPassword, life: 3000 })
            } else {
                toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao alterar senha. Verifique os requisitos.', life: 3000 })
            }
        }
    })
}
</script>

<template>

    <Head title="Configurações" />

    <AppLayout>
        <div class="max-w-6xl mx-auto pb-20">
            <!-- Header -->
            <div class="mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-6 flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Configurações da Conta</h1>
                    <p class="text-zinc-500 text-sm">Gerencie suas informações pessoais e segurança.</p>
                </div>
                <!-- Role Badge -->
                <div v-if="props.user.isSuperUser"
                    :class="['px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5', roleColor]">
                    <Shield class="w-3 h-3" />
                    {{ roleLabel }}
                </div>
            </div>

            <div class="flex flex-col md:flex-row gap-12">
                <!-- Navigation -->
                <aside class="w-full md:w-56 shrink-0">
                    <nav class="flex flex-col gap-1.5">
                        <button @click="activeTab = 'general'"
                            :class="['text-left px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-3 transition-all', activeTab === 'general' ? 'bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 border border-transparent']">
                            <User class="w-3.5 h-3.5" />
                            Perfil
                        </button>
                        <button @click="activeTab = 'security'"
                            :class="['text-left px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-3 transition-all', activeTab === 'security' ? 'bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 border border-transparent']">
                            <Lock class="w-3.5 h-3.5" />
                            Segurança
                        </button>
                    </nav>
                </aside>

                <!-- Content area -->
                <div class="flex-1 max-w-2xl">
                    <!-- General Tab -->
                    <div v-if="activeTab === 'general'"
                        class="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <section class="space-y-6">
                            <div
                                class="bg-white dark:bg-black/20 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xl">
                                <div
                                    class="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black/40">
                                    <h2
                                        class="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                                        Dados Pessoais
                                    </h2>
                                    <p class="text-zinc-500 text-[11px] mt-1">Como você aparece na plataforma.</p>
                                </div>
                                <div class="p-6 space-y-6">
                                    <div class="space-y-2">
                                        <label
                                            class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Nome
                                            Completo</label>
                                        <InputText v-model="profileForm.name" size="small"
                                            class="!w-full !bg-zinc-50 dark:!bg-[#0c0c0c] !border-zinc-200 dark:!border-zinc-800 !text-sm !text-zinc-900 dark:!text-white focus:!border-[#3b82f6] focus:!ring-1 focus:!ring-[#3b82f6]/20 !transition-all !rounded-lg !py-2.5" />
                                    </div>
                                    <div class="space-y-2">
                                        <label
                                            class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">E-mail
                                            de Acesso</label>
                                        <InputText v-model="profileForm.email" type="email" size="small"
                                            class="!w-full !bg-zinc-50 dark:!bg-[#0c0c0c] !border-zinc-200 dark:!border-zinc-800 !text-sm !text-zinc-900 dark:!text-white focus:!border-[#3b82f6] focus:!ring-1 focus:!ring-[#3b82f6]/20 !transition-all !rounded-lg !py-2.5" />
                                    </div>

                                </div>
                                <div
                                    class="bg-zinc-50 dark:bg-black/40 border-t border-zinc-200 dark:border-zinc-800 px-6 py-4 flex justify-end">
                                    <Button @click="updateProfile" :loading="profileForm.processing"
                                        class="!bg-[#3b82f6] !text-white !text-xs !font-bold !px-6 !py-2 !rounded-lg hover:scale-105 active:scale-95 transition-all">
                                        Atualizar Cadastro
                                    </Button>
                                </div>
                            </div>
                        </section>
                    </div>

                    <!-- Security Tab -->
                    <div v-if="activeTab === 'security'"
                        class="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <section class="space-y-6">
                            <div
                                class="bg-white dark:bg-black/20 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xl">
                                <div
                                    class="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black/40 flex items-center gap-3">
                                    <Fingerprint class="w-5 h-5 text-[#3b82f6]" />
                                    <div>
                                        <h2
                                            class="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                                            Alterar Senha
                                        </h2>
                                        <p class="text-zinc-500 text-[11px] mt-1">Sua senha deve ter pelo menos 8
                                            caracteres.</p>
                                    </div>
                                </div>
                                <div class="p-6 space-y-6">
                                    <div class="space-y-2">
                                        <!-- Fake inputs to trick browser autofill -->
                                        <input type="text" style="display:none" />
                                        <input type="password" style="display:none" />

                                        <label
                                            class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Senha
                                            Atual</label>
                                        <InputText v-model="securityForm.currentPassword" type="password" size="small"
                                            :invalid="!!securityForm.errors.currentPassword" autocomplete="off" readonly
                                            @focus="(e: Event) => (e.target as HTMLInputElement).removeAttribute('readonly')"
                                            class="!w-full !bg-zinc-50 dark:!bg-[#0c0c0c] !border-zinc-200 dark:!border-zinc-800 !text-sm !text-zinc-900 dark:!text-white focus:!border-[#3b82f6] focus:!ring-1 focus:!ring-[#3b82f6]/20 !transition-all !rounded-lg !py-2.5" />
                                        <small class="text-red-500" v-if="securityForm.errors.currentPassword">{{
                                            securityForm.errors.currentPassword }}</small>
                                    </div>
                                    <div class="space-y-2">
                                        <label
                                            class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Nova
                                            Senha</label>
                                        <InputText v-model="securityForm.password" type="password" size="small"
                                            class="!w-full !bg-zinc-50 dark:!bg-[#0c0c0c] !border-zinc-200 dark:!border-zinc-800 !text-sm !text-zinc-900 dark:!text-white focus:!border-[#3b82f6] focus:!ring-1 focus:!ring-[#3b82f6]/20 !transition-all !rounded-lg !py-2.5" />
                                    </div>
                                    <div class="space-y-2">
                                        <label
                                            class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Confirmar
                                            Nova Senha</label>
                                        <InputText v-model="securityForm.confirmPassword" type="password" size="small"
                                            class="!w-full !bg-zinc-50 dark:!bg-[#0c0c0c] !border-zinc-200 dark:!border-zinc-800 !text-sm !text-zinc-900 dark:!text-white focus:!border-[#3b82f6] focus:!ring-1 focus:!ring-[#3b82f6]/20 !transition-all !rounded-lg !py-2.5" />
                                    </div>
                                </div>
                                <div
                                    class="bg-zinc-50 dark:bg-black/40 border-t border-zinc-200 dark:border-zinc-800 px-6 py-4 flex justify-end">
                                    <Button @click="updatePassword" :loading="securityForm.processing"
                                        class="!bg-[#3b82f6] !text-white !text-xs !font-bold !px-6 !py-2 !rounded-lg hover:scale-105 active:scale-95 transition-all">
                                        Alterar Senha
                                    </Button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<style scoped>
.animate-in {
    animation-duration: 400ms;
}
</style>
