<script setup lang="ts">
import { useForm, Head, Link, usePage } from '@inertiajs/vue3'
import { watch } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { Lock, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-vue-next'
import Icon from '../../images/icon.png'

const toast = useToast()
const page = usePage()

const props = defineProps<{
    email: string
    signature: string
}>()

const form = useForm({
    email: props.email,
    signature: props.signature,
    password: '',
    confirmPassword: ''
})

// Watch for global errors or success messages
watch(() => page.props.flash, (flash: any) => {
    if (flash?.success) {
        toast.add({ severity: 'success', summary: 'Sucesso', detail: flash.success, life: 5000 })
    }
    if (flash?.errors?.error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: flash.errors.error, life: 4000 })
    }
}, { deep: true, immediate: true })

const submit = () => {
    if (form.password !== form.confirmPassword) {
        toast.add({ severity: 'warn', summary: 'Atenção', detail: 'As senhas não coincidem.', life: 3000 })
        return
    }

    form.post('/reset-password', {
        onError: () => {
            toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao redefinir senha. Link pode ter expirado.', life: 3000 })
        }
    })
}
</script>

<template>

    <Head title="Nova Senha" />
    <Toast position="top-center" />

    <div
        class="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-[#3b82f6] selection:text-white">

        <!-- Background Elements -->
        <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div
                class="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#3b82f6]/5 blur-[150px] rounded-full animate-pulse-slow">
            </div>
            <div
                class="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#3b82f6]/5 blur-[150px] rounded-full animate-pulse-slow delay-1000">
            </div>
            <div class="absolute inset-0 opacity-[0.02]"
                style="background-image: radial-gradient(#ffffff 1px, transparent 1px); background-size: 32px 32px;">
            </div>
        </div>

        <div class="w-full max-w-[380px] relative z-10 flex flex-col gap-8 animate-in fade-in zoom-in duration-500">

            <!-- Header -->
            <div class="text-center space-y-2">
                <div class="flex justify-center mb-6">
                    <div
                        class="w-16 h-16 flex items-center justify-center rotate-3 hover:rotate-6 transition-transform duration-500 drop-shadow-lg">
                        <img :src="Icon" alt="Logo" class="w-full h-full object-contain" />
                    </div>
                </div>
                <h1 class="text-2xl font-bold text-white tracking-tight">Nova Senha</h1>
                <p class="text-sm text-zinc-400">Defina sua nova senha de acesso.</p>
            </div>

            <!-- Card -->
            <div class="bg-[#111] border border-zinc-800/50 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
                <form @submit.prevent="submit" class="space-y-5">

                    <!-- Email (Hidden/Disabled) -->
                    <InputText v-model="form.email" type="hidden" />
                    <InputText v-model="form.signature" type="hidden" />

                    <!-- Password -->
                    <div class="space-y-1.5">
                        <label class="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider ml-1">Nova
                            Senha</label>
                        <div class="relative group">
                            <Lock
                                class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-[#3b82f6] transition-colors duration-300" />
                            <InputText v-model="form.password" type="password"
                                class="!w-full !bg-[#0a0a0a] !border-zinc-800 !pl-10 !py-2.5 !text-sm !text-white placeholder:text-zinc-600 focus:!border-[#3b82f6] focus:!ring-1 focus:!ring-[#3b82f6]/20 !transition-all !rounded-lg !shadow-inner"
                                placeholder="Mínimo 8 caracteres" required minlength="8" />
                        </div>
                    </div>

                    <!-- Confirm Password -->
                    <div class="space-y-1.5">
                        <label class="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider ml-1">Confirmar
                            Senha</label>
                        <div class="relative group">
                            <ShieldCheck
                                class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-[#3b82f6] transition-colors duration-300" />
                            <InputText v-model="form.confirmPassword" type="password"
                                class="!w-full !bg-[#0a0a0a] !border-zinc-800 !pl-10 !py-2.5 !text-sm !text-white placeholder:text-zinc-600 focus:!border-[#3b82f6] focus:!ring-1 focus:!ring-[#3b82f6]/20 !transition-all !rounded-lg !shadow-inner"
                                placeholder="••••••••" required />
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <Button type="submit" :loading="form.processing"
                        class="!w-full !bg-[#3b82f6] !text-white !font-bold !py-3 !rounded-lg !border-none !text-xs uppercase tracking-widest hover:!bg-[#2563eb] hover:!scale-[1.02] active:!scale-[0.98] transition-all shadow-lg shadow-[#3b82f6]/10 group mt-2">
                        <span class="mr-2">Alterar Senha</span>
                        <ArrowRight v-if="!form.processing"
                            class="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>

                </form>
            </div>

            <!-- Footer -->
            <p class="text-center text-xs text-zinc-500">
                Cancelou a redefinição?
                <Link href="/login"
                    class="text-[#3b82f6] hover:text-[#2563eb] font-semibold transition-colors flex items-center justify-center gap-1 mt-2">
                    <ArrowLeft class="w-3 h-3" />
                    Voltar para o Login
                </Link>
            </p>

        </div>
    </div>
</template>

<style scoped>
.animate-pulse-slow {
    animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 0.05;
    }

    50% {
        opacity: 0.1;
    }
}
</style>
