<script setup lang="ts">
import { useForm, Head, Link, usePage } from '@inertiajs/vue3'
import { watch, ref, computed } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-vue-next'
import Icon from '../../images/icon.png'

const toast = useToast()
const page = usePage()
const showPassword = ref(false)

const form = useForm({
  email: '',
  password: '',
  remember: false,
})

// Watch for global errors from backend (Inertia share)
watch(() => page.props.errors, (errors: any) => {
  if (!errors) return

  if (errors.login) {
    toast.add({ severity: 'error', summary: 'Acesso Negado', detail: errors.login, life: 4000 })
  } else if (Object.keys(errors).length > 0) {
    // Show first error if any other exists
    const firstError = Object.values(errors)[0]
    toast.add({ severity: 'warn', summary: 'Atenção', detail: String(firstError), life: 3000 })
  }
}, { deep: true })

const submit = () => {
  form.post('/login', {
    onFinish: () => form.reset('password'),
    onError: (errors) => {
      // General error handling if needed, usually managed by form.errors
      if (errors.email || errors.password) {
        toast.add({ severity: 'warn', summary: 'Atenção', detail: 'Verifique os campos destacados.', life: 3000 })
      }
    }
  })
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>

  <Head title="Login" />
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
        style="background-image: radial-gradient(#ffffff 1px, transparent 1px); background-size: 32px 32px;"></div>
    </div>

    <div class="w-full max-w-[380px] relative z-10 flex flex-col gap-8 animate-in fade-in zoom-in duration-500">

      <!-- Header -->
      <div class="text-center space-y-2">
        <div class="flex justify-center mb-6">
          <div
            class="w-24 h-24 flex items-center justify-center rotate-3 hover:rotate-6 transition-transform duration-500 drop-shadow-lg">
            <img :src="Icon" alt="Logo" class="w-full h-full object-contain" />
          </div>
        </div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Bem-vindo de volta</h1>
        <p class="text-sm text-zinc-400">Insira suas credenciais para acessar o painel.</p>
      </div>

      <!-- Card -->
      <div class="bg-[#111] border border-zinc-800/50 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
        <form @submit.prevent="submit" class="space-y-5">

          <!-- Email -->
          <div class="space-y-1.5">
            <label class="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider ml-1">E-mail</label>
            <div class="relative group">
              <Mail
                class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-[#3b82f6] transition-colors duration-300" />
              <InputText v-model="form.email" type="email"
                class="!w-full !bg-[#0a0a0a] !border-zinc-800 !pl-10 !py-2.5 !text-sm !text-white placeholder:text-zinc-600 focus:!border-[#3b82f6] focus:!ring-1 focus:!ring-[#3b82f6]/20 !transition-all !rounded-lg !shadow-inner"
                :class="{ '!border-red-500/50 focus:!border-red-500': form.errors.email }" />
            </div>
            <p v-if="form.errors.email" class="text-red-400 text-[10px] ml-1">{{ form.errors.email }}</p>
          </div>

          <!-- Password -->
          <div class="space-y-1.5">
            <div class="flex justify-between items-center px-1">
              <label class="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Senha</label>
              <Link href="/forgot-password" class="text-[10px] text-zinc-500 hover:text-[#3b82f6] transition-colors">
                Esqueceu?</Link>
            </div>
            <div class="relative group">
              <Lock
                class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-[#3b82f6] transition-colors duration-300" />
              <InputText v-model="form.password" :type="showPassword ? 'text' : 'password'"
                class="!w-full !bg-[#0a0a0a] !border-zinc-800 !pl-10 !pr-10 !py-2.5 !text-sm !text-white placeholder:text-zinc-600 focus:!border-[#3b82f6] focus:!ring-1 focus:!ring-[#3b82f6]/20 !transition-all !rounded-lg !shadow-inner"
                :class="{ '!border-red-500/50 focus:!border-red-500': form.errors.password }" />
              <button type="button" @click="togglePassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5">
                <Eye v-if="!showPassword" class="w-4 h-4" />
                <EyeOff v-else class="w-4 h-4" />
              </button>
            </div>
            <p v-if="form.errors.password" class="text-red-400 text-[10px] ml-1">{{ form.errors.password }}</p>
          </div>

          <!-- Remember Me -->
          <div class="flex items-center gap-2 px-1">
            <div class="relative flex items-center">
              <input type="checkbox" id="remember" v-model="form.remember"
                class="peer h-4 w-4 cursor-pointer appearance-none rounded border border-zinc-700 bg-[#0a0a0a] transition-all checked:border-[#3b82f6] checked:bg-[#3b82f6] hover:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#3b82f6]/20" />
              <svg
                class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <label for="remember"
              class="text-xs text-zinc-400 cursor-pointer select-none hover:text-zinc-300 transition-colors">Manter-me
              conectado</label>
          </div>

          <!-- Submit Button -->
          <Button type="submit" :loading="form.processing"
            class="!w-full !bg-[#3b82f6] !text-white !font-bold !py-3 !rounded-lg !border-none !text-xs uppercase tracking-widest hover:!bg-[#2563eb] hover:!scale-[1.02] active:!scale-[0.98] transition-all shadow-lg shadow-[#3b82f6]/10 group mt-2">
            <span class="mr-2">Entrar</span>
            <ArrowRight v-if="!form.processing" class="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>

        </form>
      </div>

      <!-- Footer -->
      <p class="text-center text-xs text-zinc-500">
        Ainda não tem acesso?
        <Link href="/register" class="text-[#3b82f6] hover:text-[#2563eb] font-semibold transition-colors">Criar conta
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
