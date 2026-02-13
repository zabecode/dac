<script setup lang="ts">
import { useForm, Head, Link } from '@inertiajs/vue3'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { User, Mail, Lock, UserPlus, ShieldCheck } from 'lucide-vue-next'
import Icon from '../../images/icon.png'

const toast = useToast()

const props = defineProps<{
    invite_token?: string
    email?: string
}>()

const form = useForm({
    name: '',
    email: props.email || '',
    password: '',
    confirmPassword: '',
    invite_token: props.invite_token || ''
})

const submit = () => {
    if (form.password !== form.confirmPassword) {
        form.setError('confirmPassword', 'As senhas não coincidem')
        toast.add({ severity: 'warn', summary: 'Aviso', detail: 'As senhas digitadas não coincidem.', life: 3000 })
        return
    }

    form.post('/register', {
        onError: () => {
            toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao criar conta. Verifique os dados.', life: 3000 })
        }
    })
}
</script>

<template>

    <Head title="Criar Conta" />
    <Toast />

    <div class="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <!-- Sophisticated Background -->
        <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div class="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#3b82f6]/5 blur-[120px] rounded-full">
            </div>
            <div class="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#3b82f6]/5 blur-[120px] rounded-full">
            </div>
            <div class="absolute inset-0 opacity-[0.03]"
                style="background-image: radial-gradient(#3b82f6 0.5px, transparent 0.5px); background-size: 24px 24px;">
            </div>
        </div>

        <div class="w-full max-w-[420px] relative z-10">
            <div class="text-center mb-8">
                <div class="flex justify-center mb-6">
                    <div
                        class="w-24 h-24 flex items-center justify-center rotate-3 hover:rotate-6 transition-transform duration-500 drop-shadow-lg">
                        <img :src="Icon" alt="Logo" class="w-full h-full object-contain" />
                    </div>
                </div>
                <h1 class="text-2xl font-black text-white tracking-tighter mb-2">Analítica de Próxima Geração</h1>
                <p class="text-[11px] text-zinc-500 font-medium uppercase tracking-[0.2em]">Crie seu acesso exclusivo na
                    Zabe Analytic</p>
            </div>

            <div class="bg-[#111111] border border-white/5 rounded-2xl p-8 shadow-2xl shadow-black/50">
                <form @submit.prevent="submit" class="space-y-5">
                    <div class="space-y-5">
                        <div class="space-y-2">
                            <label
                                class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 px-1">
                                Nome Completo
                            </label>
                            <div class="relative group">
                                <User
                                    class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#3b82f6] transition-colors" />
                                <InputText v-model="form.name" type="text"
                                    class="!w-full !bg-black/40 !border-white/10 !pl-10 !py-3 !text-[11px] !text-white focus:!border-[#3b82f6] focus:!ring-0 transition-all !rounded-lg"
                                    required />
                            </div>
                            <p v-if="form.errors.name" class="text-red-500 text-[10px] font-medium px-1">{{
                                form.errors.name }}</p>
                        </div>

                        <div class="space-y-2">
                            <label
                                class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 px-1">
                                E-mail de Acesso
                            </label>
                            <div class="relative group">
                                <Mail
                                    class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#3b82f6] transition-colors" />
                                <InputText v-model="form.email" type="email"
                                    class="!w-full !bg-black/40 !border-white/10 !pl-10 !py-3 !text-[11px] !text-white focus:!border-[#3b82f6] focus:!ring-0 transition-all !rounded-lg"
                                    required />
                            </div>
                            <p v-if="form.errors.email" class="text-red-500 text-[10px] font-medium px-1">{{
                                form.errors.email }}</p>
                        </div>

                        <div class="space-y-2">
                            <label
                                class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Senha</label>
                            <div class="relative group">
                                <Lock
                                    class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 group-focus-within:text-[#3b82f6] transition-colors" />
                                <InputText v-model="form.password" type="password"
                                    class="!w-full !bg-black/40 !border-white/10 !pl-9 !py-3 !text-[11px] !text-white focus:!border-[#3b82f6] transition-all !rounded-lg"
                                    required minlength="8" />
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Confirmar
                                Senha</label>
                            <div class="relative group">
                                <ShieldCheck
                                    class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 group-focus-within:text-[#3b82f6] transition-colors" />
                                <InputText v-model="form.confirmPassword" type="password"
                                    class="!w-full !bg-black/40 !border-white/10 !pl-9 !py-3 !text-[11px] !text-white focus:!border-[#3b82f6] transition-all !rounded-lg"
                                    required />
                            </div>
                        </div>
                    </div>
                    <p v-if="form.errors.password || form.errors.confirmPassword"
                        class="text-red-500 text-[10px] font-medium px-1">
                        {{ form.errors.password || form.errors.confirmPassword }}
                    </p>

                    <Button type="submit" :loading="form.processing"
                        class="!w-full !bg-[#3b82f6] !text-white !font-black !py-3.5 !rounded-lg !transition-all !border-none !text-[11px] uppercase tracking-widest shadow-xl shadow-[#3b82f6]/10 mt-2 hover:!bg-[#3b82f6]/90 active:scale-[0.98]">
                        <UserPlus v-if="!form.processing" class="w-4 h-4 mr-2" />
                        {{ form.processing ? 'Criando Conta...' : 'Cadastrar' }}
                    </Button>

                    <div class="text-center pt-2">
                        <Link href="/login"
                            class="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">
                            Já tem uma conta? <span class="text-[#3b82f6]">Faça Login</span>
                        </Link>
                    </div>
                </form>
            </div>

            <p class="mt-8 text-center text-[9px] text-zinc-600 font-mono">
                Ao se cadastrar, você concorda com nossos <br> <span
                    class="text-zinc-500 underline cursor-pointer">Termos de Serviço</span> e <span
                    class="text-zinc-500 underline cursor-pointer">Privacidade</span>.
            </p>
        </div>
    </div>
</template>
